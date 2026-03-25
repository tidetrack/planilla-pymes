/**
 * 00_Config.js
 * Single Source of Truth para Tidetrack Pymes.
 * Define constantes globales de rangos y hojas para evitar "rangos mágicos".
 */

const CONFIG = {
  HOJAS: {
    PLAN_CUENTAS: "Plan de Cuentas",
    CARGAS: "Cargas",
    REGISTROS: "Registros",
    TIPO_CAMBIO: "Tipo de Cambio"
  },
  PLAN_CUENTAS: {
    INICIO_FILA_DATOS: 3,
    RANGOS_GLOBALES: {
      MOVIMIENTOS: "V",
      PROYECTOS: "AA",   // Antes AF
      UEN: "AB",         // Antes AG
      PROYECTOS_UEN: 1,   // Índice relativo de UEN respecto a Proyectos (Col AA a AB = 1 col de salto)
      UEN_MASTER: "AI"
    },
    BLOQUES: {
      INGRESOS:    { colStart: 2,  colCols: 3, label: "Ingresos" },       // B a D
      COSTOS:      { colStart: 6,  colCols: 3, label: "Costos de Venta" },// F a H
      GASTOS:      { colStart: 10, colCols: 3, label: "Gastos" },         // J a L
      FISCAL:      { colStart: 14, colCols: 3, label: "Carga Fiscal" },   // N a P
      RESULTADOS:  { colStart: 20, colCols: 2, label: "Resultados" },     // T a U (T=Nombre, U=Proyecto)
      MEDIOS_PAGO: { colStart: 23, colCols: 3, label: "Medio de Pago" },  // W a Y (W=Medio, X=Moneda, Y=Proyecto)
      PROYECTOS:   { colStart: 27, colCols: 2, label: "Proyectos" },      // AA a AB (AA=Nombre, AB=UEN)
      UEN_MASTER:  { colStart: 30, colCols: 1, label: "Sub-Unidades" }    // AD (AD=Nombre)
    }
  },
  RANGOS: {
    CARGAS_MODULO: "C4:H23"
  }
};
