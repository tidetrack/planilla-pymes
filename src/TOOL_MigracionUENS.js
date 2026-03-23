/**
 * MÓDULO: Migración UENs (Lean Code)
 * Único propósito: Actualizar masivamente las UENs en la hoja REGISTROS 
 * basándose en el mapeo oficial de Plan de Cuentas.
 */

function actualizarUENRegistros() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetCuentas = ss.getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const sheetRegistros = ss.getSheetByName("REGISTROS"); // Reparado a mayúsculas estrictas

  if (!sheetCuentas || !sheetRegistros) {
    SpreadsheetApp.getUi().alert(`Error Lean: Verifique que existan las pestañas '${CONFIG.HOJAS.PLAN_CUENTAS}' y 'REGISTROS'.`);
    return;
  }

  ss.toast("Construyendo diccionario de cuentas...", "Lean Code Expert", 2);

  const lastRowCuentas = Math.max(sheetCuentas.getLastRow(), 3);
  const mapaUEN = new Map();
  const normalizar = (texto) => texto ? texto.toString().trim().toUpperCase() : "";

  // FETCH ÚNICO O(1) REQUEST A SHEETS (Columnas A hasta AD)
  const dataCuentas = sheetCuentas.getRange(3, 1, lastRowCuentas - 2, 30).getValues();

  // Mapeo Lean: Indices absolutos de (Nombre -> UEN) según 00_Config.js
  const offsets = [
    { nombre: 1, uen: 3 },   // Ingresos (B->D)
    { nombre: 6, uen: 8 },   // Costos (G->I)
    { nombre: 11, uen: 13 }, // Gastos (L->N)
    { nombre: 16, uen: 18 }, // Fiscal (Q->S)
    { nombre: 23, uen: 24 }, // Resultados (X->Y)
    { nombre: 26, uen: 29 }  // Medios Pago (AA->AD)
  ];

  for (let i = 0; i < dataCuentas.length; i++) {
    for (let j = 0; j < offsets.length; j++) {
      const celdaNombre = dataCuentas[i][offsets[j].nombre];
      const celdaUEN = dataCuentas[i][offsets[j].uen];
      if (celdaNombre) {
        mapaUEN.set(normalizar(celdaNombre), celdaUEN || "Sin UEN");
      }
    }
  }

  const lastRowReg = sheetRegistros.getLastRow();
  if (lastRowReg < 2) return ss.toast("La base de registros está vacía.", "Lean Code", 3);

  ss.toast("Procesando base de datos histórica...", "Lean Code Expert", 2);

  // FETCH ÚNICO O(1) PARA REGISTROS
  const rangoRegistros = sheetRegistros.getRange(2, 4, lastRowReg - 1, 3);
  const dataRegistros = rangoRegistros.getValues();

  // MAPEO PURAMENTE FUNCIONAL (En Memoria)
  const nuevasUENs = dataRegistros.map(fila => {
    const cuentaBuscada = normalizar(fila[0]);
    return [cuentaBuscada && mapaUEN.has(cuentaBuscada) ? mapaUEN.get(cuentaBuscada) : fila[2]];
  });

  // WRITE ÚNICO O(1)
  sheetRegistros.getRange(2, 6, nuevasUENs.length, 1).setValues(nuevasUENs);
  ss.toast("Migración de datos ejecutada con éxito (Lean).", "Operación Completada", 4);
}