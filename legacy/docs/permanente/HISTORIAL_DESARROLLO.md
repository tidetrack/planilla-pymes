# Historial de Desarrollo Tidetrack

Este documento mantiene un registro humano legible y cronológico de todas las iteraciones, features y bugs arreglados en el proyecto.

---
## 2026-03-30 - Sprint 7: Bimonetarismo en Compromisos y QA Automation (v1.6.0)

### Evento
El usuario requirió que el módulo de Compromisos soporte pagos cruzados (ARS y USD), permitiendo registrar la deuda originaria en una moneda y cancelarla en otra. Adicionalmente, se construyó un script E2E de simulación de datos falsos organizados y se mejoró la UX del Plan de Cuentas para forzar prefijos de moneda.

### Cambios Implementados
- **Refactorización Bimonetaria (`03_Backend_Devengado.js`)**: El "Total Imputado" de compromisos ahora posee una ecuación nativa avanzada (`SUM(FILTER(...))`) inyectada desde el Apps Script que cruza Pagos contra la "Cotización USD Venta" (`Movimientos L:L`), deduciendo la deuda equilibradamente sin impactar por inflación de cruce de monedas.
- **Inyección y Memoria de Lote**: Se modificó `03_Backend_Devengado.js` para recibir "Moneda" desde Cargas, y se arregló un bug crítico en `_generarIdDevengado` evitando colisiones de IDs al cachear los registros en la memoria RAM antes de inyectarlos a la BD.
- **Autogenerador QA (`QA_GeneradorMock.js`)**: Nuevo botón en menú superior que puebla en segundos los Módulos A, B y C de la hoja de Cargas con datos financieros randomizados pero vinculados lógicamente a las variables reales del Plan de Cuentas (sorteando reglas DataValidation).
- **Prefijos Dinámicos**: Se cambió la moneda EUR por Cuenta Corriente (`CtaCte`) en el modal ABM y se programó `01_Backend_PlanCuentas.js` para prefijar mecánicamente (`ARS-`, `USD-`, `CtaCte-`) todos los Medios de Pago elegidos.
- **Actualización Documental**: Reflejo estructural en `MODELO_DATOS.md` y `CONTEXTO_LLM.md`.

### Resultado
- El flujo de Compromisos soporta finanzas bimonetarias de grado Enterprise procesadas en O(1) vía Google Sheets Formula Engine.
- Capa de Testing (QA) activa simplificando los bucles de desarrollo.

---
## 2026-03-30 - Sprint 6: Refactor Tipo de Cuenta & Resumen Interanual (v1.5.0)

### Evento
El usuario detectó la necesidad de poder clasificar los movimientos en "Ingresos", "Costos", "Gastos", etc. en la base troncal (`Registros - Movimientos`) para nutrir correctamente la nueva capa analítica "Resumen Interanual".

### Cambios Implementados
- **Escaneo JSON**: Se activó el DevTools en `onOpen` (`01_Backend_PlanCuentas.js`). El usuario exportó el JSON, validando que el Resumen Interanual sea pariente paramétrico de Presupuesto sin depender de Google Apps Script.
- **Inferencia de Tipo de Cuenta**: `Carga_Registros.js` ahora mapea (`mapCuentaTipo`) paralelamente cada cuenta con su designación macro según el bloque al que pertenece (`Ingresos`, `Costos`, `Gastos`, etc).
- **Columna Desplazada**: Se amplió el ancho de escritura interponiendo el dato en F, empujando todas las variables para no sobrescribir, desde G hasta M.
- **Fix Devengado**: Se actualizó la fórmula `SUMIF/MAXIFS` en `03_Backend_Devengado.js` para mirar la Columna N (`N:N`), dado que la columna `ID_CXC` había sido desplazada.

### Resultado
- "Registros - Movimientos" ahora posee automáticamente la macrocategoría financiera de la transacción.
- Contamos con un JSON actualizado y escaneado para la IA en `TIDETRACK_ARQUITECTURA_ESTRICTA.json`.

---
## 2026-03-27 - Sprint 5: Módulo Presupuesto + Reestructuración Cargas (v1.4.0)

### Evento
Se inició el Sprint 5: reestructuración de la hoja `Cargas` en 3 bloques independientes y creación del módulo completo de carga de presupuesto con BD normalizada.

### Cambios Implementados
- **Hoja `Cargas` reestructurada**: Bloque A `C6:I25` (Movimientos), Bloque B `C31:I50` (Compromisos), Bloque C `C56:I75` (Presupuesto).
- **`TRIGGER_onEdit.js` unificado**: Los 3 bloques usan col C (monto) como trigger y col G como destino de auto-fecha.
- **`00_Config.js`**: Nuevas claves `CARGAS_MOVIMIENTOS`, `CARGAS_COMPROMISOS`, `CARGAS_PRESUPUESTO` y hoja `PRESUPUESTO`.
- **`04_Backend_Presupuesto.js`** (NUEVO): Lee Bloque C, infiere Tipo/Proyecto/UEN, escribe en `Registros - Presupuesto` con cotización FX live.
- **`Carga_Registros.js`** y **`03_Backend_Devengado.js`**: Referencias de rango actualizadas a los nuevos nombres de constante.
- **`MODELO_DATOS.md`** y **`CONTEXTO_LLM.md`**: Documentados `Registros - Presupuesto` y la nueva estructura de bloques de Cargas.

