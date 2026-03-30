/**
 * QA_GeneradorMock.js
 * Módulo de Testing: inyecta lotes enteros de 20 registros falsos
 * en los 3 bloques principales de "Cargas" para probar flujos E2E.
 */

function generarLotesDePrueba() {
  const ui = SpreadsheetApp.getUi();
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

  // 1. Obtener Data real del catálogo
  const cuentasIngresos = getCategoryAccounts("INGRESOS").map(a => a.nombre);
  const cuentasEgresos = [
    ...getCategoryAccounts("COSTOS").map(a => a.nombre),
    ...getCategoryAccounts("GASTOS").map(a => a.nombre),
    ...getCategoryAccounts("FISCAL").map(a => a.nombre)
  ];
  const medios = getCategoryAccounts("MEDIOS_PAGO").map(a => a.nombre);
  const clientes = getCategoryAccounts("CLIENTES").map(a => a.nombre);
  const proveedores = getCategoryAccounts("PROVEEDORES").map(a => a.nombre);

  if (cuentasIngresos.length === 0) cuentasIngresos.push("Ingreso-Mock");
  if (cuentasEgresos.length === 0) cuentasEgresos.push("Gasto-Mock");
  if (medios.length === 0) medios.push("Caja Mock");
  if (clientes.length === 0) clientes.push("Cliente Mock");
  if (proveedores.length === 0) proveedores.push("Proveedor Mock");

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

    // --- COMPROMISOS ---
    const tipoComp = Math.random() > 0.5 ? "Por Cobrar" : "Por Pagar";
    const cuentaComp = tipoComp === "Por Cobrar" ? randItem(cuentasIngresos) : randItem(cuentasEgresos);
    const contraparte = tipoComp === "Por Cobrar" ? randItem(clientes) : randItem(proveedores);
    const fechaReg = new Date();
    arrCompromisos.push([
      randNum(30000, 1500000),
      tipoComp,
      contraparte,
      cuentaComp,
      fechaReg,
      randFechaMes(), 
      "QA Auto-Comp"
    ]);

    // --- PRESUPUESTO ---
    const cuentaPresup = randItem([...cuentasIngresos, ...cuentasEgresos]);
    const moneda = Math.random() > 0.8 ? "USD" : "ARS";
    arrPresupuestos.push([
      randNum(50000, 2000000),
      cuentaPresup,
      "",
      moneda,
      fechaReg,
      randFechaPresupuesto(),
      "QA Auto-Presup"
    ]);
  }

  // 2. Limpiar y Escribir en la hoja Cargas
  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_MOVIMIENTOS).clearContent();
  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_MOVIMIENTOS).setValues(arrMovimientos);
  
  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_COMPROMISOS).clearContent();
  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_COMPROMISOS).setValues(arrCompromisos);

  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_PRESUPUESTO).clearContent();
  sheetCargas.getRange(CONFIG.RANGOS.CARGAS_PRESUPUESTO).setValues(arrPresupuestos);

  ui.alert("QA Testing", "✅ Se inyectaron exitosamente 20 registros falsos coherentes en cada uno de los 3 bloques. Podés revisarlos y procesarlos uno por uno.", ui.ButtonSet.OK);
}
