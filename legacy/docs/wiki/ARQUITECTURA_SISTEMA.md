# Arquitectura de Planilla Pymes (Genética del Sistema)

Este documento ha sido autogenerado y **representa el mapa genético absoluto al 100%** de la Planilla Pymes de Tidetrack. Cada fórmula, hoja y configuración visual ha sido escaneada computacionalmente.

## Resumen Global
- **Fecha de Escaneo:** 2026-03-23T22:02:35.079Z
- **ID de Planilla (Producción):** `1E9ord020rPwk6qrvbqxLZV4QoA-tEq7M2af6tR5P8Wc`
- **Total de Hojas Detectadas:** 9

---

## 📂 Módulo: `PANEL` 

### 1. Dimensiones y UI
- **Grilla Total:** 1569 filas x 97 columnas.
- **Estabilidad Visual:** 0 filas y 9 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **105 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`CALENDARIO | 46082 | 3 | PANEL DE CUENTAS  | REGISTROS MES | REGISTROS MES ANTERIOR | REGISTROS MES SIN FILTROS | CÁLCULOS AUXILIARES`

### 3. Motor de Cálculo (Fórmulas Residente)
Se detectó alta densidad analítica (2957 cálculos únicos subyacentes). Principales lógicas operativas detectadas:

- `=DATEVALUE(B3&" 1 "&G3)`
- `=MONTH(H1)`
- `=EOMONTH(H1,-1)`
- `=SUM(AO6:AO15)`
- `=SUM(AR6:AR15)`
- `=QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0)`
- `=QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(EOMONTH(BC3,-1),"yyyy-MM-dd")&"' AND A <= date '"&TEXT(BC3,"yyyy-MM-dd")&"'", 0)`
- `=SEQUENCE( 6,7,H1-WEEKDAY(H1,1)+1)`
- *[Y 2949 derivaciones lógicas adicionales...]*

---

## 📂 Módulo: `FlowCash` 

### 1. Dimensiones y UI
- **Grilla Total:** 49 filas x 61 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **41 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`CALENDARIO | 46082 | 3 | FLUJO DE FONDOS | REGISTROS MES | CÁLCULOS AUXILIARES`

### 3. Motor de Cálculo (Fórmulas Residente)
Se detectó alta densidad analítica (118 cálculos únicos subyacentes). Principales lógicas operativas detectadas:

- `=DATEVALUE(B3&" 1 "&G3)`
- `=MONTH(H1)`
- `=EOMONTH(H1,-1)`
- `=IF(F12="Todos", QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0), QUERY('REGISTROS - Movimientos'!A:I, "SELECT * WHERE E = '"&F12&"' AND A >= date '"&TEXT(H1,"yyyy-MM-dd")&"' AND A <= date '"&TEXT(EOMONTH(H1,0),"yyyy-MM-dd")&"'", 0))`
- `=(SUMIFS(AR:AR, AT:AT, "Mov-Inicio-Mes", AW:AW, "ARS") + (SUMIFS(AR:AR, AT:AT, "Mov-Inicio-Mes", AW:AW, "USD") * $F$17)) - (SUMIFS(AS:AS, AT:AT, "Mov-Inicio-Mes", AW:AW, "ARS") + (SUMIFS(AS:AS, AT:AT, "Mov-Inicio-Mes", AW:AW, "USD") * $F$17))`
- `=SEQUENCE(DAY(EOMONTH(H1, 0)), 1, H1, 1)`
- `=IF(BD4="", "", (SUMIFS($AR:$AR, $AQ:$AQ, BD4, $AT:$AT, "<>Mov-Inicio-Mes", $AT:$AT, IF($F$12="Todos", "<>Mov-Traspasos", "*"), $AW:$AW, "ARS") + (SUMIFS($AR:$AR, $AQ:$AQ, BD4, $AT:$AT, "<>Mov-Inicio-Mes", $AT:$AT, IF($F$12="Todos", "<>Mov-Traspasos", "*"), $AW:$AW, "USD") * $F$17)) - (SUMIFS($AS:$AS, $AQ:$AQ, BD4, $AT:$AT, "<>Mov-Inicio-Mes", $AT:$AT, IF($F$12="Todos", "<>Mov-Traspasos", "*"), $AW:$AW, "ARS") + (SUMIFS($AS:$AS, $AQ:$AQ, BD4, $AT:$AT, "<>Mov-Inicio-Mes", $AT:$AT, IF($F$12="Todos", "<>Mov-Traspasos", "*"), $AW:$AW, "USD") * $F$17)))`
- `=IF(BD4="", "",$BB$4  + BE4)`
- *[Y 110 derivaciones lógicas adicionales...]*

