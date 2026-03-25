/**
 * 03_Backend_Devengado.js
 * Módulo de procesamiento de compromisos (CxP / CxC).
 *
 * [CONCEPTO DE NEGOCIO]
 * Gestiona el ciclo de vida de los compromisos financieros devengados.
 * Lee el Módulo B de la hoja "Cargas" (K4:Q23), infiere Proyecto/UEN/FX,
 * genera un ID único correlativo y escribe en "Registros - Compromisos".
 * Las columnas de fórmulas (Total Imputado, Saldo, Estado) se insertan
 * como fórmulas nativas de Sheets para que se recalculen automáticamente.
 */

/**
 * Genera un ID único correlativo para el compromiso.
 * Formato: CXC-YYYYMMDD-NNN o CXP-YYYYMMDD-NNN
 */
function _generarIdDevengado(tipo, sheet) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoy = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyyMMdd");
  const prefijo = tipo === "Por Cobrar" ? "CXC" : "CXP";
  const base = `${prefijo}-${hoy}-`;

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return `${base}001`;

  const ids = sheet.getRange(4, 2, lastRow - 3, 1).getValues().flat().filter(id => id && id.toString().startsWith(base));
  const siguiente = ids.length + 1;
  return `${base}${String(siguiente).padStart(3, "0")}`;
}

/**
 * Procesa el lote de compromisos del Módulo B de la hoja Cargas (K4:Q23)
 * y los escribe en la hoja "Registros - Compromisos".
 */
