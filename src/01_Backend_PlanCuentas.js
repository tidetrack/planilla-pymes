/**
 * MÓDULO: ABM Cuentas Backend (Gestión de Catálogo Financiero)
 * 
 * [CONCEPTO DE NEGOCIO]
 * Este módulo gestiona el catálogo principal que usa la Pyme para clasificar sus transacciones económicas. 
 * Estandariza la entrada de datos para evitar desórdenes financieros y habilita el análisis automatizado de rentabilidad.
 * 
 * [FUNDAMENTO TEÓRICO / ADMINISTRATIVO]
 * Respeta la disciplina transaccional: Clasifica todo en Ingresos, Costos, Gastos, Resultados y Medios de Pago. 
 * Forza el uso de Unidades de Negocio (UEN) para permitir balances de gestión segmentados y análisis de centros de beneficio.
 * 
 * @see docs/permanente/notebookLM/TEMPLATE_FUNCIONALIDAD.md (Referencia Conceptual)
 */

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Finanzas Tidetrack')
    .addItem('Gestionar Plan de Cuentas', 'abrirAbmPlanCuentas')
    .addSeparator()
    .addItem('🛠️ Procesar Lote de Carga', 'procesarLoteCargas')
    .addItem('🛠️ Forzar Carga Histórica USD (Desde 2026)', 'forzarCargaHistoricaUSD')
    .addSeparator()
    .addItem('Contrato Tidetrack', 'mostrarLinkContrato')
    .addToUi();
}

function abrirAbmPlanCuentas() {
  const html = HtmlService.createTemplateFromFile('01_UI_PlanCuentas')
    .evaluate()
    .setTitle(' ')
    .setWidth(450)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, '          ');
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
  
  // UEN: Master list (AD)
  const rangosUEN = sheet.getRange(CONFIG.PLAN_CUENTAS.RANGOS_GLOBALES.UEN_MASTER + "3:" + CONFIG.PLAN_CUENTAS.RANGOS_GLOBALES.UEN_MASTER + lastRow).getValues();
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

       if (entityType === "MEDIOS_PAGO") {
          accountObj.moneda = row[1] || "";
          accountObj.proyecto = row[2] || "";
       } else if (entityType === "PROYECTOS") {
          accountObj.uen = row[1] || "";
       } else if (entityType === "CLIENTES" || entityType === "PROVEEDORES") {
          accountObj.cuit = row[1] || "";
          accountObj.proyecto = row[2] || "";
       } else if (entityType !== "UEN_MASTER") {
          accountObj.proyecto = row[1] || "";
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
  if (entityType === "PROYECTOS" && !uenRelacionada) throw new Error("La UEN es obligatoria para dar de alta un Proyecto.");

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

  if (entityType === "MEDIOS_PAGO") {
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(monedaRelacionada || "ARS");
    sheet.getRange(insertRow, bloque.colStart + 2).setValue(proyectoRelacionado || "");
  } else if (entityType === "PROYECTOS") {
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(uenRelacionada || "");
  } else if (entityType === "CLIENTES" || entityType === "PROVEEDORES") {
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(payload.cuit || "");
    sheet.getRange(insertRow, bloque.colStart + 2).setValue(proyectoRelacionado || "");
  } else if (entityType !== "UEN_MASTER") {
    sheet.getRange(insertRow, bloque.colStart + 1).setValue(proyectoRelacionado || "");
  }

  return { nombre: nombre };
}

/**
 * Actualiza una cuenta existente
 */
function updateAbmRecord(payload) {
  const { entityType, rowIndex, nombre, uenRelacionada, proyectoRelacionado, monedaRelacionada } = payload;
  if (!nombre) throw new Error("Debe proveer un nombre.");
  if (entityType === "PROYECTOS" && !uenRelacionada) throw new Error("La UEN es obligatoria para modificar un Proyecto.");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const bloque = CONFIG.PLAN_CUENTAS.BLOQUES[entityType];

  sheet.getRange(rowIndex, bloque.colStart).setValue(nombre.trim());

  if (entityType === "MEDIOS_PAGO") {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(monedaRelacionada || "ARS");
    sheet.getRange(rowIndex, bloque.colStart + 2).setValue(proyectoRelacionado || "");
  } else if (entityType === "PROYECTOS") {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(uenRelacionada || "");
  } else if (entityType === "CLIENTES" || entityType === "PROVEEDORES") {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(payload.cuit || "");
    sheet.getRange(rowIndex, bloque.colStart + 2).setValue(proyectoRelacionado || "");
  } else if (entityType !== "UEN_MASTER") {
    sheet.getRange(rowIndex, bloque.colStart + 1).setValue(proyectoRelacionado || "");
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
