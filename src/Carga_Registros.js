/**
 * Carga_Registros.js
 * Lógica principal para procesar lotes de datos desde la hoja 'Cargas'
 * y escribirlos en la hoja 'Registros de Movimientos' triangulando dimensiones.
 */

function procesarLoteCargas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetCargas = ss.getSheetByName(CONFIG.HOJAS.CARGAS);
  const sheetRegistros = ss.getSheetByName(CONFIG.HOJAS.REGISTROS);
  const sheetPlanCuentas = ss.getSheetByName(CONFIG.HOJAS.PLAN_CUENTAS);
  const sheetTipoCambio = ss.getSheetByName(CONFIG.HOJAS.TIPO_CAMBIO);

  let faltantes = [];
  if (!sheetCargas) faltantes.push(CONFIG.HOJAS.CARGAS);
  if (!sheetRegistros) faltantes.push(CONFIG.HOJAS.REGISTROS);
  if (!sheetPlanCuentas) faltantes.push(CONFIG.HOJAS.PLAN_CUENTAS);
  if (!sheetTipoCambio) faltantes.push(CONFIG.HOJAS.TIPO_CAMBIO);

  if (faltantes.length > 0) {
    SpreadsheetApp.getUi().alert("Error: No se encontraron estas hojas exactas: " + faltantes.join(", "));
    return;
  }

  // 1. Leer rango de Cargas C4:H23
  // [Monto, Tipo, Cuenta, Medio, Fecha, Nota]
  const rangoCargas = sheetCargas.getRange(CONFIG.RANGOS.CARGAS_MODULO);
  const datosCargas = rangoCargas.getValues();

  // 2. Extraer mapas en memoria para Triangulación O(1)
  
  // A. Mapa de Cuentas a Proyecto (Buscamos en Ingresos, Costos, Gastos, Fiscal, Resultados)
  const mapCuentaProyecto = {};
  const datosPC = sheetPlanCuentas.getRange("B3:Y").getValues();
  // Columnas relativas en B3:Y (0-indexed):
  // B(0)-C(1) Ingresos
  // G(5)-H(6) Costos
  // L(10)-M(11) Gastos
  // Q(15)-R(16) Fiscal
  // X(22)-Y(23) Resultados (Ojo, Resultados no tiene Proyecto, solo UEN)
  for (let r = 0; r < datosPC.length; r++) {
    const row = datosPC[r];
    if (row[0]) mapCuentaProyecto[row[0].toString().trim()] = row[1];   // Ingresos
    if (row[5]) mapCuentaProyecto[row[5].toString().trim()] = row[6];   // Costos
    if (row[10]) mapCuentaProyecto[row[10].toString().trim()] = row[11]; // Gastos
    if (row[15]) mapCuentaProyecto[row[15].toString().trim()] = row[16]; // Fiscal
  }

  // B. Mapa de Proyecto a UEN (AF3:AG)
  const mapProyectoUEN = {};
  const datosProyectos = sheetPlanCuentas.getRange("AF3:AG").getValues();
  for (let r = 0; r < datosProyectos.length; r++) {
    if (datosProyectos[r][0]) {
      mapProyectoUEN[datosProyectos[r][0].toString().trim()] = datosProyectos[r][1] || "";
    }
  }

  // C. Mapa de Medio a Moneda (AA3:AC -> AA: Medio, AB: Moneda)
  const mapMedioMoneda = {};
  const datosMedios = sheetPlanCuentas.getRange("AA3:AB").getValues();
  for (let r = 0; r < datosMedios.length; r++) {
    if (datosMedios[r][0]) {
      mapMedioMoneda[datosMedios[r][0].toString().trim()] = datosMedios[r][1] || "";
    }
  }

  // D. Mapa de Fecha a Cotización Venta y Compra (Hoja Tipo de Cambio, C4:E)
  const mapCotizaciones = {};
  const datosFX = sheetTipoCambio.getRange("C4:E").getValues();
  for (let r = 0; r < datosFX.length; r++) {
    if (datosFX[r][0]) {
      let fechaStr = "";
      if (datosFX[r][0] instanceof Date) {
        fechaStr = Utilities.formatDate(datosFX[r][0], ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
      } else {
        fechaStr = datosFX[r][0].toString().trim();
      }
      mapCotizaciones[fechaStr] = {
        venta: datosFX[r][1],
        compra: datosFX[r][2]
      };
    }
  }

  // 3. Procesar filas de Carga
  const nuevasFilas = [];
  
  for (let i = 0; i < datosCargas.length; i++) {
    const [monto, tipo, cuenta, medio, fecha, nota] = datosCargas[i];
    
    // Si la fila está vacía (sin monto o sin fecha), la saltamos
    if (!monto || monto === "" || !fecha || fecha === "") continue;

    const cuentaTrim = cuenta ? cuenta.toString().trim() : "";
    const medioTrim = medio ? medio.toString().trim() : "";
    
    // Extracción de datos cruzados
    const proyectoAsociado = mapCuentaProyecto[cuentaTrim] || "";
    const unidadAsociada = mapProyectoUEN[proyectoAsociado] || "";
    const moneda = mapMedioMoneda[medioTrim] || "";
    
    let fechaFX = "";
    let fechaObj = fecha;
    if (fecha instanceof Date) {
      fechaFX = Utilities.formatDate(fecha, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    } else {
      fechaFX = fecha.toString().trim();
    }
    const cotizacionObj = mapCotizaciones[fechaFX] || { venta: 1, compra: 1 };
    const cotizacionDolar = cotizacionObj.venta || 1;         // K
    const cotizacionDolarCompra = cotizacionObj.compra || 1;  // L

    // Armar fila para "Registros" (Orden B a L)
    // [Fecha(B), Monto(C), Tipo(D), Cuenta(E), Proyecto(F), UEN(G), Medio(H), Moneda(I), Nota(J), CotizaciónVenta(K), CotizaciónCompra(L)]
    nuevasFilas.push([
      fechaObj, 
      monto, 
      tipo, 
      cuentaTrim, 
      proyectoAsociado, 
      unidadAsociada, 
      medioTrim, 
      moneda, 
      nota, 
      cotizacionDolar,
      cotizacionDolarCompra
    ]);
  }

  if (nuevasFilas.length === 0) {
    SpreadsheetApp.getUi().alert("No hay registros válidos para cargar en el lote.");
    return;
  }

  // Ordenamos el lote de nuevas filas por fecha de forma descendente Z:A
  nuevasFilas.sort((a, b) => {
    const timeA = (a[0] instanceof Date) ? a[0].getTime() : new Date(a[0]).getTime();
    const timeB = (b[0] instanceof Date) ? b[0].getTime() : new Date(b[0]).getTime();
    return timeB - timeA;
  });

  // 4. Escribir en 'Registros' (Fila 4 hacia abajo, debajo de los encabezados)
  const insertStartRow = 4;
  sheetRegistros.insertRowsBefore(insertStartRow, nuevasFilas.length);
  sheetRegistros.getRange(insertStartRow, 2, nuevasFilas.length, 11).setValues(nuevasFilas);

  // Copiar formato desde la fila de datos inmediatamente inferior (la antigua fila 4 desplazada)
  // para heredar correctamente formatos de moneda, fechas y colores sin arrastrar el fondo del encabezado.
  const filaDesplazada = sheetRegistros.getRange(insertStartRow + nuevasFilas.length, 1, 1, sheetRegistros.getMaxColumns());
  const targetRango = sheetRegistros.getRange(insertStartRow, 1, nuevasFilas.length, sheetRegistros.getMaxColumns());
  filaDesplazada.copyTo(targetRango, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);

  // Ordenamos si existen datos previos
  const numRowsTotal = sheetRegistros.getLastRow() - insertStartRow + 1;
  if (numRowsTotal > 0) {
    const fullRange = sheetRegistros.getRange(insertStartRow, 2, numRowsTotal, 11);
    fullRange.sort({column: 2, ascending: false});
  }

  // 5. Limpieza del lote en 'Cargas'
  rangoCargas.clearContent();
  
  ss.toast("Lote procesado exitosamente.", "Tidetrack", 3);
}
