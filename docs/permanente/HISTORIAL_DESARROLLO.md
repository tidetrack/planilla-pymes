# Historial de Desarrollo Tidetrack

Este documento mantiene un registro humano legible y cronológico de todas las iteraciones, features y bugs arreglados en el proyecto.

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
