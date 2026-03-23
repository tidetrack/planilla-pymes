/**
 * ABM_Cuentas_Backend.js
 * Gestiona el CRUD completo de la hoja Plan de Cuentas.
 */

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Finanzas Tidetrack')
    .addItem('Gestionar Plan de Cuentas', 'abrirAbmPlanCuentas')
    .addSeparator()
    .addItem('Contrato Tidetrack', 'mostrarLinkContrato')
    .addToUi();
}

function abrirAbmPlanCuentas() {
  const html = HtmlService.createTemplateFromFile('UI_AbmPlanCuentas')
    .evaluate()
    .setTitle('Gestión Plan de Cuentas')
    .setWidth(450)
    .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, 'Plan de Cuentas PYME');
}

function mostrarLinkContrato() {
  const link = "https://drive.google.com/file/d/1taDVXVekvNZ90vx28OteF4s_IRLkmIdq/view?usp=drive_link";
  var htmlOutput = HtmlService.createHtmlOutput(
    `<div style="font-family: sans-serif; padding: 20px; text-align: center;">
       <a href="${link}" target="_blank" style="padding: 10px 20px; background: #eee; text-decoration: none; color: #333; border-radius: 4px;">Abrir Contrato</a>
     </div>`
  ).setWidth(300).setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Enlace');
}

/**
 * Retorna datos para poblar el UI form (Monedas, Proyectos, UEN)
 */
function getAbmFormData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  if (!sheet) throw new Error("No se encontró la hoja: " + CONFIG.HOJAS.PLAN_CUENTAS);

  const lastRow = Math.max(sheet.getLastRow(), 3);
  
  // Proyectos: Col AF
  const rangosProyectos = sheet.getRange(CONFIG.PLAN_CUENTAS.RANGOS_GLOBALES.PROYECTOS + "3:" + CONFIG.PLAN_CUENTAS.RANGOS_GLOBALES.PROYECTOS + lastRow).getValues();
  const proyectosUnicos = [...new Set(rangosProyectos.flat().filter(p => p && p.toString().trim() !== ""))].sort();
  
  // UEN: Col AH
  const rangosUEN = sheet.getRange(CONFIG.PLAN_CUENTAS.RANGOS_GLOBALES.UEN + "3:" + CONFIG.PLAN_CUENTAS.RANGOS_GLOBALES.UEN + lastRow).getValues();
  const uenUnicas = [...new Set(rangosUEN.flat().filter(u => u && u.toString().trim() !== ""))].sort();
  
  return { 
    proyectos: proyectosUnicos,
    uens: uenUnicas,
    monedas: ["ARS", "USD", "EUR"] 
  };
}

/**
 * Obtiene todas las cuentas de una categoría específica para el buscador
 */
function getCategoryAccounts(entityType) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const bloque = CONFIG.PLAN_CUENTAS.BLOQUES[entityType];
  if (!bloque) throw new Error("Categoría no válida.");

  const lastRow = Math.max(sheet.getLastRow(), 3);
  const data = sheet.getRange(3, bloque.colStart, lastRow - 2, bloque.colCols).getValues();

  let accounts = [];
  data.forEach((row, idx) => {
    const nombre = row[0] ? row[0].toString().trim() : "";
    if (nombre !== "") {
       let accountObj = {
          nombre: nombre,
          rowIndex: idx + 3,
          moneda: "",
          proyecto: "",
          uen: ""
       };

       if (entityType === "RESULTADOS") {
          accountObj.uen = row[1] || "";
       } else if (entityType === "MEDIOS_PAGO") {
          accountObj.moneda = row[1] || "";
          accountObj.proyecto = row[2] || "";
          accountObj.uen = row[3] || "";
       } else { // Ingresos, Costos, Gastos, Fiscal
          accountObj.proyecto = row[1] || "";
          accountObj.uen = row[2] || "";
          // row[3] fecha de vencimiento (no editable desde abm por ahora)
       }

       accounts.push(accountObj);
    }
  });

  return accounts;
}

/**
 * Crea una nueva cuenta
 */
function saveAbmRecord(payload) {
  const { entityType, nombre, uenRelacionada, proyectoRelacionado, monedaRelacionada } = payload;
  if (!nombre) throw new Error("Debe proveer un nombre para la cuenta.");
  if (!uenRelacionada) throw new Error("La UEN es obligatoria.");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const bloque = CONFIG.PLAN_CUENTAS.BLOQUES[entityType];
  
  // Encontrar fila vacía
  const data = sheet.getRange(3, bloque.colStart, sheet.getMaxRows(), 1).getValues();
  let insertRow = 3;
  for (let i = 0; i < data.length; i++) {
     if (!data[i][0] || data[i][0].toString().trim() === "") {
        insertRow = i + 3;
        break;
     }
  }

  // Insertar según bloque
  sheet.getRange(insertRow, bloque.colStart).setValue(nombre.trim());

  if (entityType === "RESULTADOS") {
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(uenRelacionada);
  } else if (entityType === "MEDIOS_PAGO") {
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(monedaRelacionada || "ARS");
    sheet.getRange(insertRow, bloque.colStart + 2).setValue(proyectoRelacionado || "");
    sheet.getRange(insertRow, bloque.colStart + 3).setValue(uenRelacionada);
  } else {
    // Ingresos, Costos, Gastos, Fiscal
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(proyectoRelacionado || "");
    sheet.getRange(insertRow, bloque.colStart + 2).setValue(uenRelacionada);
  }

  return { nombre: nombre };
}

/**
 * Actualiza una cuenta existente
 */
function updateAbmRecord(payload) {
  const { entityType, rowIndex, nombre, uenRelacionada, proyectoRelacionado, monedaRelacionada } = payload;
  if (!nombre) throw new Error("Debe proveer un nombre.");
  if (!uenRelacionada) throw new Error("La UEN es obligatoria.");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const bloque = CONFIG.PLAN_CUENTAS.BLOQUES[entityType];

  sheet.getRange(rowIndex, bloque.colStart).setValue(nombre.trim());

  if (entityType === "RESULTADOS") {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(uenRelacionada);
  } else if (entityType === "MEDIOS_PAGO") {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(monedaRelacionada || "ARS");
    sheet.getRange(rowIndex, bloque.colStart + 2).setValue(proyectoRelacionado || "");
    sheet.getRange(rowIndex, bloque.colStart + 3).setValue(uenRelacionada);
  } else {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(proyectoRelacionado || "");
    sheet.getRange(rowIndex, bloque.colStart + 2).setValue(uenRelacionada);
  }

  return { nombre: nombre };
}

/**
 * Elimina una cuenta (limpia las celdas de ese bloque)
 */
function deleteAbmRecord(payload) {
  const { entityType, rowIndex } = payload;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const bloque = CONFIG.PLAN_CUENTAS.BLOQUES[entityType];

  // Limpiar rango completo del bloque
  sheet.getRange(rowIndex, bloque.colStart, 1, bloque.colCols).clearContent();
  return { success: true };
}
