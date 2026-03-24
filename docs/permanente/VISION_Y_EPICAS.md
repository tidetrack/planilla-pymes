# Visión de Producto y Épicas de Tidetrack

## Visión Fundamental
Evolucionar la Planilla Pymes actual hacia un ecosistema financiero inteligente y automatizado.
Se requiere profundizar en cuentas corrientes complejas, medición de liquidez y manejo multi-moneda. 
**El objetivo cúspide** es que la arquitectura de datos relacional y el backend de Apps Script estén lo suficientemente estructurados para que un Asistente IA (como NotebookLM o un LLM custom) pueda interpretar, analizar, notificar y medir las finanzas del cliente.

## Roadmap (Product Backlog) - Los 7 Sprints

### Sprint 1: Unidades Estratégicas de Negocio (UENS)
- **Descripción**: Implementar UENS transversalmente en la base de datos y la carga de información, además de los actuales "Proyectos".
- **Objetivo**: Permitir análisis P&L (Pérdidas y Ganancias) segmentados por Unidad de Negocio.

### Sprint 2: Motor de Liquidez y Monedas
- **Descripción**: Arreglar la situación de cálculo de liquidez actual.
- **Objetivo**: Implementar un seguimiento preciso de flujos y medios de pago aplicando filtros de tipo de moneda de forma dinámica (ej. ARS vs USD).

### Sprint 3: Cuentas por Pagar y Cobrar (CxP / CxC)
- **Descripción**: Mapeo estricto de deudas y saldos pendientes.
- **Objetivo**: Cruces de información de CxP y CxC segmentados por UENS.

### Sprint 4: Cuentas Corrientes de Proveedores
- **Descripción**: Gestión de saldos vivos de los principales proveedores.
- **Objetivo**: Visibilidad de asimetrías de caja frente a proveedores estratégicos.

### Sprint 5: Refactorización Hoja PRESUPUESTADO
- **Descripción**: Arreglar o reestructurar la hoja de PRESUPUESTADO.
- **Objetivo**: Garantizar que el cruce Real vs Presupuesto ofrezca desviaciones confiables sin quebrar el motor de cálculo.

### Sprint 6: Activos No Corrientes | ESP
- **Descripción**: Trackear activos fijos de la empresa y flujos no directamente operativos.
- **Objetivo**: Ofrecer una foto patrimonial (Estado de Situación Patrimonial) base.

### Sprint 7: Seguimiento Operativo Semanal (Weekly Dashboard)
- **Descripción**: Desarrollar un panel de control con perspectiva a corto plazo (semanas).
- **Objetivo**: Gestión táctica de caja, complementando la perspectiva anual y de largo plazo existente.

---

> **Nota para el equipo de Agentes**:
> Toda tarea de código que ejecuten debe validar contra el modelo existente (`00_Config.js` y el mapeo en `ARQUITECTURA_SISTEMA.md`). La estabilidad de las fórmulas nativas de Google Sheets es la máxima prioridad.
