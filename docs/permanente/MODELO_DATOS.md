# Modelo de Datos - Planilla Pymes

Este documento centraliza la estructura de datos troncal de la Planilla Pymes, específicamente la hoja **Plan de Cuentas**, la cual alimenta al resto de los módulos. Es primordial su entendimiento, llenado, cuidado y mantenimiento.

## Hoja Troncal | Plan de Cuentas

### 1. Ingresos y recursos
Ubicación: `B2:E` (Fila 2 encabezados)
- **Columna B**: Nombre de la Cuenta
- **Columna C**: Proyecto Asociado
- **Columna D**: UEN asociada
- **Columna E**: Fecha de Vencimiento para cobro

### 2. Costo de ventas
Ubicación: `G2:J` (Fila 2 encabezados)
- **Columna G**: Nombre de la Cuenta
- **Columna H**: Proyecto Asociado
- **Columna I**: UEN asociada
- **Columna J**: Fecha de Vencimiento para cobro

### 3. Gastos
Ubicación: `L2:O` (Fila 2 encabezados)
- **Columna L**: Nombre de la Cuenta
- **Columna M**: Proyecto Asociado
- **Columna N**: UEN asociada
- **Columna O**: Fecha de Vencimiento para cobro

### 4. Carga Fiscal
Ubicación: `Q2:T` (Fila 2 encabezados)
- **Columna Q**: Nombre de la Cuenta
- **Columna R**: Proyecto Asociado
- **Columna S**: UEN asociada
- **Columna T**: Fecha de Vencimiento para cobro

### 5. Movimientos
Ubicación: `V2:V` (Fila 2 encabezados)
- Sirven para registrar movimientos internos y permutativos, y para conciliar cuentas bancarias.

### 6. Resultados
Ubicación: `X2:Y` (Fila 2 encabezados)
- **Columna X**: Nombre de la cuenta
- **Columna Y**: UEN Asociada

### 7. Medios de Pago
Ubicación: `AA2:AD` (Fila 2 encabezados)
- **Columna AA**: Nombre de la Cuenta
- **Columna AB**: Moneda
- **Columna AC**: Proyecto Asociado
- **Columna AD**: UEN asociada

### 8. Proyectos
Ubicación: `AF2:AF` (Fila 2 encabezados)
- Recopila los distintos proyectos de la empresa.

### 9. Unidades de Negocios
Ubicación: `AH2:AH` (Fila 2 encabezados)
- Recopila las distintas Unidades de Negocio (UEN) de la empresa.

### 10. Clientes
Ubicación: `AF2:AH` (Fila 2 encabezados)
- **Columna AF**: Nombre del Cliente (Razón Social)
- **Columna AG**: CUIT / CUIL
- **Columna AH**: Proyecto Asociado

### 11. Proveedores
Ubicación: `AJ2:AL` (Fila 2 encabezados)
- **Columna AJ**: Nombre del Proveedor (Razón Social)
- **Columna AK**: CUIT / CUIL
- **Columna AL**: Proyecto Asociado

---

## Hoja de BD | Registros - Compromisos

Libro de compromisos devengados (CxP y CxC). Alimentada automáticamente desde el Módulo B de la hoja **Cargas** (`K4:Q23`).

| Col | Campo | Tipo / Origen |
|---|---|---|
| B | ID | Auto-generado: `CXC-YYYYMMDD-NNN` / `CXP-YYYYMMDD-NNN` |
| C | Fecha Registro | Auto (fecha de procesamiento) |
| D | Fecha Compromiso | Manual (col P de Cargas) |
| E | Monto Comprometido | Manual (col K de Cargas) |
| F | Total Imputado | Fórmula: `SUMIF` sobre `Registros col M` |
| G | Saldo | Fórmula: `E - F` |
| H | Fecha Último Pago | Fórmula: `MAXIFS` sobre `Registros` por ID |
| I | Estado | Fórmula: `Pendiente / Parcial / Cancelado` |
| J | Tipo | `Por Cobrar` / `Por Pagar` (col L de Cargas) |
| K | Cliente / Proveedor | Glosario (col M de Cargas) |
| L | Cuenta | Plan de Cuentas (col N de Cargas) |
| M | Proyecto Asociado | Auto-inferido desde la Cuenta |
| N | UEN Asociada | Auto-inferida desde el Proyecto |
| O | Cotización USD Venta | Auto (API live al procesar) |
| P | Cotización USD Compra | Auto (API live al procesar) |
| Q | Nota | Libre (col Q de Cargas) |

---
> **Nota de Arquitectura**: Registrar todo lo que ocurre basándose en este Plan de Cuentas es la regla única para permitir distintas visiones, análisis e interpretaciones (Flujos de fondos).

---

## Hoja de BD | Registros - Presupuesto

Libro de montos presupuestados por cuenta y período. Alimentada automáticamente desde el Bloque C de la hoja **Cargas** (`C56:I75`) mediante la función `procesarLotePresupuesto()`. Los datos comienzan en **fila 6** (fila 5 = encabezados), ordenados Z→A por Fecha carga.

| Col | Campo | Tipo / Origen |
|---|---|---|
| B | Fecha Carga | Auto (timestamp al procesar el lote) |
| C | Monto | Manual (col C de Cargas) |
| D | Fecha Presupuestada | Manual — período al que aplica (col H de Cargas) |
| E | Tipo | Auto-inferido desde Plan de Cuentas (`Ingreso / Costo / Gasto / Fiscal / Resultado`) |
| F | Cuenta | Manual (col D de Cargas) |
| G | Proyecto Asociado | Auto-inferido desde la Cuenta |
| H | Unidad Asociada | Auto-inferida desde el Proyecto |
| I | Moneda | Manual (`ARS` / `USD`, col F de Cargas) |
| J | Nota | Libre (col I de Cargas) |
| K | Cotización USD Venta | Auto (API live al procesar) |
| L | Cotización USD Compra | Auto (API live al procesar) |


