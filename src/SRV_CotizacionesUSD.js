function IMPORTJSON(url, query, headers) {
  try {
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());

    var path = query.split("/");
    for (var i = 0; i < path.length; i++) {
      if (path[i].length > 0) {
        json = json[path[i]];
      }
    }

    if (headers === "headers") {
      return [[query]];
    } else {
      return [[json]];
    }

  } catch (e) {
    return [["Error:", e]];
  }
}

function HISTORICO_DOLAR_VENTA() {
  try {
    var url = "https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial";
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    
    var resultados = [];
    
    for (var i = 0; i < data.length; i++) {
      var registro = data[i];
      // Filtramos desde el 1 de enero de 2026 para mantener la matriz liviana
      if (registro.fecha >= "2026-01-01") {
        resultados.push([registro.fecha, registro.venta]);
      }
    }
    
    return resultados;
  } catch (e) {
    return [["Error de conexión API", e.toString()]];
  }
}