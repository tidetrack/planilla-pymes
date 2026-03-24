/**
 * Tipo_Cambio_API.js
 * Automatización y gestión de la caché de tipos de cambio (Dólar Compra / Venta)
 * Utiliza DolarAPI (API pública argentina) en lugar de Google Finance.
 */

function fetchCotizacionDolar() {
  try {
    // Usamos el dólar MEP como referencia pyme estándar. (Puede cambiarse a 'blue' o 'oficial')
    const url = "https://dolarapi.com/v1/dolares/mep"; 
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

/**
 * Función que actualiza la caché histórica en la hoja "Tipo de Cambio".
 * Empuja los valores hacia abajo (Z:A) desde la fila 4.
 */
function updateCacheTipoCambio() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TIPO_CAMBIO);
  if (!sheet) return;

  const dataDolar = fetchCotizacionDolar();
  if (!dataDolar) return;

  // Insertamos una nueva fila en la posición 4 para mantener el orden Descendente (Z:A)
  sheet.insertRowBefore(4); 
  
  // Obtenemos la fecha de ejecución (o usamos la de la API)
  const fechaHoy = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
  
  // Escribimos los valores (C: Fecha, D: Venta, E: Compra)
  sheet.getRange("C4").setValue(fechaHoy);
  sheet.getRange("D4").setValue(dataDolar.venta);
  sheet.getRange("E4").setValue(dataDolar.compra);
}
