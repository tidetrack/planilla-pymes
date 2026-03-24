// --- CONFIGURACIÓN GLOBAL ---
const HOJA_CUENTAS_NAME = "Plan de Cuentas";
const HOJA_PANEL_NAME = "PANEL";
const HOJA_CARGA_NAME = "Cargas";

// =================================================================
// MAPA DE COLUMNAS DE LA HOJA "CARGAS"
// A=1, B=2, C=3 (Monto), G=7 (Fecha)
// =================================================================
const COL_MONTO_IN       = 3; // (C) Trigger para poner fecha
const COL_FECHA_OUT      = 7; // (G) Dónde se escribe la fecha

// Configuraciones para Lógica D (Checkboxes en Panel)
const COL_STORAGE_NOMBRES = 96; // Columna CR
const COL_STORAGE_ESTADO = 97;  // Columna CS

// Diccionario centralizado de variables financieras
const CONFIG_FINANCIERA = {
  "dolar_vta":  { hoja: "ANUAL - PRES.", celda: "K55" },
  "dolar_cpra": { hoja: "ANUAL - PRES.", celda: "K56" }
};

function onEdit(e) {
  if (!e || !e.range) return;

  const ss = e.source;
  const sheet = ss.getActiveSheet();
  const sheetName = sheet.getName();
  const range = e.range;
  const col = range.getColumn();
  const row = range.getRow();

  // =================================================================
  // BLOQUE 1: LÓGICA EXCLUSIVA DE HOJA "CARGAS"
  // =================================================================
  if (sheetName === HOJA_CARGA_NAME && row >= 4 && row <= 23) {
    if (col === COL_MONTO_IN) {
      const cellFecha = sheet.getRange(row, COL_FECHA_OUT); 
      // Si insertó un número en Monto y la Fecha estaba vacía
      if (cellFecha.getValue() === "" && range.getValue() !== "") {
        cellFecha.setValue(new Date());
      }
      return; 
    }
  }

  // =================================================================
  // BLOQUE 2: LÓGICA EXCLUSIVA DE HOJA "PANEL"
  // =================================================================
  if (sheetName === HOJA_PANEL_NAME) {
    const CELDA_FILTRO = "F12";
    const COL_NOMBRE_VISIBLE = 11;   
    const COL_CHECKBOX_VISIBLE = 12; 

    if (range.getA1Notation() === CELDA_FILTRO) {
      ss.toast("🔄 Sincronizando...", "Tidetrack", 1);
      Utilities.sleep(150); 
      sincronizarDesdeStorage(sheet, COL_NOMBRE_VISIBLE, COL_CHECKBOX_VISIBLE);
      return; 
    }

    if (col === COL_CHECKBOX_VISIBLE && row >= 6) {
      const nombreCuenta = sheet.getRange(row, COL_NOMBRE_VISIBLE).getValue();
      if (nombreCuenta && nombreCuenta !== "" && nombreCuenta !== "#N/A") {
        const estado = range.getValue(); 
        guardarEnStorage(sheet, nombreCuenta, estado);
      }
      return; 
    }
  }

  // =================================================================
  // BLOQUE 3: VARIABLES DINÁMICAS (Cualquier hoja)
  // =================================================================
  const formula = range.getFormula();
  if (formula.startsWith('=')) {
    procesarVariablesDinamicas(ss, range, formula);
  }
}

// =============================================================
// FUNCIONES AUXILIARES
// =============================================================

function buscarProyecto(ss, cuentaBuscada) {
  const sheetCuentas = ss.getSheetByName(HOJA_CUENTAS_NAME);
  if (!sheetCuentas) return null;

  const lastRow = sheetCuentas.getLastRow();
  if (lastRow < 3) return null; 

  const data = sheetCuentas.getRange(3, 1, lastRow - 2, 19).getValues();
  const busqueda = cuentaBuscada.toString().trim().toUpperCase();

  const colsConProyecto = [1, 4, 7, 10, 15, 17];
  const colsSinProyecto = [13, 14];

  for (let i = 0; i < data.length; i++) {
    const fila = data[i];
    
    for (let c of colsConProyecto) {
      if (fila[c] && fila[c].toString().trim().toUpperCase() === busqueda) {
        const proyecto = fila[c + 1];
        return (proyecto && proyecto.toString().trim() !== "") ? proyecto : "";
      }
    }
    
    for (let c of colsSinProyecto) {
      if (fila[c] && fila[c].toString().trim().toUpperCase() === busqueda) {
        return ""; 
      }
    }
  }
  return ""; 
}

function buscarMonedaYTC(ss, medioBuscado) {
  const sheetCuentas = ss.getSheetByName(HOJA_CUENTAS_NAME);
  if (!sheetCuentas) return null;

  const maxRow = sheetCuentas.getLastRow();
  if (maxRow < 3) return null;

  const data = sheetCuentas.getRange(3, 22, maxRow - 2, 4).getValues();
  const busqueda = medioBuscado.toString().trim().toUpperCase();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim().toUpperCase() === busqueda) {
      return { moneda: "ARS", isUSD: false };
    }
    if (data[i][3] && data[i][3].toString().trim().toUpperCase() === busqueda) {
      return { moneda: "USD", isUSD: true };
    }
  }
  return null;
}

