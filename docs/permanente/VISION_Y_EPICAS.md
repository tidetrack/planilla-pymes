# Visión de Producto y Épicas de Tidetrack

## Visión Fundamental
Evolucionar la Planilla Pymes actual hacia un ecosistema financiero inteligente y automatizado.
Se requiere profundizar en cuentas corrientes complejas, medición de liquidez y manejo multi-moneda. 
**El objetivo cúspide** es que la arquitectura de datos relacional y el backend de Apps Script estén lo suficientemente estructurados para que un Asistente IA (como NotebookLM o un LLM custom) pueda interpretar, analizar, notificar y medir las finanzas del cliente.

## Roadmap (Product Backlog) - Los 7 Sprints

### ✅ Sprint 1: Unidades Estratégicas de Negocio (UENS) — COMPLETADO
- **Descripción**: Implementar UENS transversalmente en la base de datos y la carga de información, además de los actuales "Proyectos".
- **Objetivo**: Permitir análisis P&L (Pérdidas y Ganancias) segmentados por Unidad de Negocio.
- **Completado**: v1.1.0 + v1.2.0. Incluye glosario de Clientes/Proveedores (CUIT) y fix FX inteligente.

### ⏸️ Sprint 2: Motor de Liquidez y Monedas — DIFERIDO
- **Descripción**: Arreglar la situación de cálculo de liquidez actual.
- **Objetivo**: Implementar un seguimiento preciso de flujos y medios de pago aplicando filtros de tipo de moneda de forma dinámica (ej. ARS vs USD).

### ✅ Sprint 3: Cuentas por Pagar y Cobrar (CxP / CxC) — COMPLETADO (v1.3.0)
- **Descripción**: Mapeo estricto de deudas y saldos pendientes.
- **Completado**: BD `Registros - Compromisos`, motor devengado, módulo B en Cargas.

### ✅ Sprint 4: Cuentas Corrientes de Proveedores — RESUELTO CON SPRINT 3
- **Nota**: La BD de Compromisos y el glosario de Proveedores/Clientes implementados en Sprint 3 cubren este sprint. El tablero visual se planifica en sprint futuro.

### 🔄 Sprint 5: Refactorización Hoja PRESUPUESTADO — EN PROGRESO (v1.4.0)
- **Descripción**: Reestructuración de la hoja `Cargas` en 3 bloques + BD normalizada `Registros - Presupuesto` + hoja de vista bimonetaria con ventana rodante.
- **En progreso**: BD y backend de carga completados. Pendiente: hoja de vista `Presupuesto` con fórmulas SUMPRODUCT.

### Sprint 6: Activos No Corrientes | ESP
- **Descripción**: Trackear activos fijos de la empresa y flujos no directamente operativos.
- **Objetivo**: Ofrecer una foto patrimonial (Estado de Situación Patrimonial) base.

### Sprint 7: Seguimiento Operativo Semanal (Weekly Dashboard)
- **Descripción**: Desarrollar un panel de control con perspectiva a corto plazo (semanas).
- **Objetivo**: Gestión táctica de caja, complementando la perspectiva anual y de largo plazo existente.

---

> **Nota para el equipo de Agentes**:
> Toda tarea de código que ejecuten debe validar contra el modelo existente (`00_Config.js` y el mapeo en `ARQUITECTURA_SISTEMA.md`). La estabilidad de las fórmulas nativas de Google Sheets es la máxima prioridad.
