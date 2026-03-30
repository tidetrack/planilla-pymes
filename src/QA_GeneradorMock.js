/**
 * QA_GeneradorMock.js
 * Módulo de Testing: inyecta lotes enteros de 20 registros falsos
 * en los 3 bloques principales de "Cargas" para probar flujos E2E.
 */

function generarLotesDePrueba() {
  const ui = SpreadsheetApp.getUi();

  // 1. Selector de Lote
  const targetResp = ui.prompt("Generador QA", "Seleccioná qué bloque testear:\n1: Movimientos\n2: Compromisos\n3: Presupuesto\n4: Todos los bloques\n(Ingresá 1, 2, 3 o 4):", ui.ButtonSet.OK_CANCEL);
  if (targetResp.getSelectedButton() !== ui.Button.OK) return;
  const targetChoice = targetResp.getResponseText().trim();
  if (!["1", "2", "3", "4"].includes(targetChoice)) {
    ui.alert("Opción no válida.");
    return;
  }

  // 2. Selector de Fecha
  const resp = ui.prompt("Generador QA", "Ingresá el mes a simular (MM/YYYY) \nEj: 04/2026", ui.ButtonSet.OK_CANCEL);
  
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  const input = resp.getResponseText().trim();
  
  const partes = input.split("/");
  if(partes.length !== 2) {
    ui.alert("Formato inválido. Debe ser MM/YYYY.");
    return;
  }
  
  const mes = parseInt(partes[0], 10);
  const anio = parseInt(partes[1], 10);
  
  if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) {
    ui.alert("Fecha inválida.");
    return;
  }

  const sheetCargas = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.HOJAS.CARGAS);
  if (!sheetCargas) { ui.alert("No se halló la hoja Cargas."); return; }

  // 3. Obtener Data real del catálogo para no romper Validación de Datos
  const cuentasIngresos = getCategoryAccounts("INGRESOS").map(a => a.nombre);
  const cuentasEgresos = [
    ...getCategoryAccounts("COSTOS").map(a => a.nombre),
    ...getCategoryAccounts("GASTOS").map(a => a.nombre),
    ...getCategoryAccounts("FISCAL").map(a => a.nombre)
  ];
  const medios = getCategoryAccounts("MEDIOS_PAGO").map(a => a.nombre);
  const clientes = getCategoryAccounts("CLIENTES").map(a => a.nombre);
  const proveedores = getCategoryAccounts("PROVEEDORES").map(a => a.nombre);

  if (cuentasIngresos.length === 0 || cuentasEgresos.length === 0 || medios.length === 0) {
    ui.alert("Faltan Datos Fundamentales", "Debés crear al menos un Ingreso, Egreso y Medio de Pago en el ABM antes de generar mocks, para no romper la Validación de Google Sheets.", ui.ButtonSet.OK);
    return;
  }

  if (["2", "4"].includes(targetChoice) && (clientes.length === 0 || proveedores.length === 0)) {
    ui.alert("Faltan Contrapartes", "Para simular Compromisos, necesitás tener registrado al menos 1 Cliente y 1 Proveedor en el ABM para no violar la regla de validación de Sheets.", ui.ButtonSet.OK);
    return;
  }

  const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Arrays contenedores
  const arrMovimientos = [];
  const arrCompromisos = [];
  const arrPresupuestos = [];
  
  const randFechaMes = () => new Date(anio, mes - 1, randNum(1, 28));
  const randFechaPresupuesto = () => new Date(anio, mes - 1, 1);

  for (let i = 0; i < 20; i++) {
    // --- MOVIMIENTOS ---
    if (["1", "4"].includes(targetChoice)) {
      const tipoMov = Math.random() > 0.5 ? "Ingreso" : "Egreso";
      const cuentaMov = tipoMov === "Ingreso" ? randItem(cuentasIngresos) : randItem(cuentasEgresos);
      arrMovimientos.push([
        randNum(15000, 800000), 
        tipoMov, 
        cuentaMov, 
        randItem(medios), 
        randFechaMes(), 
        "QA Auto-Mov", 
        ""
      ]);
    }

    // --- COMPROMISOS ---
    if (["2", "4"].includes(targetChoice)) {
      const tipoComp = Math.random() > 0.5 ? "Por Cobrar" : "Por Pagar";
      const cuentaComp = tipoComp === "Por Cobrar" ? randItem(cuentasIngresos) : randItem(cuentasEgresos);
      const contraparte = tipoComp === "Por Cobrar" ? randItem(clientes) : randItem(proveedores);
      arrCompromisos.push([
        randNum(30000, 1500000),
        tipoComp,
        contraparte,
        cuentaComp,
        new Date(), // Registrado hoy
        randFechaMes(), // Vencimiento / Compromiso
        "QA Auto-Comp"
      ]);
    }

    // --- PRESUPUESTO ---
    if (["3", "4"].includes(targetChoice)) {
      const cuentaPresup = randItem([...cuentasIngresos, ...cuentasEgresos]);
      const moneda = Math.random() > 0.8 ? "USD" : "ARS";
      arrPresupuestos.push([
        randNum(50000, 2000000),
        cuentaPresup,
        "",
        moneda,
        new Date(),
        randFechaPresupuesto(),
        "QA Auto-Presup"
      ]);
    }
  }

  // 4. Limpiar y Escribir en la hoja Cargas según elección
  if (["1", "4"].includes(targetChoice)) {
    sheetCargas.getRange(CONFIG.RANGOS.CARGAS_MOVIMIENTOS).clearContent();
    sheetCargas.getRange("C6:I25").setValues(arrMovimientos);
  }
  
  if (["2", "4"].includes(targetChoice)) {
    sheetCargas.getRange(CONFIG.RANGOS.CARGAS_COMPROMISOS).clearContent();
    sheetCargas.getRange("C31:I50").setValues(arrCompromisos);
  }

  if (["3", "4"].includes(targetChoice)) {
    sheetCargas.getRange(CONFIG.RANGOS.CARGAS_PRESUPUESTO).clearContent();
    sheetCargas.getRange("C56:I75").setValues(arrPresupuestos);
  }

  const moduloNombres = ["Movimientos", "Compromisos", "Presupuesto", "Los 3 bloques"];
  ui.alert("QA Testing", `✅ Se inyectaron exitosamente 20 registros falsos para: ${moduloNombres[parseInt(targetChoice)-1]}.`, ui.ButtonSet.OK);
}