// MOTOR DE AUDITORÍA HISTÓRICA Y TIEMPO REAL
function obtenerCotizacionHistorica(ss, fechaTx) {
  const tz = ss.getSpreadsheetTimeZone();
  
  let dateObj = new Date(fechaTx);
  if (isNaN(dateObj.getTime())) {
     dateObj = new Date(); 
  }
  
  // Forzamos al mediodía para aniquilar el bug de zona horaria / medianoche
  dateObj.setHours(12, 0, 0, 0);
  const txNum = parseInt(Utilities.formatDate(dateObj, tz, "yyyyMMdd"), 10);

  // Compuerta lógica para transacciones de "hoy"
  let hoyObj = new Date();
  hoyObj.setHours(12, 0, 0, 0);
  const hoyNum = parseInt(Utilities.formatDate(hoyObj, tz, "yyyyMMdd"), 10);

  if (txNum >= hoyNum) {
    const config = CONFIG_FINANCIERA["dolar_vta"];
    const sheetPres = ss.getSheetByName(config.hoja);
    if (sheetPres) {
      const val = sheetPres.getRange(config.celda).getValue();
      if (typeof val === 'number' && !isNaN(val)) return val;
    }
  }

  // Fallback al histórico si la transacción es en el pasado
  const sheetHistorico = ss.getSheetByName("ANUAL - REAL");
  if (!sheetHistorico) return 1;

  const lastRow = sheetHistorico.getLastRow();
  if (lastRow < 3) return 1;

  const data = sheetHistorico.getRange("CY3:CZ" + lastRow).getValues();
  
  let tcEncontrado = 1;
  let menorDiferencia = Infinity;

  for (let i = 0; i < data.length; i++) {
    if (!data[i][0]) continue;
    
    let fechaFila = new Date(data[i][0]);
    if (isNaN(fechaFila.getTime())) continue;

    fechaFila.setHours(12, 0, 0, 0);
    const filaNum = parseInt(Utilities.formatDate(fechaFila, tz, "yyyyMMdd"), 10);

    // Coincidencia estricta por día
    if (filaNum === txNum) {
      return Number(data[i][1]) || 1;
    }
    
    // Retroceso para fines de semana
    if (filaNum < txNum) {
       const diff = txNum - filaNum;
       if (diff < menorDiferencia) {
          menorDiferencia = diff;
          tcEncontrado = Number(data[i][1]) || 1;
       }
    }
  }
  return tcEncontrado;
}

function guardarEnStorage(sheet, cuenta, estado) {
  const maxRows = sheet.getMaxRows();
  const dataNombres = sheet.getRange(1, COL_STORAGE_NOMBRES, maxRows, 1).getValues().flat();
  const cuentaNorm = cuenta.toString().trim().toUpperCase();
  const index = dataNombres.findIndex(n => n && n.toString().trim().toUpperCase() === cuentaNorm);
  
  if (index !== -1) {
    sheet.getRange(index + 1, COL_STORAGE_ESTADO).setValue(estado);
  }
}

function sincronizarDesdeStorage(sheet, colNombreVis, colCheckVis) {
  SpreadsheetApp.flush(); 

  const lastRowK = sheet.getLastRow();
  if (lastRowK < 6) return; 

  const cuentasVisibles = sheet.getRange(6, colNombreVis, lastRowK - 5, 1).getValues().flat();
  const maxRows = sheet.getMaxRows();
  const dataStorage = sheet.getRange(1, COL_STORAGE_NOMBRES, maxRows, 2).getValues();
  
  let mapa = {};
  dataStorage.forEach(fila => {
    if (fila[0]) {
      const key = fila[0].toString().trim().toUpperCase();
      mapa[key] = fila[1];
    }
  });

  let nuevosEstados = cuentasVisibles.map(cuenta => {
    if (!cuenta || cuenta === "" || cuenta === "#N/A") return [false];
    const key = cuenta.toString().trim().toUpperCase();
    return [mapa[key] === true];
  });

  if (nuevosEstados.length > 0) {
    sheet.getRange(6, colCheckVis, nuevosEstados.length, 1).setValues(nuevosEstados);
  }
}

function procesarVariablesDinamicas(ss, range, formula) {
    let nuevaFormula = formula;
    let huboCambio = false;
    for (const [key, origen] of Object.entries(CONFIG_FINANCIERA)) {
      const regex = new RegExp(key, "gi"); 
      if (regex.test(nuevaFormula)) {
        const h = ss.getSheetByName(origen.hoja);
        if (h) {
          const val = h.getRange(origen.celda).getValue();
          if (typeof val === 'number' && !isNaN(val)) {
            nuevaFormula = nuevaFormula.replace(regex, val);
            huboCambio = true;
          }
        }
      }
    }
    if (huboCambio) range.setFormula(nuevaFormula);
}