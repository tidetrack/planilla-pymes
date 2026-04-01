/**
 * 04_Backend_Presupuesto.js
 * Módulo de procesamiento de lotes de Presupuesto.
 *
 * [CONCEPTO DE NEGOCIO]
 * Lee el Bloque C de la hoja "Cargas" (C56:I75), infiere Tipo/Proyecto/UEN
 * desde el Plan de Cuentas, obtiene cotización FX live y escribe en
 * "Registros - Presupuesto" (BD normalizada, cols B:L, datos desde fila 6).
 *
 * Estructura de Cargas Bloque C (C56:I75, fila 55 = encabezado):
 *   C=Monto, D=Cuenta, E=(merged), F=Moneda, G=FechaPresupuestada(manual), H=Nota, I=(merged)
 *
 * Destino BD "Registros - Presupuesto" (cols B:L, fila 5 = enc., datos desde fila 6):
 *   B=FechaCarga(auto-processing), C=Monto, D=FechaPresupuestada, E=Tipo, F=Cuenta,
 *   G=ProyectoAsociado, H=UnidadAsociada, I=Moneda, J=Nota,
 *   K=CotizUSDVenta, L=CotizUSDCompra
 */

function procesarLotePresupuesto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetCargas      = ss.getSheetByName(CONFIG.HOJAS.CARGAS);
  const sheetPresupuesto = ss.getSheetByName(CONFIG.HOJAS.PRESUPUESTO);
  const sheetPlanCuentas = ss.getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);

  const faltantes = [];
  if (!sheetCargas)      faltantes.push(CONFIG.HOJAS.CARGAS);
  if (!sheetPresupuesto) faltantes.push(CONFIG.HOJAS.PRESUPUESTO);
  if (!sheetPlanCuentas) faltantes.push(CONFIG.HOJAS.PLAN_CUENTAS);
  if (faltantes.length > 0) {
    SpreadsheetApp.getUi().alert("Error: Faltan estas hojas: " + faltantes.join(", "));
    return;
  }

  try { ss.toast("Procesando lote de Presupuesto...", "Tidetrack", 3); } catch(e) {}

  // Rango con fallback defensivo por si el config fue desplegado parcialmente
  const rangoPresupuesto = (CONFIG.RANGOS && CONFIG.RANGOS.CARGAS_PRESUPUESTO) || "C56:I75";

  // 1. Leer Bloque C (C56:I75)
  // Cols C-I → índices [0..6]: Monto(C), Cuenta(D), vacío(E), Moneda(F), FechaPresupuestada(G), Nota(H), vacío(I)
  const datos = sheetCargas.getRange(rangoPresupuesto).getValues();

  // 2. Mapas Plan de Cuentas: Cuenta → Tipo, Cuenta → Proyecto
  const mapCuentaTipo     = {};
  const mapCuentaProyecto = {};
  const datosPC = sheetPlanCuentas.getRange("B3:Y").getValues();
  for (let r = 0; r < datosPC.length; r++) {
    const row = datosPC[r];
    if (row[0])  { mapCuentaTipo[row[0].toString().trim()] = "Ingresos y Recursos"; mapCuentaProyecto[row[0].toString().trim()]  = row[1]; }
    if (row[4])  { mapCuentaTipo[row[4].toString().trim()] = "Costos de Ventas";    mapCuentaProyecto[row[4].toString().trim()]  = row[5]; }
    if (row[8])  { mapCuentaTipo[row[8].toString().trim()] = "Gastos";              mapCuentaProyecto[row[8].toString().trim()]  = row[9]; }
    if (row[12]) { mapCuentaTipo[row[12].toString().trim()] = "Carga Fiscal";       mapCuentaProyecto[row[12].toString().trim()] = row[13]; }
    if (row[18]) { mapCuentaTipo[row[18].toString().trim()] = "Resultados";         mapCuentaProyecto[row[18].toString().trim()] = row[19]; }
    if (row[16]) { mapCuentaTipo[row[16].toString().trim()] = "Movimientos"; }
  }

  // 3. Mapa Proyecto → UEN (AA:AB)
  const mapProyectoUEN = {};
  const datosProyectos = sheetPlanCuentas.getRange("AA3:AB").getValues();
  for (let r = 0; r < datosProyectos.length; r++) {
    if (datosProyectos[r][0]) {
      mapProyectoUEN[datosProyectos[r][0].toString().trim()] = datosProyectos[r][1] || "";
    }
  }

  // 4. Cotización FX live
  let usdVenta = 1, usdCompra = 1;
  const liveRate = fetchCotizacionDolar();
  if (liveRate && liveRate.venta) {
    usdVenta  = liveRate.venta;
    usdCompra = liveRate.compra;
  }

  // 5. Procesar filas
  // Cols C-I → índices [0..6]: Monto(C), Cuenta(D), vacío(E), Moneda(F), FechaPresupuestada(G), Nota(H), vacío(I)
  // FechaCarga = new Date() generada al momento del procesamiento (no viene de la hoja)
  const nuevasFilas = [];
  for (let i = 0; i < datos.length; i++) {
    const [monto, cuenta, , moneda, fechaPresupuestada, nota] = datos[i];
    if (!monto || monto === "") continue;

    const cuentaTrim   = cuenta ? cuenta.toString().trim() : "";
    const monedaTrim   = moneda ? moneda.toString().trim() : "ARS";
    const notaTrim     = nota   ? nota.toString().trim()   : "";
    const tipo         = mapCuentaTipo[cuentaTrim]     || "";
    const proyecto     = mapCuentaProyecto[cuentaTrim] || "";
    const uen          = mapProyectoUEN[proyecto.toString().trim()] || "";
    const fechaCargaFinal = new Date();  // timestamp del procesamiento
    const fechaPresFinal  = fechaPresupuestada instanceof Date ? fechaPresupuestada : (fechaPresupuestada || "");

    // BD cols B-L (11 columnas)
    nuevasFilas.push([
      fechaCargaFinal,  // B: Fecha carga (auto)
      monto,            // C: Monto
      fechaPresFinal,   // D: Fecha presupuestada (manual)
      tipo,             // E: Tipo (auto-inferido)
      cuentaTrim,       // F: Cuenta
      proyecto,         // G: Proyecto Asociado (auto)
      uen,              // H: Unidad Asociada (auto)
      monedaTrim,       // I: Moneda
      notaTrim,         // J: Nota
      usdVenta,         // K: Cotización USD Venta (auto)
      usdCompra         // L: Cotización USD Compra (auto)
    ]);
  }

  if (nuevasFilas.length === 0) {
    SpreadsheetApp.getUi().alert("No hay registros válidos en el Bloque C (C56:I75). Completá al menos Monto y Cuenta.");
    return;
  }

  // 6. Insertar en "Registros - Presupuesto" desde fila 6 (fila 5 = encabezados)
  const INSERT_ROW = 6;
  sheetPresupuesto.insertRowsBefore(INSERT_ROW, nuevasFilas.length);
  sheetPresupuesto.getRange(INSERT_ROW, 2, nuevasFilas.length, 11).setValues(nuevasFilas);

  // Copiar formato desde la antigua primera fila de datos (ahora desplazada)
  const filaFormatoOrigen = sheetPresupuesto.getRange(INSERT_ROW + nuevasFilas.length, 1, 1, sheetPresupuesto.getMaxColumns());
  const filaFormatoDestino = sheetPresupuesto.getRange(INSERT_ROW, 1, nuevasFilas.length, sheetPresupuesto.getMaxColumns());
  filaFormatoOrigen.copyTo(filaFormatoDestino, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);

  // 7. Ordenar por Fecha carga (col B = col 2) de Z a A (descendente)
  const totalDataRows = sheetPresupuesto.getLastRow() - INSERT_ROW + 1;
  if (totalDataRows > 0) {
    sheetPresupuesto.getRange(INSERT_ROW, 2, totalDataRows, 11).sort({ column: 2, ascending: false });
  }

  // 8. Limpiar Bloque C en Cargas
  sheetCargas.getRange(rangoPresupuesto).clearContent();

  try { ss.toast(`${nuevasFilas.length} presupuesto(s) registrado(s) correctamente.`, "Tidetrack", 4); } catch(e) {}
}
