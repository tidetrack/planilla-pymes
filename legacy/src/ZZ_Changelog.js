/**
 * [2026-03-30] v1.6.0 - Sprint 7 (Bimonetarismo en Compromisos y QA Automation):
 * - Refactor profundo en 03_Backend_Devengado.js para imputación de pagos bimonetarios usando fórmulas `FILTER` dinámicas.
 * - Nuevo script `QA_GeneradorMock.js` expuesto en UI para simular lotes completos E2E superando Data Validation nativa.
 * - Modificación de la UI ABM de Plan de Cuentas: prefijos dinámicos (ARS-, USD-, CtaCte-) para Medios de Pago.
 * - Fix crítico en generador de IDs devengados, previniendo colisión en registros batch.
 *
 * ---
 * [2026-03-30] v1.5.0 - Sprint 6 (Refactor Tipo de Cuenta & Resumen Interanual):
 * - Nueva dimension "Tipo de cuenta" inyectada en Registros - Movimientos (Columna F).
 * - Carga_Registros modificado para inferencia O(1) de Bloques de Config hacia Tipo de Cuenta (Ingresos, Gastos, etc).
 * - 03_Backend_Devengado.js adaptado apuntando SUMIF a columna N (por desplazamiento de ID_CXC).
 * - 01_Backend_PlanCuentas.js: DevTools Scanner expuesto en UI global (onOpen).
 * - Escaneo de arquitectura actualizado detectando "Resumen Interanual" validado.
 *
 * ---
 * [2026-03-27] v1.4.0 - Sprint 5 (Módulo Presupuesto + Reestructuración Cargas):
 * - Nueva BD "Registros - Presupuesto" (cols B-K, con FX live automático).
 * - 04_Backend_Presupuesto.js: infiere Tipo/Proyecto/UEN, escribe en BD.
 * - Hoja Cargas reestructurada en 3 bloques: A=Movimientos (C6:I25),
 *   B=Compromisos (C31:I50), C=Presupuesto (C56:I75).
 * - TRIGGER_onEdit.js unificado: col C trigger → col G auto-fecha en los 3 bloques.
 * - 00_Config.js: CARGAS_MOVIMIENTOS, CARGAS_COMPROMISOS, CARGAS_PRESUPUESTO + hoja PRESUPUESTO.
 *
 * ---
 * [2026-03-25] v1.3.0 - Sprint 3 (Motor CxP/CxC - Registros Compromisos):
 * - Nueva hoja "Registros - Compromisos" con 16 columnas auto-gestionadas.
 * - 03_Backend_Devengado.js: ID correlativo, FX live, inferencia Proyecto/UEN, fórmulas nativas.
 * - Módulo B en Cargas (K4:Q23) para compromisos devengados.
 * - Carga_Registros extendido a C4:I23 (+col I ID_CXC para imputación).
 * - Nuevo ítem de menú: Procesar Lote Devengado (CxP/CxC).
 *
 * ---
 * [2026-03-25] v1.2.0 - Sprint 1b (Clientes, Proveedores y Fix FX):
 * - Nuevos bloques CLIENTES (AF:AH) y PROVEEDORES (AJ:AL) en 00_Config.js y Plan de Cuentas.
 * - CRUD extendido en 01_Backend_PlanCuentas.js para los nuevos tipos (Nombre, CUIT/CUIL, Proyecto).
 * - UI actualizada: campo CUIT obligatorio en el ABM para Clientes y Proveedores.
 * - Fix crítico en Carga_Registros.js: fallback FX inteligente (API → día anterior → default 1).
 * - Nueva función fetchCotizacionParaFecha() en Tipo_Cambio_API.js con persistencia automática en hoja.
 *
 * ---
 * [2026-03-24] v1.1.0 - Sprint 1 (Módulo de Cargas interactivo):
 * - Triangulación relacional automatizada de Proyectos y UEN (Carga_Registros.js).
 * - Inyección de caché histórico de Dólar Compra/Venta usando API Argentina (Tipo_Cambio_API.js).
 * - Actualización del Plan de Cuentas (00_Config.js).
 *
 * ---
 * [2026-03-23] v0.1.0-Iteracion01 - Fix de Nomenclatura en Migración UENs:
 * - Ajuste de nombres de hojas canónicas ("Plan de Cuentas" y "Registros") en el script migracion-UENS.js.
 *
 * ---
 * [2026-03-23] v0.1.0 - Inicialización del sistema de control de versiones:
 * - Se estableció el archivo ZZ_Changelog.js para rastreo directo en el código de Google Apps Script.
 * - Se configuraron las reglas de vinculación a Apps Script y las directivas de changelog obligatorio.
 *
 * ---
 */
