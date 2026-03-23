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

---
> **Nota de Arquitectura**: Registrar todo lo que ocurre basándose en este Plan de Cuentas es la regla única para permitir distintas visiones, análisis e interpretaciones (Flujos de fondos).
