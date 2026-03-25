/**
 * Tipo_Cambio_API.js
 * Automatización y gestión de la caché de tipos de cambio (Dólar Compra / Venta)
 * Utiliza DolarAPI y ArgentinaDatos (APIs públicas argentinas).
 */

function fetchCotizacionDolar() {
  try {
    const url = "https://dolarapi.com/v1/dolares/oficial"; 
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    return {
      compra: data.compra,
      venta: data.venta,
      fecha: data.fechaActualizacion
    };
  } catch (error) {
    Logger.log("Error consultando DolarAPI: " + error);
    return null;
  }
}

function updateCacheTipoCambio() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TIPO_CAMBIO);
  if (!sheet) return;

  const dataDolar = fetchCotizacionDolar();
  if (!dataDolar) return;

  sheet.insertRowBefore(4); 
  const fechaHoy = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
  sheet.getRange("C4").setValue(fechaHoy);
  sheet.getRange("D4").setValue(dataDolar.venta);
  sheet.getRange("E4").setValue(dataDolar.compra);
}

/**
 * Función Developer: Fuerza la recolección de todo el historial del Dólar Oficial
 * desde el 01/01/2026 hasta la fecha actual y lo vuelca en la base de datos "Tipo de Cambio".
 */
function forzarCargaHistoricaUSD() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TIPO_CAMBIO);
  if (!sheet) {
    SpreadsheetApp.getUi().alert("No se encontró la hoja Tipo de Cambio.");
    return;
  }

  try {
    // ArgentinaDatos devuelve el histórico completo de todas las cotizaciones Oficiales
    const url = "https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial";
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    // Filtrar desde 2026-01-01
    const historico2026Date = new Date("2026-01-01").getTime();
    let historicoFiltrado = data.filter(d => {
      const gDate = new Date(d.fecha);
      return gDate.getTime() >= historico2026Date;
    });

    if (historicoFiltrado.length === 0) {
      SpreadsheetApp.getUi().alert("No se encontraron registros históricos para 2026 en la API.");
      return;
    }

    // Ordenar de más reciente a más antiguo (Z:A)
    historicoFiltrado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Mapear al arreglo de inserción: [Fecha, Venta, Compra]
    // La API de argentinadatos retorna {casa, compra, venta, fecha}
    const valoresAInsertar = historicoFiltrado.map(d => [d.fecha, d.venta, d.compra]);

    // Limpiar desde la fila 4 hacia abajo (Columnas C, D, E)
    const lastRow = Math.max(sheet.getLastRow(), 4);
    if (lastRow >= 4) {
      sheet.getRange(4, 3, lastRow - 3, 3).clearContent();
    }

    // Insertar el nuevo bloque masivo
    sheet.getRange(4, 3, valoresAInsertar.length, 3).setValues(valoresAInsertar);

    SpreadsheetApp.getUi().alert(`✅ Éxito: Se volcaron ${valoresAInsertar.length} registros históricos del Dólar Oficial (Compra y Venta) ordenados desde hoy hasta 01-01-2026.`);

  } catch (error) {
    SpreadsheetApp.getUi().alert("Fallo al acceder al historial: " + error);
  }
}
