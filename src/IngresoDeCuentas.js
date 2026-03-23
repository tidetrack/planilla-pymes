// --- CONFIGURACIÓN GLOBAL ---
const HOJA_CUENTAS = "Plan de Cuentas";

// 1. DEFINICIÓN EXACTA DE LAS CELDAS DE ENCABEZADO (Ajustado a la fila 2)
const CELDAS_ENCABEZADO = ['B2', 'F2', 'J2', 'N2', 'R2', 'T2', 'V2', 'Y2', 'AB2'];

// 2. MAPA DE PREFIJOS
const PREFIJOS_CUENTAS = {
  "1. INGRESOS Y RECURSOS": "Ingr-",
  "2. COSTOS DE VENTAS": "CV-",
  "3. GASTOS": "G-",
  "4. CARGA FISCAL": "CF-",
  "5. MOVIMIENTOS": "Mov-",
  "6. RESULTADOS": "Res-",
  "7. MEDIOS DE PAGO EFECTIVO": "ARS-",
  "8. MEDIOS DE PAGO USD": "USD-",
  "UNIDADES DE NEGOCIO": "PR-"
};

// 3. TIPOS QUE REQUIEREN PROYECTO Y FECHA
const PALABRAS_CLAVE_COMPLEJAS = ["INGRESOS", "COSTOS", "GASTOS", "FISCAL"];