function procesarLoteDevengado() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetCargas = ss.getSheetByName(CONFIG.HOJAS.CARGAS);
  const sheetCompromisos = ss.getSheetByName(CONFIG.HOJAS.COMPROMISOS);
  const sheetPlanCuentas = ss.getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const sheetTipoCambio = ss.getSheetByName(CONFIG.HOJAS.TIPO_CAMBIO);

  if (!sheetCargas || !sheetCompromisos || !sheetPlanCuentas || !sheetTipoCambio) {
    SpreadsheetApp.getUi().alert("Error: Falta una o más hojas requeridas. Verificá que existen: Cargas, Registros - Compromisos, Plan de Cuentas, Tipo de Cambio.");
    return;
  }

  try { ss.toast("Procesando compromisos devengados...", "Tidetrack", 3); } catch(e) {}

  // 1. Leer Módulo B: L4:R23 → [Monto, Tipo, Contraparte, Cuenta, FechaReg(auto), FechaCompromiso, Nota]
  const datosDevengado = sheetCargas.getRange(CONFIG.RANGOS.CARGAS_DEVENGADO).getValues();

  // 2. Construir mapa Cuenta → Proyecto desde Plan de Cuentas (mismo patrón que Carga_Registros)
  const mapCuentaProyecto = {};
  const datosPC = sheetPlanCuentas.getRange("B3:U").getValues();
  for (let r = 0; r < datosPC.length; r++) {
    const row = datosPC[r];
    if (row[0])  mapCuentaProyecto[row[0].toString().trim()]  = row[1];   // Ingresos B→C
    if (row[4])  mapCuentaProyecto[row[4].toString().trim()]  = row[5];   // Costos F→G
    if (row[8])  mapCuentaProyecto[row[8].toString().trim()]  = row[9];   // Gastos J→K
    if (row[12]) mapCuentaProyecto[row[12].toString().trim()] = row[13];  // Fiscal N→O
    if (row[18]) mapCuentaProyecto[row[18].toString().trim()] = row[19];  // Resultados T→U
  }

  // 3. Mapa Proyecto → UEN (AA:AB)
  const mapProyectoUEN = {};
  const datosProyectos = sheetPlanCuentas.getRange("AA3:AB").getValues();
  for (let r = 0; r < datosProyectos.length; r++) {
    if (datosProyectos[r][0]) {
      mapProyectoUEN[datosProyectos[r][0].toString().trim()] = datosProyectos[r][1] || "";
    }
  }

  // 4. Obtener cotización live de hoy
  const fechaHoy = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
  let usdVenta = 1, usdCompra = 1;
  const liveRate = fetchCotizacionDolar();
  if (liveRate && liveRate.venta) {
    usdVenta = liveRate.venta;
    usdCompra = liveRate.compra;
  } else {
    // Fallback a caché
    const datosFX = sheetTipoCambio.getRange("C4:E").getValues();
    for (const row of datosFX) {
      if (row[0]) {
        const f = row[0] instanceof Date
          ? Utilities.formatDate(row[0], ss.getSpreadsheetTimeZone(), "yyyy-MM-dd")
          : row[0].toString().trim();
        if (f === fechaHoy) { usdVenta = row[1] || 1; usdCompra = row[2] || 1; break; }
      }
    }
  }

  // 5. Procesar filas de Devengado
  const nuevasFilas = [];

  for (let i = 0; i < datosDevengado.length; i++) {
    // [K=Monto, L=Tipo, M=Contraparte, N=Cuenta, O=FechaReg(auto), P=FechaCompromiso, Q=Nota]
    const [monto, tipo, contraparte, cuenta, , fechaCompromiso, nota] = datosDevengado[i];

    if (!monto || monto === "" || !tipo || tipo === "") continue;

    const cuentaTrim = cuenta ? cuenta.toString().trim() : "";
    const contrapTrim = contraparte ? contraparte.toString().trim() : "";

    const proyecto = mapCuentaProyecto[cuentaTrim] || "";
    const uen = mapProyectoUEN[proyecto.toString().trim()] || "";

    const id = _generarIdDevengado(tipo.toString().trim(), sheetCompromisos);

    // Fila a insertar en Registros - Compromisos (cols B a Q)
    nuevasFilas.push([
      id,                              // B: ID
      new Date(),                      // C: Fecha Registro (hoy)
      fechaCompromiso || "",           // D: Fecha Compromiso
      monto,                           // E: Monto Comprometido
      null,                            // F: Total Imputado (fórmula se inyecta después)
      null,                            // G: Saldo (fórmula)
      null,                            // H: Fecha Último Pago (fórmula)
      null,                            // I: Estado (fórmula)
      tipo,                            // J: Tipo
      contrapTrim,                     // K: Cliente / Proveedor
      cuentaTrim,                      // L: Cuenta
      proyecto,                        // M: Proyecto Asociado
      uen,                             // N: UEN Asociada
      usdVenta,                        // O: Cotización USD Venta
      usdCompra,                       // P: Cotización USD Compra
      nota || ""                       // Q: Nota
    ]);
  }

  if (nuevasFilas.length === 0) {
    SpreadsheetApp.getUi().alert("No hay compromisos válidos en el lote (K4:Q23). Asegurate de completar al menos Monto y Tipo.");
    return;
  }

  // 6. Insertar filas en "Registros - Compromisos" y luego inyectar fórmulas
  const insertRow = 4;
  sheetCompromisos.insertRowsBefore(insertRow, nuevasFilas.length);
  sheetCompromisos.getRange(insertRow, 2, nuevasFilas.length, 16).setValues(nuevasFilas);

  // 7. Inyectar fórmulas en las columnas calculadas (F, G, H, I) por cada fila insertada
  for (let r = 0; r < nuevasFilas.length; r++) {
    const fila = insertRow + r;
    const idRef = `B${fila}`;
    sheetCompromisos.getRange(fila, 6).setFormula(`=SUMIF(Registros!M:M,${idRef},Registros!C:C)`);           // F: Total Imputado
    sheetCompromisos.getRange(fila, 7).setFormula(`=E${fila}-F${fila}`);                                      // G: Saldo
    sheetCompromisos.getRange(fila, 8).setFormula(`=IFERROR(MAXIFS(Registros!G:G,Registros!M:M,${idRef}),"")`); // H: Fecha Último Pago
    sheetCompromisos.getRange(fila, 9).setFormula(`=IF(G${fila}<=0,"Cancelado",IF(F${fila}>0,"Parcial","Pendiente"))`); // I: Estado
  }

  // 8. Limpiar el módulo B en Cargas
  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_DEVENGADO).clearContent();

  try { ss.toast(`${nuevasFilas.length} compromiso(s) registrado(s) correctamente.`, "Tidetrack", 4); } catch(e) {}
}
