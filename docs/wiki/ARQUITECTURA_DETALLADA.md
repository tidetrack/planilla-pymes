# Arquitectura Pymes: Desde la Celda hasta el Sistema

Esta documentación hiper-detallada reconstruye la anatomía de la "Planilla Pymes" identificando cada tarjeta, bloque de valores y los procesos sistémicos interconectados.

## 🕸️ Topología del Sistema (Grafo de Dependencias)

El siguiente modelo de red visual, construido con código *Mermaid*, ilustra el flujo transaccional. Las flechas indican de dónde extrae información una hoja para funcionar (Relaciones de Dependencia creadas por fórmulas profundas).

```mermaid
graph TD
    "REGISTROS - Movimientos" --> "PANEL"
    "Plan de Cuentas" --> "PANEL"
    "ANUAL - PRES." --> "PANEL"
    "REGISTROS - Movimientos" --> "FlowCash"
    "Plan de Cuentas" --> "FlowCash"
    "ANUAL - PRES." --> "FlowCash"
    "Plan de Cuentas" --> "ANUAL - PRES."
    "REGISTROS - Movimientos" --> "ANUAL - REAL"
    "Plan de Cuentas" --> "ANUAL - REAL"
    "PANEL" --> "ANUAL - REAL"
    "ANUAL - REAL" --> "REGISTROS - Movimientos"
    "REGISTROS - Movimientos" --> "EXP_PREPAGA"
    "ANUAL - PRES." --> "EXP_PREPAGA"
    "Plan de Cuentas" --> "EXP_PREPAGA"
```

## 📄 Nodo de Sistema: `PANEL`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 1569x97 y contiene 105 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ CALENDARIO ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 14pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=SEQUENCE( 6,7,H1-WEEKDAY(H1,1)+1)`

#### Tarjeta: **[ 46082 ]** (Columna H)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0 / #e6f4ea`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=DATEVALUE(B3&" 1 "&G3)`

#### Tarjeta: **[ 3 ]** (Columna I)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=MONTH(H1)`

#### Tarjeta: **[ PANEL DE CUENTAS  ]** (Columna K)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 14pt, 9pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=IFERROR(QUERY('Plan de Cuentas'!B3:D, "SELECT B WHERE B IS NOT NULL" & IF(F12="TODOS", "", " AND C = '"&F12&"'"), 0),"")`

#### Tarjeta: **[ REGISTROS MES ]** (Columna AT)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0)`

#### Tarjeta: **[ REGISTROS MES ANTERIOR ]** (Columna BD)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(EOMONTH(BC3,-1),"yyyy-MM-dd")&"' AND A <= date '"&TEXT(BC3,"yyyy-MM-dd")&"'", 0)`

#### Tarjeta: **[ REGISTROS MES SIN FILTROS ]** (Columna BN)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0)`

#### Tarjeta: **[ CÁLCULOS AUXILIARES ]** (Columna BX)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0 / #f1f3f4`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=K6`
  - `=K7`
  - `=K8`
  - *(+1553 iteraciones funcionales)*

## 📄 Nodo de Sistema: `FlowCash`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 49x61 y contiene 41 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ CALENDARIO ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 14pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=SEQUENCE( 6,7,H1-WEEKDAY(H1,1)+1)`

#### Tarjeta: **[ 46082 ]** (Columna H)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=DATEVALUE(B3&" 1 "&G3)`

#### Tarjeta: **[ 3 ]** (Columna I)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=MONTH(H1)`

#### Tarjeta: **[ FLUJO DE FONDOS ]** (Columna K)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 14pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ REGISTROS MES ]** (Columna AQ)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=IF(F12="Todos", QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0), QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE E = '"&F12&"' AND A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0))`

#### Tarjeta: **[ CÁLCULOS AUXILIARES ]** (Columna BA)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0 / #e2ecf0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=K50`

## 📄 Nodo de Sistema: `CARGA`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 3x10 y contiene 0 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ CARGA - REGISTROS ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

## 📄 Nodo de Sistema: `ANUAL - PRES.`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 750x90 y contiene 4 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ PRESUPUESTO GENERAL ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 11pt, 10pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[   1. INGRESOS ]** (Columna Q)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 1. Ingresos y Recursos ]** (Columna R)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!B3`
  - `='Plan de Cuentas'!B4`
  - `='Plan de Cuentas'!B5`
  - *(+744 iteraciones funcionales)*