---

## 📂 Módulo: `CARGA` 

### 1. Dimensiones y UI
- **Grilla Total:** 3 filas x 10 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **0 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`CARGA - REGISTROS`

### 3. Motor de Cálculo (Fórmulas Residente)
*Hoja de almacenamiento crudo (Base de Datos). No posee inteligencia de cálculo en sus celdas.*

---

## 📂 Módulo: `ANUAL - PRES.` 

### 1. Dimensiones y UI
- **Grilla Total:** 750 filas x 90 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **4 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`PRESUPUESTO GENERAL |   1. INGRESOS | 1. Ingresos y Recursos | 2. COSTOS DE VENTAS  | 2. Costo de Ventas | 3. GASTOS  | 3. Gastos | 4. CARGA FISCAL | 4. Carga Fistal | 6. RESULTADOS | 6. Resultados`

### 3. Motor de Cálculo (Fórmulas Residente)
Se detectó alta densidad analítica (2640 cálculos únicos subyacentes). Principales lógicas operativas detectadas:

- `=SUM(S4:S750)`
- `=SUM(T4:T750)`
- `=SUM(U4:U750)`
- `=SUM(V4:V750)`
- `=SUM(W4:W750)`
- `=SUM(X4:X750)`
- `=SUM(Y4:Y750)`
- `=SUM(Z4:Z750)`
- *[Y 2632 derivaciones lógicas adicionales...]*

---

## 📂 Módulo: `ANUAL - REAL` 

### 1. Dimensiones y UI
- **Grilla Total:** 750 filas x 104 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **9 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`E.R. REAL | 1.INGRESOS                    | 1. INGRESOS Y RECURSOS | 2.COSTOS DE VENTAS  | 2. COSTOS DE VENTAS | 3.GASTOS  | 3. GASTOS | 4.CARGA FISCAL | 4. CARGA FISCAL | 6.RESULTADOS | 6. RESULTADOS | MOVIMIENTOS | MOVIMIENTOS`

### 3. Motor de Cálculo (Fórmulas Residente)
Se detectó alta densidad analítica (4533 cálculos únicos subyacentes). Principales lógicas operativas detectadas:

- `=QUERY('REGISTROS - Movimientos'!A:I)`
- `=SUM(S4:S750)`
- `=SUM(T4:T750)`
- `=SUM(U4:U750)`
- `=SUM(V4:V750)`
- `=SUM(W4:W750)`
- `=SUM(X4:X750)`
- `=SUM(Y4:Y750)`
- *[Y 4525 derivaciones lógicas adicionales...]*

---

## 📂 Módulo: `Plan de Cuentas` 

### 1. Dimensiones y UI
- **Grilla Total:** 59 filas x 39 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **0 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`PLAN DE CUENTAS `

### 3. Motor de Cálculo (Fórmulas Residente)
Cálculos directos y subyacentes:

- `=ARRAYFORMULA(QUERY(FLATTEN({B3:B;G3:G;L3:L;Q3:Q;V3:V;X3:X}), 
"select * where Col1 is not null"))
`
- `=ARRAYFORMULA(QUERY(FLATTEN({AA3:AA}),
"select * where Col1 is not null"))
`

---

## 📂 Módulo: `REGISTROS - Movimientos` 

### 1. Dimensiones y UI
- **Grilla Total:** 215 filas x 9 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **0 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`FECHA | INGRESO | EGRESO | DETALLE | MEDIO | UNIDAD DE NEGOCIO | MONEDA | TIPO CAMBIO DÓLAR | OBSERVACIÓN`

### 3. Motor de Cálculo (Fórmulas Residente)
Se detectó alta densidad analítica (214 cálculos únicos subyacentes). Principales lógicas operativas detectadas:

