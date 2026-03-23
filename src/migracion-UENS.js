/**
 * Crea un menú personalizado en Google Sheets al abrir el documento.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚙️ Tidetrack')
    .addItem('Actualizar UEN en Registros', 'actualizarUENRegistros')
    .addToUi();
}

/**
 * Escanea la base histórica y mapea la UEN correspondiente según el plan de cuentas.
 */
function actualizarUENRegistros() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetCuentas = ss.getSheetByName("Plan de Cuentas");
  const sheetRegistros = ss.getSheetByName("Registros"); // Ajuste de mayúsculas por si acaso

  if (!sheetCuentas || !sheetRegistros) {
    SpreadsheetApp.getUi().alert("Error: No se encuentran las hojas 'Plan de Cuentas' o 'Registros'. Verifique los nombres en las pestañas.");
    return;
  }

  ss.toast("Construyendo diccionario de cuentas...", "Migración iniciada", 2);

  const lastRowCuentas = sheetCuentas.getLastRow();
  const dataCuentas = sheetCuentas.getRange(3, 1, lastRowCuentas - 2, 20).getValues();
  const mapaUEN = new Map();

  const normalizar = (texto) => texto ? texto.toString().trim().toUpperCase() : "";

  for (let i = 0; i < dataCuentas.length; i++) {
    const fila = dataCuentas[i];

    if (fila[1]) mapaUEN.set(normalizar(fila[1]), fila[2]);
    if (fila[5]) mapaUEN.set(normalizar(fila[5]), fila[6]);
    if (fila[9]) mapaUEN.set(normalizar(fila[9]), fila[10]);
    if (fila[13]) mapaUEN.set(normalizar(fila[13]), fila[14]);

    if (fila[17]) mapaUEN.set(normalizar(fila[17]), "UEN-Estructura Compartida");
    if (fila[19]) mapaUEN.set(normalizar(fila[19]), "UEN-Estructura Compartida");
  }

  const lastRowReg = sheetRegistros.getLastRow();
  if (lastRowReg < 2) {
    ss.toast("La hoja de registros está vacía.", "Aviso", 3);
    return;
  }

  ss.toast("Procesando base de datos histórica...", "Procesando", 2);

  const rangoRegistros = sheetRegistros.getRange(2, 4, lastRowReg - 1, 3);
  const dataRegistros = rangoRegistros.getValues();

  const nuevasUENs = dataRegistros.map(fila => {
    const cuenta = fila[0];
    const uenActual = fila[2];

    if (!cuenta) return [uenActual];

    const cuentaBuscada = normalizar(cuenta);
    if (mapaUEN.has(cuentaBuscada)) {
      return [mapaUEN.get(cuentaBuscada)];
    } else {
      return [uenActual];
    }
  });

  sheetRegistros.getRange(2, 6, nuevasUENs.length, 1).setValues(nuevasUENs);

  ss.toast("Migración de datos completada con éxito.", "Tidetrack Umoh", 4);
}