#### Tarjeta: **[ 2. COSTOS DE VENTAS  ]** (Columna AF)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 2. Costo de Ventas ]** (Columna AG)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!F3`
  - `='Plan de Cuentas'!F4`
  - `='Plan de Cuentas'!F5`
  - *(+744 iteraciones funcionales)*

#### Tarjeta: **[ 3. GASTOS  ]** (Columna AU)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 3. Gastos ]** (Columna AV)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!J3`
  - `='Plan de Cuentas'!J4`
  - `='Plan de Cuentas'!J5`
  - *(+744 iteraciones funcionales)*

#### Tarjeta: **[ 4. CARGA FISCAL ]** (Columna BJ)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 4. Carga Fistal ]** (Columna BK)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!N3`
  - `='Plan de Cuentas'!N4`
  - `='Plan de Cuentas'!N5`
  - *(+39 iteraciones funcionales)*

#### Tarjeta: **[ 6. RESULTADOS ]** (Columna BY)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 6. Resultados ]** (Columna BZ)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!T3`
  - `='Plan de Cuentas'!T4`
  - `='Plan de Cuentas'!T5`
  - *(+29 iteraciones funcionales)*

## 📄 Nodo de Sistema: `ANUAL - REAL`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 750x104 y contiene 9 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ E.R. REAL ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 11pt, 10pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 1.INGRESOS                    ]** (Columna Q)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 1. INGRESOS Y RECURSOS ]** (Columna R)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!B3`
  - `='Plan de Cuentas'!B4`
  - `='Plan de Cuentas'!B5`
  - *(+744 iteraciones funcionales)*

#### Tarjeta: **[ 2.COSTOS DE VENTAS  ]** (Columna AF)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 2. COSTOS DE VENTAS ]** (Columna AG)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!F3`
  - `='Plan de Cuentas'!F4`
  - `='Plan de Cuentas'!F5`
  - *(+744 iteraciones funcionales)*

#### Tarjeta: **[ 3.GASTOS  ]** (Columna AU)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 3. GASTOS ]** (Columna AV)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!J3`
  - `='Plan de Cuentas'!J4`
  - `='Plan de Cuentas'!J5`
  - *(+744 iteraciones funcionales)*

#### Tarjeta: **[ 4.CARGA FISCAL ]** (Columna BJ)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 4. CARGA FISCAL ]** (Columna BK)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!N3`
  - `='Plan de Cuentas'!N4`
  - `='Plan de Cuentas'!N5`
  - *(+35 iteraciones funcionales)*

#### Tarjeta: **[ 6.RESULTADOS ]** (Columna BY)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ 6. RESULTADOS ]** (Columna BZ)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `='Plan de Cuentas'!T3`
  - `='Plan de Cuentas'!T4`
  - `='Plan de Cuentas'!T5`
  - *(+29 iteraciones funcionales)*

#### Tarjeta: **[ MOVIMIENTOS ]** (Columna CN)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ MOVIMIENTOS ]** (Columna CO)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=QUERY('REGISTROS - Movimientos'!A:I)`

## 📄 Nodo de Sistema: `Plan de Cuentas`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 59x39 y contiene 0 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ PLAN DE CUENTAS  ]** (Columna A)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 16pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

## 📄 Nodo de Sistema: `REGISTROS - Movimientos`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 215x9 y contiene 0 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ FECHA ]** (Columna A)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ INGRESO ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ EGRESO ]** (Columna C)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ DETALLE ]** (Columna D)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ MEDIO ]** (Columna E)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ UNIDAD DE NEGOCIO ]** (Columna F)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ MONEDA ]** (Columna G)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

