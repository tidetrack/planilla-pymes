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
  // Columnas relativas en B3:Y (0-indexed donde B=0):
  // B(0)-C(1) Ingresos
  // F(4)-G(5) Costos
  // J(8)-K(9) Gastos
  // N(12)-O(13) Fiscal
  // T(18)-U(19) Resultados
  for (let r = 0; r < datosPC.length; r++) {
    const row = datosPC[r];
    if (row[0])  mapCuentaProyecto[row[0].toString().trim()]  = row[1];  // Ingresos
    if (row[4])  mapCuentaProyecto[row[4].toString().trim()]  = row[5];  // Costos
    if (row[8])  mapCuentaProyecto[row[8].toString().trim()]  = row[9];  // Gastos
    if (row[12]) mapCuentaProyecto[row[12].toString().trim()] = row[13]; // Fiscal
    if (row[18]) mapCuentaProyecto[row[18].toString().trim()] = row[19]; // Resultados
  }

  // B. Mapa de Proyecto a UEN (AA3:AB)
  const mapProyectoUEN = {};
  const datosProyectos = sheetPlanCuentas.getRange("AA3:AB").getValues();
  for (let r = 0; r < datosProyectos.length; r++) {
    if (datosProyectos[r][0]) {
      mapProyectoUEN[datosProyectos[r][0].toString().trim()] = datosProyectos[r][1] || "";
    }
  }

  // C. Mapa de Medio a Moneda y Proyecto (W3:Y -> W: Medio, X: Moneda, Y: Proyecto)
  const mapMedioMoneda = {};
  const mapMedioProyecto = {};
  const datosMedios = sheetPlanCuentas.getRange("W3:Y").getValues();
  for (let r = 0; r < datosMedios.length; r++) {
    if (datosMedios[r][0]) {
      const medioTrim = datosMedios[r][0].toString().trim();
      mapMedioMoneda[medioTrim] = datosMedios[r][1] || "";
      mapMedioProyecto[medioTrim] = datosMedios[r][2] || "";
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
    const proyectoCuenta = mapCuentaProyecto[cuentaTrim] || "";
    const proyectoMedio = mapMedioProyecto[medioTrim] || "";
    // Prioriza el proyecto de la Cuenta, pero si no tiene y el Medio sí (ej. caja chica obra), lo usa.
    const proyectoAsociado = proyectoCuenta || proyectoMedio || "";
    
    const unidadAsociada = mapProyectoUEN[proyectoAsociado] || "";
    const moneda = mapMedioMoneda[medioTrim] || "";
    
    let fechaFX = "";
    let fechaObj = fecha;
    if (fecha instanceof Date) {
      fechaFX = Utilities.formatDate(fecha, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    } else {
      fechaFX = fecha.toString().trim();
    }
    const cotizacionObj = mapCotizaciones[fechaFX];
    let cotizacionDolar, cotizacionDolarCompra;

    if (cotizacionObj) {
      cotizacionDolar = Number(cotizacionObj.venta) || 1;
      cotizacionDolarCompra = Number(cotizacionObj.compra) || cotizacionDolar;
    } else {
      // Fallback: buscar en API para esa fecha
      const fromApi = fetchCotizacionParaFecha(fechaFX);
      if (fromApi) {
        cotizacionDolar = fromApi.venta;
        cotizacionDolarCompra = fromApi.compra;
        // Persistir en la hoja Tipo de Cambio y actualizar mapa en memoria
        sheetTipoCambio.insertRowBefore(4);
        sheetTipoCambio.getRange("C4").setValue(fechaFX);
        sheetTipoCambio.getRange("D4").setValue(fromApi.venta);
        sheetTipoCambio.getRange("E4").setValue(fromApi.compra);
        mapCotizaciones[fechaFX] = { venta: fromApi.venta, compra: fromApi.compra };
      } else {
        // Último recurso: heredar el día hábil anterior más cercano disponible
        const fechasDisponibles = Object.keys(mapCotizaciones).sort().reverse();
        const fechaBase = fechasDisponibles.find(f => f < fechaFX);
        const fallback = fechaBase ? mapCotizaciones[fechaBase] : { venta: 1, compra: 1 };
        cotizacionDolar = Number(fallback.venta) || 1;
        cotizacionDolarCompra = Number(fallback.compra) || cotizacionDolar;
        Logger.log(`FX fallback: sin datos para ${fechaFX}, usando ${fechaBase || 'default 1'}`);
      }
    }

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