// --- HTML DEL POPUP ---
const HTML_POPUP = `
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      /* --- RESET & BASE --- */
      * { box-sizing: border-box; }
      
      body, html {
        height: 100%; 
        margin: 0;
        padding: 0;
        font-family: 'Montserrat', sans-serif; 
        background-color: #ffffff;
        color: #333;
        overflow: hidden; 
      }

      /* --- WRAPPER CENTRADO --- */
      .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center;    
        height: 100%;
        width: 100%;
        padding: 20px;
        transition: all 0.3s ease; 
      }

      /* --- FORMULARIO --- */
      .form-container {
        width: 100%;
        max-width: 340px; 
      }

      .form-group { 
        margin-bottom: 15px; 
        width: 100%;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #5f6368;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: left;
      }

      .input-control {
        width: 100%;
        padding: 12px;
        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        font-weight: 600; 
        color: #11252c;
        background-color: #fff;
        border: 1px solid #dadce0;
        border-radius: 6px;
        outline: none;
        transition: border 0.2s, box-shadow 0.2s;
        text-align: left;
      }

      .input-control:focus {
        border-color: #11252c;
        box-shadow: 0 0 0 3px rgba(17, 37, 44, 0.1);
      }

      .input-control:disabled {
        background-color: #f8f9fa;
        color: #bdc1c6;
        cursor: not-allowed;
        border-color: #f1f3f4;
      }

      input[type=number]::-webkit-inner-spin-button, 
      input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
      }

      select.input-control {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2311252c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 10px;
        padding-right: 30px;
      }

      /* --- SECCIÓN DINÁMICA --- */
      #campos-extra {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
      }

      #campos-extra.visible {
        max-height: 300px;
        opacity: 1;
      }

      /* --- BOTONES --- */
      .button-row {
        display: flex;
        gap: 12px;
        margin-top: 25px;
        padding-top: 10px;
      }

      button {
        flex: 1; 
        padding: 12px;
        border: none;
        border-radius: 6px;
        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.1s, background-color 0.2s;
      }

      button:active { transform: scale(0.98); }

      .btn-primary {
        background-color: #11252c;
        color: #fff;
      }
      .btn-primary:hover { background-color: #1c3b46; }
      
      .btn-secondary {
        background-color: #fff;
        border: 1px solid #dadce0;
        color: #5f6368;
      }
      .btn-secondary:hover { background-color: #f8f9fa; border-color: #333; color: #333; }

      /* --- MENSAJES --- */
      .status-msg {
        margin-top: 15px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        padding: 10px;
        border-radius: 6px;
        display: none;
        animation: fadeIn 0.3s;
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      
      .loading { color: #11252c; background: #e0f7fa; }
      .success { color: #155724; background: #d4edda; }
      .error { color: #721c24; background: #f8d7da; }

    </style>
  </head>
  <body>
    
    <div class="wrapper">
      <div class="form-container">
        
        <div class="form-group">
          <label>1. Tipo de Cuenta</label>
          <select id="tipo-cuenta" class="input-control">
            <option value="" disabled selected>Cargando...</option>
          </select>
        </div>

        <div class="form-group">
          <label>2. Nombre de Cuenta</label>
          <input type="text" id="nombre-cuenta" class="input-control" disabled placeholder="Ej: Honorarios-Arquitecto">
        </div>

        <div id="campos-extra">
          <div class="form-group">
            <label>3. Proyecto Asociado (Opcional)</label>
            <select id="proyecto-asociado" class="input-control">
               <option value="" selected>Seleccione Proyecto...</option>
            </select>
          </div>

          <div class="form-group" id="container-fecha">
            <label>4. Día de Vencimiento (1-31)</label>
            <input type="number" id="fecha-estimada" class="input-control" min="1" max="31" step="1" placeholder="Ej: 10">
          </div>
        </div>

        <div id="loading-msg" class="status-msg loading">Procesando...</div>
        <div id="success-msg" class="status-msg success"></div>
        <div id="error-msg" class="status-msg error"></div>

        <div class="button-row">
          <button class="btn-secondary" onclick="google.script.host.close()">Cerrar</button>
          <button id="submit-button" class="btn-primary" onclick="registrarCuenta()">Registrar</button>
        </div>

      </div>
    </div>

    <script>
      const KEYWORDS = ["INGRESOS", "COSTOS", "GASTOS", "FISCAL"];
      const KEYWORDS_MEDIOS = ["PAGO", "MEDIOS"];

      window.onload = function() {
        google.script.run
          .withSuccessHandler(llenarDropdownTipos)
          .withFailureHandler(e => mostrarError("Error Tipos: " + e.message))
          .getTiposDeCuenta();
          
        google.script.run
          .withSuccessHandler(llenarDropdownProyectos)
          .withFailureHandler(e => mostrarError("Error Proyectos: " + e.message))
          .getListaProyectos();

        document.getElementById('tipo-cuenta').onchange = function() {
          var val = this.value.toUpperCase();
          var nombreInput = document.getElementById('nombre-cuenta');
          var extraDiv = document.getElementById('campos-extra');
          var fechaContainer = document.getElementById('container-fecha');
          
          nombreInput.disabled = false;
          setTimeout(() => nombreInput.focus(), 50);

          var necesitaAmbos = KEYWORDS.some(k => val.includes(k));
          var necesitaSoloProyecto = KEYWORDS_MEDIOS.some(k => val.includes(k));
          
          if (necesitaAmbos || necesitaSoloProyecto) {
            extraDiv.classList.add('visible');
            if (necesitaSoloProyecto) {
               fechaContainer.style.display = 'none';
               document.getElementById('fecha-estimada').value = "";
            } else {
               fechaContainer.style.display = 'block';
            }
          } else {
            extraDiv.classList.remove('visible');
            setTimeout(() => {
                if(!extraDiv.classList.contains('visible')) {
                    document.getElementById('proyecto-asociado').value = "";
                    document.getElementById('fecha-estimada').value = "";
                }
            }, 300);
          }
        };
      };

      function llenarDropdownTipos(tipos) {
        var select = document.getElementById('tipo-cuenta');
        select.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
        tipos.forEach(t => {
           if(t) {
             var opt = document.createElement('option');
             opt.value = t; opt.textContent = t;
             select.appendChild(opt);
           }
        });
      }

      function llenarDropdownProyectos(proyectos) {
        var select = document.getElementById('proyecto-asociado');
        select.innerHTML = '<option value="" selected>Seleccione Proyecto...</option>';
        proyectos.forEach(p => {
           if(p) {
             var opt = document.createElement('option');
             opt.value = p; opt.textContent = p;
             select.appendChild(opt);
           }
        });
      }

      function registrarCuenta() {
        var tipo = document.getElementById('tipo-cuenta').value; 
        var nombre = document.getElementById('nombre-cuenta').value;
        var proyecto = document.getElementById('proyecto-asociado').value;
        var fechaStr = document.getElementById('fecha-estimada').value; 
        
        // --- VALIDACIONES FRONTEND ---

        if (!tipo) return mostrarError("Seleccione un tipo de cuenta.");
        if (!nombre || nombre.trim() === "") return mostrarError("Ingrese un nombre.");
        
        var extraVisible = document.getElementById('campos-extra').classList.contains('visible');
        var fechaVisible = document.getElementById('container-fecha').style.display !== 'none';
        
        if (extraVisible) {
            // Se elimina la validación que forzaba el ingreso de proyecto
            if (fechaVisible && fechaStr && fechaStr !== "") {
                var fNum = Number(fechaStr);
                if (!Number.isInteger(fNum) || fNum < 1 || fNum > 31) {
                    return mostrarError("El día debe ser un número entero entre 1 y 31.");
                }
            }
        }

        setFormDisabled(true);
        mostrarMensaje("loading", "Validando y guardando...");

        var formData = {
          tipoSeleccionado: tipo, 
          nuevoNombre: nombre.trim(),
          proyecto: proyecto || "", 
          fecha: fechaStr
        };

        google.script.run
          .withSuccessHandler(registroExitoso)
          .withFailureHandler(registroFallido)
          .registrarNuevaCuenta(formData);
      }

      function registroExitoso(mensaje) {
        mostrarMensaje("success", mensaje);
        document.getElementById('nombre-cuenta').value = "";
        document.getElementById('fecha-estimada').value = "";
        setFormDisabled(false);
        setTimeout(() => mostrarMensaje(null, ""), 2500);
      }

      function registroFallido(e) {
        mostrarError(e.message || e);
        setFormDisabled(false);
      }
      
      function mostrarError(msg) { mostrarMensaje("error", msg); }

      function mostrarMensaje(tipo, texto) {
        ['loading','success','error'].forEach(id => document.getElementById(id+'-msg').style.display = 'none');
        if (tipo) {
          var el = document.getElementById(tipo + '-msg');
          el.textContent = texto;
          el.style.display = 'block';
        }
      }

      function setFormDisabled(disabled) {
        document.getElementById('submit-button').disabled = disabled;
      }
    </script>
  </body>
</html>
`;

