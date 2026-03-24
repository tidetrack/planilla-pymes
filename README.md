# Planilla Pymes - Tidetrack

Bienvenido al repositorio técnico de la **Planilla Pymes**. Este es el core de código para la gestión financiera avanzada montada sobre **Google Sheets, Apps Script y HTML5**.

Este repositorio NO es simplemente un registro de código; es un producto integral donde la interfaz (Spreadsheet) y el motor de lógica (Apps Script) conviven y se actualizan mediante automatizaciones y agentes de Inteligencia Artificial.

## 🏗️ Arquitectura del Proyecto
- **Frontend / UI**: Formularios HTML interactivos servidos a través de la API `HtmlService` de Google Apps Script. (Ej. `src/UI_AbmPlanCuentas.html`).
- **Backend / ORM**: Lógica de negocio en archivos `.js` que actúa como puente transaccional entre la UI y la base de datos (Ej. `src/ABM_Cuentas_Backend.js`).
- **Base de Datos**: Google Sheets (Planilla Pymes). Las columnas y filas están rígidamente mapeadas vía rangos de configuración nativa en `src/00_Config.js`.

## 🧠 Paradigma AI-First (Arquitectura Autoconsciente)
Tidetrack ha evolucionado de una simple planilla a un sistema autoconsciente diseñado para colaborar con Inteligencia Artificial:
- **Auto-escaneo Estructural:** La herramienta nativa `ScannerArquitectura.js` lee el 100% de la metadata (fórmulas, colores, layouts) de Google Sheets y lo exporta como un mapa genético en formato JSON.
- **Topología Viva:** Un compilador en Node.js transforma el ADN masivo en un [Grafo Mermaid Interactivo](docs/wiki/ARQUITECTURA_DETALLADA.md), revelando la dirección semántica de todas las transacciones (Qué hoja alimenta a cuál y con qué fin).
- **Cerebro Externo:** Todo el conocimiento de la plataforma actúa como "Fuente Mestra" para NotebookLM u otros LLMs a través de nuestro [System Prompt Oficial](docs/permanente/notebookLM/SYSTEM_PROMPT_BOT.md), garantizando cero alucinaciones y matemática O(1).

## 📚 Documentación y Wiki
Toda la documentación técnica del proyecto ha sido consolidada en nuestra **Wiki Técnica** para desarrolladores e ingenieros de prompt.

👉 **[Ir a la Wiki Técnica (Home)](docs/wiki/home.md)** 👈

**Enlaces Rápidos Clave:**
- [Topología del Sistema y Taxonomía (Mermaid Graph)](docs/wiki/ARQUITECTURA_DETALLADA.md)
- [Cerebro Bot (System Prompt NotebookLM)](docs/permanente/notebookLM/SYSTEM_PROMPT_BOT.md)
- [Modelo de Datos Intríseco](docs/permanente/MODELO_DATOS.md)
- [Historial Global de Desarrollo](docs/permanente/HISTORIAL_DESARROLLO.md)

## 🛠️ Prerrequisitos y Desarrollo Local
Para trabajar activamente en este proyecto, necesitas vincular tu entorno local al proyecto de Google Apps Script en la nube:
1. Asegúrate de tener Node.js y la herramienta instalada globalmente: `npm install -g @google/clasp`.
2. Autoriza tu cuenta ejecutando `clasp login`.
3. Tu configuración local debe contar con un archivo `.clasp.json` (apuntando al `scriptId` válido y configurado con `"rootDir": "src"`).
4. Ejecuta `clasp push` para impactar cualquier cambio de código (contenido en el directorio `src/`) directamente al entorno productivo.

> **Importante:** Cualquier alteración del código o la base de datos (Sheets) exige actualizar el changelog (`src/ZZ_Changelog.js`) y registrar la fundamentación estratégica correspondientes. Revisa las reglas en `.agent/rules/`.
