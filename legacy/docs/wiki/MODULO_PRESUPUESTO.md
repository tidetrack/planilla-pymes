# Módulo: Presupuesto (y Resumen Interanual)

Este documento detalla el funcionamiento interno y la arquitectura de la hoja **Presupuesto** (y su gemela paramétrica **Resumen Interanual**). Ambas hojas comparten una base tecnológica altamente dinámica mediante el uso de fórmulas matriciales nativas de Google Sheets, sin depender de eventos de backend (Apps Script) para renderizar su interfaz visual.

## 1. El Tablero de Control Paramétrico (Fila 2)
El usuario interactúa exclusivamente con los selectores de datos ubicados en la parte superior. Estos funcionan como las variables de estado global del reporte:
- **G2 y H2 (Mes y Año)**: Establecen la fecha pivote.
- **L2 y L3 (UEN y Proyecto)**: Alimentan el motor de filtrado permitiendo la lectura segmentada del flujo financiero. Las celdas admiten selectores específicos o el default `"Todos"`.
- **Q2 (Moneda)**: Fija la moneda base de visualización (`ARS` o `USD`). Todos los cálculos convergerán hacia esta moneda.

## 2. Línea de Tiempo Deslizante (Fila 8)
La tira de meses (cabeceras en el rango `F8:Q8`) no está escrita a mano. Se materializa gracias a un `LET()` combinado con `ARRAYFORMULA`:
```excel
=LET(
  mes_ref, MATCH(G2, {"ENERO";...;"DICIEMBRE"}, 0),
  fecha_base, DATE(H2, mes_ref, 1),
  inicio_periodo, EDATE(fecha_base, -4),
  ARRAYFORMULA(UPPER(TEXT(EDATE(inicio_periodo, COLUMN(A1:L1)-1), "mmm - yy")))
)
```
La hoja construye dinámicamente un panorama temporal (una ventana móvil de 12 meses) basándose restando offsets (`-4`) al mes de referencia entregado en G2/H2.

## 3. El Motor de Extracción Local (Columna S en adelante)
Para evitar la ralentización típica de Sheets al procesar miles de cruces por celda en vivo sobre la base de datos externa (`Registros - Presupuesto`), la hoja utiliza una pre-extracción:
```excel
=QUERY('Registros - Presupuesto'!B5:L, "SELECT * WHERE B IS NOT NULL AND H = '" & L2 & "'...")
```
Oculta en la celda `S6`, esta cláusula de `QUERY` vuelca localmente (hacia las columnas `T`, `U`, `V`, etc.) exclusivamente los registros en crudo que coinciden con los filtros macro (UEN y Proyecto) acelerando el renderizado de la matriz principal.

## 4. Matriz de Combinación y Conversión Multidivisa Recursiva
El cuerpo central de la planilla (filas 9 en adelante, columnas F a Q) aloja la sumatoria de valores. Cada intersección funciona bajo el patrón:
`Cuenta Analizada` ✖️ `Mes Específico` ✖️ `Ajuste Multimoneda`

El código de celda evalúa condicionalmente (`IF`) la intención de visualización (ej. si `$Q$2="ARS"`) e invoca `SUM(FILTER(...))` para capturar aquellas sub-filas de la extracción `QUERY` que emparejan temporal y conceptualmente. 

> **Dato Arquitectónico**: Con este diseño, la hoja provee _Retroactividad Financiera Estricta_. Si un registro ingresó en USD pero el tablero está seteado en ARS, la sumatoria efectúa la conversión matemática (`* $AB$6:$AB`) usando específicamente el tipo de cambio del momento en el que ese movimiento fue registrado, sin importar las tasas actuales.
