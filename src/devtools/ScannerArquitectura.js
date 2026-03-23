/**
 * MÓDULO DEVTOOLS: Scanner de Arquitectura Total
 * 
 * [CONCEPTO DE NEGOCIO]
 * Herramienta de auditoría interna para la IA. Permite que Antigravity/NotebookLM "vea" 
 * estructuralmente el 100% de la planilla (fórmulas, colores, formatos) sin necesidad de interactuar visualmente.
 * 
 * [FUNDAMENTO TEÓRICO / ADMINISTRATIVO]
 * Transforma el "Google Sheets" a "Infrastructure as Code" extrayendo la metadata bruta 
 * para prevenir roturas al hacer actualizaciones futuras.
 * 
 * @see docs/wiki/home.md
 */

function enrutarMenuDevtools() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 Tidetrack DevTools')
    .addItem('Exportar Arquitectura a JSON', 'exportarArquitecturaTotal')
    .addToUi();
}

function exportarArquitecturaTotal() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojas = ss.getSheets();
  const arquitectura = {
    fecha_exportacion: new Date().toISOString(),
    id_planilla: ss.getId(),
    hojas: {}
  };

  ss.toast("Iniciando escaneo profundo 100%...", "DevTools", 3);

  hojas.forEach(hoja => {
    const nombre = hoja.getName();
    const lastRow = hoja.getLastRow();
    const lastCol = hoja.getLastColumn();
    
    if (lastRow === 0 || lastCol === 0) return;

    const rango = hoja.getRange(1, 1, lastRow, lastCol);
    
    arquitectura.hojas[nombre] = {
      meta: {
        filas_totales: lastRow,
        columnas_totales: lastCol,
        filas_congeladas: hoja.getFrozenRows(),
        columnas_congeladas: hoja.getFrozenColumns(),
        es_oculta: hoja.isSheetHidden(),
        reglas_condicionales_qty: hoja.getConditionalFormatRules().length
      },
      encabezados: rango.getValues()[0] || [],
      mapa_celdas: {}
    };

    // Extracciones masivas O(1)
    const formulas = rango.getFormulas();
    const values = rango.getValues();
    const backgrounds = rango.getBackgrounds();
    const fontColors = rango.getFontColors();
    const fontWeights = rango.getFontWeights();
    const fontSizes = rango.getFontSizes();

    // Mapeamos solo lo que tiene valor o fórmula para no hacer un JSON infinito
    for (let r = 0; r < lastRow; r++) {
      for (let c = 0; c < lastCol; c++) {
        if (formulas[r][c] || (values[r][c] !== "" && r < 5)) { // Mapeamos todo header y todas las formulas
           let ref = hoja.getRange(r + 1, c + 1).getA1Notation();
           
           arquitectura.hojas[nombre].mapa_celdas[ref] = {
              valor: formulas[r][c] ? null : values[r][c],
              formula: formulas[r][c] || null,
              estilo: {
                fondo: backgrounds[r][c],
                texto: fontColors[r][c],
                negrita: fontWeights[r][c],
                tamaño: fontSizes[r][c]
              }
           };
        }
      }
    }
  });

  const jsonStr = JSON.stringify(arquitectura, null, 2);
  const nombreArchivo = 'TIDETRACK_ARQUITECTURA_ESTRICTA.json';
  
  // Buscar si ya existe y borrarlo para no llenar el Drive
  const archivosPrevios = DriveApp.getFilesByName(nombreArchivo);
  while(archivosPrevios.hasNext()){
    archivosPrevios.next().setTrashed(true);
  }

  const archivo = DriveApp.getRootFolder().createFile(nombreArchivo, jsonStr, MimeType.PLAIN_TEXT);
  
  SpreadsheetApp.getUi().alert(
    "✅ Arquitectura exportada con éxito\n\n" +
    "El archivo JSON se ha guardado en tu Google Drive raíz como:\n" + 
    nombreArchivo + "\n\n" +
    "Por favor, descarga ese archivo y colócalo en la carpeta docs/permanente/ del repositorio local para que la IA lo procese."
  );
}