### Resultado
- La hoja `Cargas` centraliza los 3 flujos de carga (movimientos, compromisos y presupuesto) sin rangos superpuestos.
- El ciclo de carga de presupuesto queda completamente automatizado: ingreso en hoja → procesar lote → BD normalizada.

---


### Evento
Se implementó el módulo completo de Cuentas por Cobrar y Pagar con una BD propia (`Registros - Compromisos`) y un módulo de carga dedicado dentro de la hoja `Cargas`.

### Cambios Implementados
- Nueva hoja `Registros - Compromisos` (16 columnas B-Q, auto-gestionada por backend).
- `03_Backend_Devengado.js` creado: genera ID correlativo (`CXC/CXP-YYYYMMDD-NNN`), infiere Proyecto/UEN, obtiene cotización USD live, escribe fórmulas nativas de Sheets para Saldo, Estado y Fecha Último Pago.
- Hoja Cargas ampliada: Módulo B en `K4:Q23` para compromisos devengados.
- `Carga_Registros.js` extendido a `C4:I23` (col I = ID_CXC opcional para imputar pagos).
- Nuevo ítem de menú: `🛠️ Procesar Lote Devengado (CxP/CxC)`.
- `00_Config.js` actualizado con `COMPROMISOS`, `CARGAS_MODULO` y `CARGAS_DEVENGADO`.
- `MODELO_DATOS.md` actualizado con Clientes, Proveedores y Registros - Compromisos.

### Resultado
- El ciclo de vida de un compromiso (apertura → imputaciones parciales → cancelación) queda 100% automatizado via fórmulas SUMIF/MAXIFS nativas de Sheets.

---
## 2026-03-25 - Sprint 1b: Clientes, Proveedores y Fix FX (v1.2.0)

### Evento
Extensión del Sprint 1. Se agregaron BDs de Clientes y Proveedores como preparación para las CxP/CxC (Sprint 3), y se corrigió el bug crítico de cotización del dólar.

### Cambios Implementados
- Nuevos bloques `CLIENTES` (AF:AH) y `PROVEEDORES` (AJ:AL) en `00_Config.js`.
- CRUD extendido en `01_Backend_PlanCuentas.js` para ambos tipos (Nombre, CUIT/CUIL, Proyecto).
- Campo CUIT obligatorio en el ABM (`01_UI_PlanCuentas.html`).
- Fix crítico en `Carga_Registros.js`: fecha de HOY → API live (`dolarapi.com`) primero; fecha histórica → caché → `argentinadatos.com`.
- Nueva función `fetchCotizacionParaFecha()` en `Tipo_Cambio_API.js` con persistencia automática en caché.

### Resultado
- El sistema ya cuenta con un glosario de Clientes y Proveedores ABM-administrable.
- Los registros de carga siempre reciben la cotización real del dólar, sin el bug del $1.

---
## 2026-03-24 - Cambio de Paradigma: Arquitectura AI-First (v0.2.0)

### Evento
El usuario (y PM) determinó que el escrutinio visual vía Chrome Agents era obsoleto. Se implementó un pivote arquitectónico hacia la lectura profunda del Canvas y extracción de datos en JSON puro para alimentar Cerebros Externos (LLMs).

### Cambios Implementados
- Creación de la DevTool `ScannerArquitectura.js` (Escaner absoluto O(1) de fórmulas y UX).
- Programación de un compilador Node.js generador de Grafos Dirigidos Mermaid y esquemas taxonómicos hiper-detallados (`ARQUITECTURA_DETALLADA.md`).
- Redacción e inyección del `SYSTEM_PROMPT_BOT.md` con reglas inflexibles para Gemini Gems y NotebookLM.

### Resultado
- Tidetrack alcanzó su fase `AI-First`. El repositorio público ahora enseña visualmente su propia topología neuronal. El contexto ciego desapareció, mitigando al 100% las "alucinaciones de rangos" gracias a la sincronización estricta.

---
## 2026-03-23 - Fix de Nomenclatura en Script de Migración (v0.1.0-Iteracion01)

### Evento
Notificación automática: el modelo detectó la corrección manual de referencias obsoletas directamente en el backend.

### Cambios Implementados
- Renombramiento de string "Cuentas" a "Plan de Cuentas" en `src/migracion-UENS.js`.
- Ajuste de sensibilidad a mayusculas de "REGISTROS" a "Registros".

### Resultado
- Prevención exitosa de error nulo alertado por `getUi().alert()` al ejecutar mapeos de migración vieja.

---
## 2026-03-23 - Inicialización del sistema de control de versiones (v0.1.0)

### Evento
El usuario solicitó formalizar el sistema de changelog automático para las iteraciones y definir reglas claras para la verificación de vinculación remota de Apps Script.

### Cambios Implementados
- Creación de `src/ZZ_Changelog.js` como fuente de verdad en código.
- Inicialización de `HISTORIAL_DESARROLLO.md`.
- Documentación de reglas base (`.agent/rules/appscript-link.md` y `.agent/rules/changelog-obligatorio.md`).

### Resultado
- El proyecto y sus agentes operan bajo la directiva irrompible de actualizar el registro en base a cada iteración y modificación realizada en los documentos.
