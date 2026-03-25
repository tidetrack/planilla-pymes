# Historial de Desarrollo Tidetrack

Este documento mantiene un registro humano legible y cronológico de todas las iteraciones, features y bugs arreglados en el proyecto.

---
## 2026-03-25 - Sprint 3: Motor CxP/CxC — Registros - Compromisos (v1.3.0)

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
