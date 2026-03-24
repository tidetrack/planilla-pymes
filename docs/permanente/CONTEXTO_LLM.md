# Contexto LLM - Mapeo de Base de Datos

**🔗 URL Maestra de la Planilla Pymes (Producción):**
[Google Sheets - Planilla Pymes](https://docs.google.com/spreadsheets/d/1E9ord020rPwk6qrvbqxLZV4QoA-tEq7M2af6tR5P8Wc/edit?usp=sharing)
*(Guardado para referencias de estructura, mapeo de celdas y arquitectura).*

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
- **AG**: Proyectos - UEN Asociada
- **AI**: Unidades de Negocio (UEN Maestro)
