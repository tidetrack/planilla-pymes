# Wiki Técnica - Planilla Pymes

Bienvenida/o a la Wiki Técnica. Este es el punto de partida definitivo para el **usuario técnico y/o desarrollador colaborador** que necesita entender en profundidad cómo está armada la planilla, cómo interactuar con su base de código, y cómo escalar funcionalidades sin romper la integridad financiera.

---

## Índice de Contenidos

### 1. Arquitectura de Alta Disponibilidad Funcional
- **Google Sheets as Code**: En lugar de saturar las celdas de lógicas nativas muy complejas que se quiebran, la base teórica de la Pyme reside en Google Apps Script (`/src`). Usamos Apps Script como un "backend tradicional".
- [El Modelo de Datos Oculto](../permanente/MODELO_DATOS.md): La hoja "Plan de Cuentas" es el corazón de nuestro Active Record. Las ubicaciones exactas de las columnas (Ingresos, Gastos, Costos) son estricta ley, declaradas y controladas globalmente por el archivo técnico `src/00_Config.js`.

### 2. Flujo de Comunicación Backend-Frontend
1. El usuario hace click en un modal/menú dentro de la hoja.
2. Apps Script levanta el archivo `HTML` utilizando `HtmlService.createTemplateFromFile()`.
3. Desde el cliente web, los botones ejecutan llamadas asincrónicas a funciones del servidor via `google.script.run`.
4. Todas las funciones de backend invocables **deben estar exportadas globalmente** en nivel raíz del script.

### 3. Orientación Educativa y Entrenamiento de IA (NotebookLM)
Bajo un enfoque novedoso, cada feature financiero o tabla analítica que añadimos al producto viene acompañada de una [Fundamentación Funcional](../permanente/notebookLM/). 
- Estas notas no son para desarrolladores, son inyecciones de **estrategia de negocios y contabilidad** para que un "NotebookLM" interprete la filosofía del modelo de negocio, asista a los dueños de Pymes que compran la herramienta y ofrezca tutoriales en tiempo real.

### 4. Ecosistema "Agéntico" de Tidetrack
El desarrollo del proyecto es asistido por un comité de Agentes Autónomos. Su comportamiento y roles están tipificados en la sub-carpeta oculta `.agent/`. Si buscas delegar una tarea, comprenderás su estructura ahí:
- **`@tidetrack-pm`**: El dispatcher general.
- **`@github-docs`**: Quien mantiene el orden en este mismísimo texto.
- **`@agente-contextual`**: El obsesivo bibliotecario que vigila que no se corrompan los flujos y mantiene las Actas de Decisiones.

### 5. Documentación de Módulos (Nuevos)
- [Módulo: Presupuesto e Interanual](./MODULO_PRESUPUESTO.md): Arquitectura paramétrica nativa (Sheets) de tablas pivote y sistema de conversión multidivisa integrado.

---
> ⚠️ **Regla de Oro para Colaboradores**: Todo cambio estructural debe pasar por un comité (vía issue o pull request). Modificar nombres de hojas, mover columnas o agregar campos a validadores cerrados quebrarán las macros indexadas en Apps Script. Revisa siempre la validación contra `00_Config.js`.
