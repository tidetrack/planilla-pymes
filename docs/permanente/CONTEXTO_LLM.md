# Contexto LLM - Mapeo de Base de Datos

Este documento define la estructura relacional de las hojas de cálculo del proyecto *Planilla Pymes*. Google Sheets actúa como la capa de persistencia (Base de Datos), mientras que Apps Script actúa como el Backend ORM.

## Plan_Cuentas_Pyme
**Hoja Exacta**: `Plan de Cuentas`
**Rango de Inicio de Datos**: `A3:AH` (Fila 1 Títulos Generales, Fila 2 Encabezados)
**Finalidad**: Catálogo centralizado que alimenta selects y validaciones en todo el sistema.

*Columnas Mapeadas*:
- **B**: Ingresos - Nombre
- **C**: Ingresos - Proyecto Asociado
- **D**: Ingresos - UEN Asociada
- **E**: Ingresos - Fecha Vencimiento
- **G**: Costos - Nombre
- **H**: Costos - Proyecto Asociado
- **I**: Costos - UEN Asociada
- **J**: Costos - Fecha Vencimiento
- **L**: Gastos - Nombre
- **M**: Gastos - Proyecto Asociado
- **N**: Gastos - UEN Asociada
- **O**: Gastos - Fecha Vencimiento
- **Q**: Carga Fiscal - Nombre
- **R**: Carga Fiscal - Proyecto Asociado
- **S**: Carga Fiscal - UEN Asociada
- **T**: Carga Fiscal - Fecha Vencimiento
- **V**: Movimientos - Nombre
- **X**: Resultados - Nombre
- **Y**: Resultados - UEN Asociada
- **AA**: Medios de Pago - Nombre
- **AB**: Medios de Pago - Moneda
- **AC**: Medios de Pago - Proyecto Asociado
- **AD**: Medios de Pago - UEN Asociada
- **AF**: Proyectos Disponibles
- **AH**: Unidades de Negocio (UEN)