// --- FUNCIONES DEL SERVIDOR (.gs) ---

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Finanzas Tidetrack')
    .addItem('Registrar cuenta', 'mostrarDialogoCrearCuenta')
    .addSeparator()
    .addItem('Contrato', 'mostrarLinkContrato')
    .addToUi();
}

function mostrarDialogoCrearCuenta() {
  var html = HtmlService.createHtmlOutput(HTML_POPUP)
    .setTitle(' ') 
    .setWidth(400) 
    .setHeight(550);  
  SpreadsheetApp.getUi().showModalDialog(html, 'Registrar Nueva Cuenta');
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

function getTiposDeCuenta() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CUENTAS);
  // Bloqueo de seguridad si el nombre de la hoja no coincide exactamente
  if (!sheet) throw new Error("No se encontró la hoja: " + HOJA_CUENTAS);
  
  let headers = [];
  CELDAS_ENCABEZADO.forEach(celda => {
    let valor = sheet.getRange(celda).getValue();
    if (valor && valor !== "") {
      headers.push(valor.toString().trim());
    }
  });
  return headers;
}

function getListaProyectos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CUENTAS);
  if (!sheet) throw new Error("No se encontró la hoja: " + HOJA_CUENTAS);
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) return []; 
  
  // SOLUCIÓN: Ajustado para leer estrictamente la columna AB (índice 28)
  const valores = sheet.getRange("AB3:AB" + lastRow).getValues();
  
  return [...new Set(valores.flat().filter(v => {
      let str = v ? v.toString().trim() : "";
      return str !== "" && str.toUpperCase() !== "TODOS" && str.toUpperCase() !== "GENERAL";
  }))].sort();
}

function registrarNuevaCuenta(formData) {
  const { tipoSeleccionado, nuevoNombre, proyecto, fecha } = formData; 

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CUENTAS);
    
    let celdaEncontrada = null;
    for (let celda of CELDAS_ENCABEZADO) {
      let valorEnHoja = sheet.getRange(celda).getValue().toString().trim().toUpperCase();
      if (valorEnHoja === tipoSeleccionado.toUpperCase()) {
        celdaEncontrada = celda;
        break;
      }
    }

    if (!celdaEncontrada) throw new Error("No se encontró la columna de destino.");

    const colIndex = sheet.getRange(celdaEncontrada).getColumn();

    const tipoNorm = tipoSeleccionado.toUpperCase().trim();
    let prefijo = "";
    Object.keys(PREFIJOS_CUENTAS).forEach(key => {
      if (key.toUpperCase() === tipoNorm) {
        prefijo = PREFIJOS_CUENTAS[key];
      }
    });
    
    const nombreFinal = prefijo + nuevoNombre;

    const lastRowSheet = Math.max(sheet.getLastRow(), 3); 
    const datosColumnaActual = sheet.getRange(3, colIndex, lastRowSheet - 2).getValues().flat();
    
    const existe = datosColumnaActual.some(val => 
      val && val.toString().trim().toUpperCase() === nombreFinal.toUpperCase()
    );

    if (existe) {
      throw new Error(`¡La cuenta "${nombreFinal}" ya existe! No se puede duplicar.`);
    }

    const valoresColumna = sheet.getRange(3, colIndex, 300).getValues();
    
    let filaDestino = 3;
    for (let i = 0; i < valoresColumna.length; i++) {
      if (valoresColumna[i][0] && valoresColumna[i][0].toString() !== "") {
        filaDestino = i + 3 + 1;
      }
    }
    if (filaDestino < 3) filaDestino = 3;

    sheet.getRange(filaDestino, colIndex).setValue(nombreFinal);

    if (proyecto && proyecto !== "") {
      sheet.getRange(filaDestino, colIndex + 1).setValue(proyecto);
    }
    
    // Al ser un medio de pago, "fecha" llegará vacía y no interferirá con la columna R u otras adyacentes
    if (fecha && fecha !== "") {
      sheet.getRange(filaDestino, colIndex + 2).setValue(fecha);
    }
    
    return `¡Listo! Se creó: ${nombreFinal}`;

  } catch (e) {
    throw new Error(`Error: ${e.message}`);
  }
}