- `=IF(A2="", "", IFERROR(VLOOKUP(TEXT(A2, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A3="", "", IFERROR(VLOOKUP(TEXT(A3, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A4="", "", IFERROR(VLOOKUP(TEXT(A4, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A5="", "", IFERROR(VLOOKUP(TEXT(A5, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A6="", "", IFERROR(VLOOKUP(TEXT(A6, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A7="", "", IFERROR(VLOOKUP(TEXT(A7, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A8="", "", IFERROR(VLOOKUP(TEXT(A8, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- `=IF(A9="", "", IFERROR(VLOOKUP(TEXT(A9, "yyyy-mm-dd"), 'ANUAL - REAL'!$CY$3:$CZ, 2, TRUE), 1))`
- *[Y 206 derivaciones lógicas adicionales...]*

---

## 📂 Módulo: `GLOSARIO KPIS` 

### 1. Dimensiones y UI
- **Grilla Total:** 22 filas x 7 columnas.
- **Estabilidad Visual:** 2 filas y 2 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **0 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`GLOSARIO DE INDICADORES`

### 3. Motor de Cálculo (Fórmulas Residente)
*Hoja de almacenamiento crudo (Base de Datos). No posee inteligencia de cálculo en sus celdas.*

---

## 📂 Módulo: `EXP_PREPAGA` *(Hoja Oculta)*

### 1. Dimensiones y UI
- **Grilla Total:** 3 filas x 65 columnas.
- **Estabilidad Visual:** 0 filas y 0 columnas congeladas.
- **Inteligencia Visual:** Tiene asignadas **0 reglas** de formato condicional activo.

### 2. Estructura de Columnas (Headers Principales)
El dominio de datos principal opera sobre las siguientes columnas clave:
`REGISTROS MPP | ANUAL - PRES | INGRESOS Y RECURSOS MPP | ANUAL - PRES | COSTO DE VENTAS MPP | ANUAL - PRES | GASTOS MPP | ANUAL - PRES | CARGA FISCAL MPP`

### 3. Motor de Cálculo (Fórmulas Residente)
Cálculos directos y subyacentes:

- `=QUERY({
   QUERY('REGISTROS - Movimientos'!A:I, "SELECT A, B, C, D, E, F, G, H WHERE F = 'UEN-Medicina Prepaga' AND NOT LOWER(F) CONTAINS 'sin movim'", 1);
   QUERY('REGISTROS - Movimientos'!A:I, "SELECT A, B, C/3, D, E, 'Gasto Prorrateado', G, H WHERE F = 'UEN-Estructura Compartida' AND NOT LOWER(F) CONTAINS 'sin movim' LABEL C/3 '', 'Gasto Prorrateado' ''", 0);
   QUERY('REGISTROS - Movimientos'!A:I, "SELECT A, B, C/2, D, E, 'Gasto Mix MPP', G, H WHERE F = 'UEN-MPP + Pat' AND NOT LOWER(F) CONTAINS 'sin movim' LABEL C/2 '', 'Gasto Mix MPP' ''", 0)
}, "SELECT * WHERE Col1 IS NOT NULL ORDER BY Col1 ASC", 1)`
- `=FILTER(HSTACK('ANUAL - PRES.'!R4:R, 'ANUAL - PRES.'!S4:AD), ('ANUAL - PRES.'!R4:R <> "") * (IFERROR(VLOOKUP('ANUAL - PRES.'!R4:R, 'Plan de Cuentas'!B:C, 2, FALSE), "")="UEN-Medicina Prepaga") > 0)`
- `=FILTER(HSTACK('ANUAL - PRES.'!AG4:AG, 'ANUAL - PRES.'!AH4:AS / IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-Estructura Compartida", 3, IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-MPP + Pat", 2, 1))), ('ANUAL - PRES.'!AG4:AG <> "") * ((IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-Medicina Prepaga") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-Estructura Compartida") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AG4:AG, 'Plan de Cuentas'!F:G, 2, FALSE), "")="UEN-MPP + Pat")) > 0)`
- `=FILTER(HSTACK('ANUAL - PRES.'!AV4:AV, 'ANUAL - PRES.'!AW4:BH / IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-Estructura Compartida", 3, IF(IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-MPP + Pat", 2, 1))), ('ANUAL - PRES.'!AV4:AV <> "") * ((IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-Medicina Prepaga") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-Estructura Compartida") + (IFERROR(VLOOKUP('ANUAL - PRES.'!AV4:AV, 'Plan de Cuentas'!J:K, 2, FALSE), "")="UEN-MPP + Pat")) > 0)`
- `=FILTER(HSTACK('ANUAL - PRES.'!BK4:BK, 'ANUAL - PRES.'!BL4:BW / IF(IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-Estructura Compartida", 3, IF(IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-MPP + Pat", 2, 1))), ('ANUAL - PRES.'!BK4:BK <> "") * ((IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-Medicina Prepaga") + (IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-Estructura Compartida") + (IFERROR(VLOOKUP('ANUAL - PRES.'!BK4:BK, 'Plan de Cuentas'!N:O, 2, FALSE), "")="UEN-MPP + Pat")) > 0)`

---

> **Directriz para NotebookLM:** 
> - Si recibes consultas sobre el *Panel de Control*, busca dependencias en las fórmulas `INDEX`, `MATCH` o `SUMIFS` registradas arriba.
> - Cualquier métrica de "Flujo de Fondos", cotejar las dimensiones declaradas en las hojas correspondientes. Todo desarrollo de código de Apps Script **debe** obedecer los dominios aquí listados.