#### Tarjeta: **[ TIPO CAMBIO DÓLAR ]** (Columna H)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=IF(A2="", "", IFERROR(VLOOKUP(TEXT(A2, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
  - `=IF(A3="", "", IFERROR(VLOOKUP(TEXT(A3, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
  - `=IF(A4="", "", IFERROR(VLOOKUP(TEXT(A4, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
  - *(+211 iteraciones funcionales)*

#### Tarjeta: **[ OBSERVACIÓN ]** (Columna I)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40`. Tamaños de fuente operativos: 15pt, 11pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

## 📄 Nodo de Sistema: `GLOSARIO KPIS`
> **Estado en la Red:** Capa de Interacción (VISIBLE). Opera sobre un grid de 22x7 y contiene 0 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ GLOSARIO DE INDICADORES ]** (Columna C)
- **Capa UX (Estilizado):** Fondos detectados `#1a2f40 / #e0e0e0`. Tamaños de fuente operativos: 16pt, 10pt, 13pt.
- **Reconstrucción de la Unidad:** Celda pasiva (Hardcoded o ingreso manual de datos).

## 📄 Nodo de Sistema: `EXP_PREPAGA`
> **Estado en la Red:** Procesamiento Secundario (OCULTA). Opera sobre un grid de 3x65 y contiene 0 validaciones condicionales que guían la UX del operador.

### 🗂️ Taxonomía de Tarjetas (Bloques Lógicos de Columna)

#### Tarjeta: **[ REGISTROS MPP ]** (Columna B)
- **Capa UX (Estilizado):** Fondos detectados `#11252c / #1a2f40`. Tamaños de fuente operativos: 15pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=QUERY({
   QUERY('REGISTROS - Movimientos'!A:I, "SELECT A, B, C, D, E, F, G, H WHERE F = 'UEN-Medicina Prepaga' AND NOT LOWER(F) CONTAINS 'sin movim'", 1);
   QUERY('REGISTROS - Movimientos'!A:I, "SELECT A, B, C/3, D, E, 'Gasto Prorrateado', G, H WHERE F = 'UEN-Estructura Compartida' AND NOT LOWER(F) CONTAINS 'sin movim' LABEL C/3 '', 'Gasto Prorrateado' ''", 0);
   QUERY('REGISTROS - Movimientos'!A:I, "SELECT A, B, C/2, D, E, 'Gasto Mix MPP', G, H WHERE F = 'UEN-MPP + Pat' AND NOT LOWER(F) CONTAINS 'sin movim' LABEL C/2 '', 'Gasto Mix MPP' ''", 0)
}, "SELECT * WHERE Col1 IS NOT NULL ORDER BY Col1 ASC", 1)`

#### Tarjeta: **[ ANUAL - PRES | INGRESOS Y RECURSOS MPP ]** (Columna K)
- **Capa UX (Estilizado):** Fondos detectados `#11252c / #e0e0e0`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=FILTER(HSTACK('ANUAL - PRES.'!R4:R, 'ANUAL - PRES.'!S4:AD), ('ANUAL - PRES.'!R4:R <> "") * (IFERROR(VLOOKUP('ANUAL - PRES.'!R4:R, 'Plan de Cuentas'!B:C, 2, FALSE), "")="UEN-Medicina Prepaga") > 0)`

#### Tarjeta: **[ ANUAL - PRES | COSTO DE VENTAS MPP ]** (Columna Y)
- **Capa UX (Estilizado):** Fondos detectados `#11252c / #e0e0e0`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=FILTER(HSTACK('ANUAL - PRES.'!AG4:AG, 'ANUAL - PRES.'!AH4:AS / IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-Estructura Compartida", 3, IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-MPP + Pat", 2, 1))), ('ANUAL - PRES.'!AG4:AG <> "") * ((IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-Medicina Prepaga") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-Estructura Compartida") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-MPP + Pat")) > 0)`

#### Tarjeta: **[ ANUAL - PRES | GASTOS MPP ]** (Columna AM)
- **Capa UX (Estilizado):** Fondos detectados `#11252c / #e0e0e0`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=FILTER(HSTACK('ANUAL - PRES.'!AV4:AV, 'ANUAL - PRES.'!AW4:BH / IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-Estructura Compartida", 3, IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-MPP + Pat", 2, 1))), ('ANUAL - PRES.'!AV4:AV <> "") * ((IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-Medicina Prepaga") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-Estructura Compartida") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-MPP + Pat")) > 0)`

#### Tarjeta: **[ ANUAL - PRES | CARGA FISCAL MPP ]** (Columna BA)
- **Capa UX (Estilizado):** Fondos detectados `#11252c / #e0e0e0`. Tamaños de fuente operativos: 10pt.
- **Reconstrucción de la Unidad (Fórmulas Atómicas):**
  - `=FILTER(HSTACK('ANUAL - PRES.'!BK4:BK, 'ANUAL - PRES.'!BL4:BW / IF(IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-Estructura Compartida", 3, IF(IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-MPP + Pat", 2, 1))), ('ANUAL - PRES.'!BK4:BK <> "") * ((IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-Medicina Prepaga") + (IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-Estructura Compartida") + (IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-MPP + Pat")) > 0)`

