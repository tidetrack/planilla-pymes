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
    BLOQUES: {
      "INGRESOS": { nombre: "Ingresos y recursos", colStart: 2, colCols: 4 }, // B:E
      "COSTOS": { nombre: "Costo de ventas", colStart: 7, colCols: 4 }, // G:J
      "GASTOS": { nombre: "Gastos", colStart: 12, colCols: 4 }, // L:O
      "FISCAL": { nombre: "Carga Fiscal", colStart: 17, colCols: 4 }, // Q:T
      "RESULTADOS": { nombre: "Resultados", colStart: 24, colCols: 2 }, // X:Y
      "MEDIOS_PAGO": { nombre: "Medios de Pago", colStart: 27, colCols: 4 } // AA:AD
    },
    RANGOS_GLOBALES: {
      MOVIMIENTOS: "V",
      PROYECTOS: "AF",
      PROYECTOS_UEN: "AG",
      UEN_MASTER: "AI"
    }
  },
  RANGOS: {
    CARGAS_MODULO: "C4:H23"
  }
};
