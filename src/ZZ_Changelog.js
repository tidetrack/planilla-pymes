/**
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
