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
- **R**: Movimientos - Nombre
- **T**: Resultados - Nombre
- **U**: Resultados - Proyecto Asociado
- **W**: Medios de Pago - Nombre
- **X**: Medios de Pago - Moneda
- **Y**: Medios de Pago - Proyecto Asociado
- **AA**: Proyectos Disponibles
- **AB**: Proyectos - UEN Asociada
- **AD**: Unidades de Negocio (UEN Maestro)

## Hoja Cargas (Bloques de Carga en Lote)
**Hoja Exacta**: `Cargas`
Estructura de 3 bloques independientes, cada uno con encabezado en la primera fila del bloque:

- **Bloque A** `C6:I25` (enc. fila 5) → Movimientos: Monto, Tipo, Cuenta, Medio, Fecha(auto), Nota, ID_Compromiso
- **Bloque B** `C31:I50` (enc. fila 30) → Compromisos CxP/CxC: Monto, Tipo, Contraparte, Cuenta, Moneda, FechaCompromiso, Nota
- **Bloque C** `C56:I75` (enc. fila 55) → Presupuesto: Monto, Cuenta, -, Moneda, FechaCarga(auto), FechaPresupuestada, Nota

## Registros - Movimientos
**Hoja Exacta**: `Registros - Movimientos`
**Rango de Datos**: `B4:N` (Fila 3 Encabezados, datos desde fila 4, orden Z→A por Fecha)

*Columnas Mapeadas*:
- **B**: Fecha de Movimiento
- **C**: Monto
- **D**: Tipo (Ingreso / Egreso)
- **E**: Cuenta (Listado Plan de Cuentas)
- **F**: Tipo de Cuenta (Categoría contable: Ingresos, Gastos, Costos, etc)
- **G**: Proyecto Asociado (auto-inferido)
- **H**: UEN Asociada (auto-inferida)
- **I**: Medio de Pago
- **J**: Moneda (ARS / USD)
- **K**: Nota
- **L**: Cotización Dólar Venta
- **M**: Cotización Dólar Compra
- **N**: ID Compromiso (Para imputar vinculaciones con CxP/CxC)

## Registros - Presupuesto
**Hoja Exacta**: `Registros - Presupuesto`
**Rango de Datos**: `B6:L` (Fila 5 Encabezados, datos desde fila 6, orden Z→A por FechaCarga)

*Columnas Mapeadas*:
- **B**: Fecha Carga (auto al procesar)
- **C**: Monto presupuestado
- **D**: Fecha Presupuestada (período que aplica, manual)
- **E**: Tipo (Ingreso / Costo / Gasto / Fiscal / Resultado — auto-inferido)
- **F**: Cuenta (referencia al Plan de Cuentas)
- **G**: Proyecto Asociado (auto-inferido)
- **H**: Unidad Asociada (auto-inferida)
- **I**: Moneda (ARS / USD)
- **J**: Nota
- **K**: Cotización USD Venta (API live)
- **L**: Cotización USD Compra (API live)

