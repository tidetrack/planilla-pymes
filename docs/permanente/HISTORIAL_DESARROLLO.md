# Historial de Desarrollo Tidetrack

Este documento mantiene un registro humano legible y cronológico de todas las iteraciones, features y bugs arreglados en el proyecto.

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
