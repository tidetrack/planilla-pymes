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

  // Rango con fallback defensivo por si el config fue desplegado parcialmente
  const rangoCompromisos = (CONFIG.RANGOS && CONFIG.RANGOS.CARGAS_COMPROMISOS) || "C31:I50";

  // 1. Leer Bloque B (C31:I50) → [Monto, Tipo, Contraparte, Cuenta, FechaReg(auto), FechaCompromiso, Nota]
  const datosDevengado = sheetCargas.getRange(rangoCompromisos).getValues();

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
    // [K=Monto, L=Tipo, M=Contraparte, N=Cuenta, O=Moneda, P=FechaCompromiso, Q=Nota]
    const [monto, tipo, contraparte, cuenta, monedaCarga, fechaCompromiso, nota] = datosDevengado[i];

    if (!monto || monto === "" || !tipo || tipo === "") continue;

    const cuentaTrim = cuenta ? cuenta.toString().trim() : "";
    const contrapTrim = contraparte ? contraparte.toString().trim() : "";

    const proyecto = mapCuentaProyecto[cuentaTrim] || "";
    const uen = mapProyectoUEN[proyecto.toString().trim()] || "";

    const id = _generarIdDevengado(tipo.toString().trim(), sheetCompromisos);

    // Fila a insertar en Registros - Compromisos (cols B a R)
    nuevasFilas.push([
      id,                              // B: ID
      new Date(),                      // C: Fecha Registro (hoy)
      fechaCompromiso || "",           // D: Fecha Compromiso
      monto,                           // E: Monto Comprometido
      monedaCarga || "ARS",            // F: Moneda
      null,                            // G: Total Imputado (fórmula se inyecta después)
      null,                            // H: Saldo (fórmula)
      null,                            // I: Fecha Último Pago (fórmula)
      null,                            // J: Estado (fórmula)
      tipo,                            // K: Tipo
      contrapTrim,                     // L: Cliente / Proveedor
      cuentaTrim,                      // M: Cuenta
      proyecto,                        // N: Proyecto Asociado
      uen,                             // O: UEN Asociada
      usdVenta,                        // P: Cotización USD Venta
      usdCompra,                       // Q: Cotización USD Compra
      nota || ""                       // R: Nota
    ]);
  }

  if (nuevasFilas.length === 0) {
    SpreadsheetApp.getUi().alert("No hay compromisos válidos en el lote (K4:Q23). Asegurate de completar al menos Monto y Tipo.");
    return;
  }

  // 6. Insertar filas en "Registros - Compromisos" y luego inyectar fórmulas
  const insertRow = 4;
  sheetCompromisos.insertRowsBefore(insertRow, nuevasFilas.length);
  sheetCompromisos.getRange(insertRow, 2, nuevasFilas.length, 17).setValues(nuevasFilas);

  // Copiar formato desde la antigua primera fila de datos (ahora desplazada)
  const filaFormatoOrigen  = sheetCompromisos.getRange(insertRow + nuevasFilas.length, 1, 1, sheetCompromisos.getMaxColumns());
  const filaFormatoDestino = sheetCompromisos.getRange(insertRow, 1, nuevasFilas.length, sheetCompromisos.getMaxColumns());
  filaFormatoOrigen.copyTo(filaFormatoDestino, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);

  // 7. Inyectar fórmulas calculadas (G, H, I, J) — setFormula() SIEMPRE requiere nombres en inglés
  for (let r = 0; r < nuevasFilas.length; r++) {
    const fila  = insertRow + r;
    const idRef = `B${fila}`;
    
    const fTotalImputado = `=IF(F${fila}="USD", IFERROR(SUM(FILTER('Registros - Movimientos'!C:C, 'Registros - Movimientos'!N:N=${idRef}, 'Registros - Movimientos'!J:J="USD")), 0) + IFERROR(SUM(FILTER('Registros - Movimientos'!C:C / 'Registros - Movimientos'!L:L, 'Registros - Movimientos'!N:N=${idRef}, 'Registros - Movimientos'!J:J="ARS")), 0), IFERROR(SUM(FILTER('Registros - Movimientos'!C:C, 'Registros - Movimientos'!N:N=${idRef}, 'Registros - Movimientos'!J:J="ARS")), 0) + IFERROR(SUM(FILTER('Registros - Movimientos'!C:C * 'Registros - Movimientos'!L:L, 'Registros - Movimientos'!N:N=${idRef}, 'Registros - Movimientos'!J:J="USD")), 0))`;
    
    sheetCompromisos.getRange(fila, 7).setFormula(fTotalImputado);                                                                            // G: Total Imputado
    sheetCompromisos.getRange(fila, 8).setFormula(`=E${fila}-G${fila}`);                                                                      // H: Saldo
    sheetCompromisos.getRange(fila, 9).setFormula(`=IFERROR(IF(MAXIFS('Registros - Movimientos'!B:B,'Registros - Movimientos'!N:N,${idRef})=0,"",MAXIFS('Registros - Movimientos'!B:B,'Registros - Movimientos'!N:N,${idRef})),"")`); //I: Fecha Último Pago
    sheetCompromisos.getRange(fila, 10).setFormula(`=IF(H${fila}<=0,"Cancelado",IF(G${fila}>0,"Parcial","Pendiente"))`);                      // J: Estado
  }

  // 8. Limpiar el Bloque B en Cargas
  sheetCargas.getRange(rangoCompromisos).clearContent();

  try { ss.toast(`${nuevasFilas.length} compromiso(s) registrado(s) correctamente.`, "Tidetrack", 4); } catch(e) {}
}
