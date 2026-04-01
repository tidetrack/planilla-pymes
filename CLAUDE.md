# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

<!-- TideTrack Pymes (App Web) -->
> Este archivo es la memoria permanente y el contrato de comportamiento para Claude Code en este repositorio.
> Leerlo completo antes de ejecutar cualquier tarea. Su contenido tiene prioridad sobre cualquier suposición.

---

## 1. Identidad del Proyecto

**TideTrack Pymes** es una aplicación web de gestión financiera para pequeñas y medianas empresas argentinas.
Su origen es una planilla Google Sheets altamente estructurada (v1.6.0), con backend en Google Apps Script,
que este repositorio busca reemplazar progresivamente con una aplicación web moderna.

**Objetivo de este repo**: Migrar la lógica de negocio del AppScript a una API REST en Next.js,
manteniendo Google Sheets como capa de persistencia en Fase 1, y migrando a PostgreSQL en Fase 2.

**Repositorio espejo (fuente de verdad legada)**: `planilla-pymes` en GitHub (AppScript).
El JSON de arquitectura se genera con `ScannerArquitectura.js → exportarArquitecturaTotal()`.

---

## 2. Comandos del Repositorio Legacy (AppScript)

```bash
npm run sync   # clasp push -w — compila y sube en modo watch a Google Apps Script
npm run pull   # clasp pull — descarga el código desde la nube al directorio /src/
npm run login  # clasp login — autenticación inicial con cuenta Google
```

> No hay build step ni test runner convencional. El testing se realiza mediante `QA_GeneradorMock.js`
> directamente en la planilla (ver sección 5 sobre estructura legacy).

---

## 3. Stack Tecnológico

```
Framework:    Next.js 16 (App Router) con TypeScript estricto
Estilos:      TailwindCSS v4 + shadcn/ui
Base de datos: Supabase (PostgreSQL) — Project ID: fvmqbonjyfickldfqmwq
Auth:         NextAuth.js (pendiente)
Testing:      Vitest + Testing Library (pendiente)
Linting:      ESLint
```

> Google Sheets ya NO es la base de datos. Supabase es el motor desde el día 1.
> Los scripts legacy de clasp siguen disponibles como `npm run legacy:*` para consulta.

**Design System — Colores base extraídos de la planilla original:**
```
--color-primary:    #1a2f40  (fondo oscuro, headers principales)
--color-header-bg:  #e0e0e0  (fondo encabezados de tabla)
--color-text-dark:  #000000
--color-text-light: #ffffff
```

---

## 3. Modelo de Datos (Fuente de Verdad)

### 3.1 Hoja Troncal: Plan de Cuentas
Es el catálogo maestro. NUNCA se modifica su estructura de columnas sin actualizar `00_Config.js` en el repo legacy Y los tipos en `src/types/financial.ts`.

| Bloque | Columnas Sheets | Campos |
|--------|----------------|--------|
| Ingresos y Recursos | B-D | nombre, proyecto, uen |
| Costos de Venta | F-H | nombre, proyecto, uen |
| Gastos | J-L | nombre, proyecto, uen |
| Carga Fiscal | N-P | nombre, proyecto, uen |
| Resultados | T-U | nombre, proyecto |
| Medios de Pago | W-Y | nombre, moneda (ARS/USD/CtaCte), proyecto |
| Proyectos | AA-AB | nombre, uen_asociada |
| UEN Master | AD | nombre |
| Clientes | AF-AH | nombre, cuit, proyecto |
| Proveedores | AJ-AL | nombre, cuit, proyecto |

### 3.2 Tablas de Hechos (BDs de transacciones)

**Registros - Movimientos** (`B4:N`, datos desde fila 4, orden Z→A por fecha):
```
B: fecha | C: monto | D: tipo (Ingreso/Egreso)
E: cuenta | F: tipo_cuenta (auto-inferido) | G: proyecto (auto) | H: uen (auto)
I: medio | J: moneda (auto desde medio) | K: nota
L: cotiz_usd_venta | M: cotiz_usd_compra | N: id_compromiso (opcional)
```

**Registros - Compromisos** (`B4:R`, datos desde fila 4):
```
B: id (CXC/CXP-YYYYMMDD-NNN) | C: fecha_registro | D: fecha_compromiso
E: monto | F: moneda | G: total_imputado (fórmula) | H: saldo (fórmula)
I: fecha_ultimo_pago (fórmula) | J: estado (fórmula: Pendiente/Parcial/Cancelado)
K: tipo (Por Cobrar/Por Pagar) | L: contraparte | M: cuenta
N: proyecto | O: uen | P: cotiz_venta | Q: cotiz_compra | R: nota
```

**Registros - Presupuesto** (`B6:L`, datos desde fila 6):
```
B: fecha_carga (auto) | C: monto | D: fecha_presupuestada
E: tipo (auto-inferido) | F: cuenta | G: proyecto | H: uen
I: moneda | J: nota | K: cotiz_venta | L: cotiz_compra
```

---

## 4. Lógica de Negocio Crítica (NO TOCAR SIN ENTENDER)

### 4.1 Triangulación Relacional O(1)
La regla central del sistema: **toda transacción se auto-clasifica** a partir de la Cuenta elegida.

```
Cuenta → mapCuentaProyecto → Proyecto → mapProyectoUEN → UEN
Cuenta → mapCuentaTipo → TipoDeCuenta (Ingresos/Costos/Gastos/etc)
Medio  → mapMedioMoneda → Moneda (ARS/USD/CtaCte)
```

En la app web, esta lógica vive en `src/lib/triangulation.ts`.
Los mapas se construyen UNA VEZ por request cargando el Plan de Cuentas completo.
**Nunca hardcodear proyectos o UEN en el código. Siempre inferir desde el catálogo.**

### 4.2 Motor FX (Tipo de Cambio Bimonetario)
Prioridad de resolución de cotización USD:
1. Si fecha = HOY → API live `dolarapi.com/v1/dolares/oficial`
2. Si fecha histórica → buscar en caché (tabla `Tipo de Cambio` o DB)
3. Si no está en caché → `api.argentinadatos.com/v1/cotizaciones/dolares/oficial` (histórico)
4. Fallback → día hábil anterior más cercano disponible
5. Último recurso → valor 1 (NUNCA silencioso, siempre loguear)

En la app web, esta lógica vive en `src/lib/fx.ts`.

### 4.3 IDs Correlativos Anti-Colisión (Compromisos)
Formato: `CXC-YYYYMMDD-NNN` (Por Cobrar) / `CXP-YYYYMMDD-NNN` (Por Pagar)
La generación del siguiente número debe considerar:
- Registros ya existentes en BD con el mismo prefijo fecha
- Registros del lote actual aún no escritos (memoria local del batch)
Nunca generar IDs sin verificar ambas fuentes. Ver `_generarIdDevengado()` en legacy.

### 4.4 Regla de Prefijos en Medios de Pago
Los medios de pago tienen prefijo obligatorio de moneda:
- `ARS-NombreMedio`
- `USD-NombreMedio`
- `CtaCte-NombreMedio`
Cualquier creación o edición de Medio de Pago debe validar y aplicar este prefijo.

---

## 5. Estructura de Carpetas del Repo

> **Estado actual**: este repositorio ES el código AppScript legacy (`/src/` contiene los `.js` de Apps Script).
> La estructura Next.js documentada a continuación es la **arquitectura objetivo** de la migración, aún no creada.

### Estado actual (AppScript legacy — este repo)
```
/
├── CLAUDE.md
├── src/                              ← Código Google Apps Script
│   ├── 00_Config.js                  ← Single Source of Truth de rangos y hojas
│   ├── 01_Backend_PlanCuentas.js
│   ├── Carga_Registros.js
│   ├── 03_Backend_Devengado.js
│   ├── 04_Backend_Presupuesto.js
│   ├── Tipo_Cambio_API.js
│   ├── TRIGGER_onEdit.js
│   ├── QA_GeneradorMock.js
│   ├── devtools/ScannerArquitectura.js
│   ├── ZZ_Changelog.js
│   └── appsscript.json
├── docs/
│   ├── permanente/                   ← MODELO_DATOS.md, CONTEXTO_LLM.md, HISTORIAL_DESARROLLO.md
│   └── wiki/                         ← ARQUITECTURA_SISTEMA.md, ARQUITECTURA_DETALLADA.md
└── .agent/rules/                     ← Contratos de gobernanza del proyecto
```

### Arquitectura objetivo (Next.js — a construir)
```
/
├── CLAUDE.md
├── legacy/                           ← AppScript original (solo lectura, referencia)
│   ├── src/
│   └── docs/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── movimientos/route.ts
│   │   │   ├── compromisos/route.ts
│   │   │   ├── presupuesto/route.ts
│   │   │   ├── plan-cuentas/route.ts
│   │   │   └── fx/route.ts
│   │   └── (dashboard)/
│   │       ├── page.tsx
│   │       ├── movimientos/
│   │       ├── compromisos/
│   │       └── presupuesto/
│   ├── lib/
│   │   ├── sheets.ts                 ← Capa Google Sheets (googleapis)
│   │   ├── triangulation.ts          ← Lógica Cuenta→Proyecto→UEN
│   │   ├── fx.ts                     ← Motor tipo de cambio
│   │   └── ids.ts                    ← Generador IDs correlativos
│   ├── types/
│   │   └── financial.ts              ← Tipos TypeScript de todas las entidades
│   └── components/
│       ├── ui/                       ← shadcn/ui base
│       └── financial/                ← Componentes de dominio
├── .env.local                        ← Variables de entorno (NO commitear)
└── docs/
    └── TIDETRACK_ARQUITECTURA_ESTRICTA.json  ← JSON exportado del scanner
```

---

## 6. Variables de Entorno Requeridas

```bash
# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1E9ord020rPwk6qrvbqxLZV4QoA-tEq7M2af6tR5P8Wc
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...

# APIs externas
DOLAR_API_URL=https://dolarapi.com/v1/dolares/oficial
ARGENTINA_DATOS_URL=https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 7. Reglas Irrompibles para Claude Code

### PROHIBIDO
- Hardcodear nombres de hojas. Siempre usar constantes equivalentes a `CONFIG.HOJAS.*`
- Asumir posiciones de columnas sin verificar el Modelo de Datos (Sección 3)
- Crear lógica FX sin seguir el orden de prioridad definido (Sección 4.2)
- Modificar archivos en `/legacy/` — son solo lectura
- Generar IDs de compromisos sin verificar duplicados en BD + lote en memoria
- Silenciar errores de la API de tipo de cambio (siempre loguear el fallback usado)
- Saltear la triangulación relacional y hardcodear Proyecto o UEN en una transacción

### OBLIGATORIO
- Todo cambio en el modelo de datos → actualizar `src/types/financial.ts`
- Todo endpoint nuevo → documentar en este CLAUDE.md (Sección 8)
- Toda función que toque Google Sheets → manejar el caso de `spreadsheetId` no encontrado
- Las fórmulas nativas de Sheets para compromisos (Total Imputado, Saldo, Estado) se replican
  como lógica de cálculo en el backend de la app, NO como fórmulas de Sheets en la nueva BD
- TypeScript estricto en todo el proyecto (`strict: true` en tsconfig)

### CONVENCIONES DE CÓDIGO
```typescript
// Nombres de funciones: camelCase, verbos descriptivos
async function procesarLoteMovimientos(payload: MovimientoInput[]): Promise<MovimientoRecord[]>
async function inferirDimensionesDesde(cuenta: string): Promise<DimensionesFinancieras>
async function resolverCotizacionUSD(fecha: Date): Promise<CotizacionFX>

// Tipos de entidades: PascalCase con sufijo según capa
type MovimientoInput = { ... }    // Lo que entra desde el formulario
type MovimientoRecord = { ... }   // Lo que se persiste en BD
type MovimientoView = { ... }     // Lo que se devuelve al frontend
```

---

## 8. Endpoints API (Registro de lo implementado)

> Documentar aquí cada endpoint a medida que se implementa.

| Método | Ruta | Descripción | Estado |
|--------|------|-------------|--------|
| — | — | Pendiente de implementación inicial | — |

---

## 9. Roadmap de Migración (Sprints heredados)

El roadmap original tiene 7 sprints, de los cuales en la planilla están:
- ✅ Sprint 1: UEN transversales
- ⏸️ Sprint 2: Motor de Liquidez (diferido — siguiente prioridad en la app)
- ✅ Sprint 3: CxP/CxC
- ✅ Sprint 4: Cuentas Corrientes (cubierto por Sprint 3)
- 🔄 Sprint 5: Presupuesto (BD lista, vista Presupuesto pendiente)
- ⬜ Sprint 6: Activos No Corrientes
- ⬜ Sprint 7: Weekly Dashboard

**Para la app web, el orden de implementación es:**
1. Capa de acceso a Google Sheets (`src/lib/sheets.ts`)
2. Triangulación relacional (`src/lib/triangulation.ts`)
3. Motor FX (`src/lib/fx.ts`)
4. API endpoint Movimientos (el más crítico, es el core)
5. API endpoint Plan de Cuentas (ABM)
6. API endpoint Compromisos
7. API endpoint Presupuesto
8. Dashboard UI

---

## 10. Contexto de Negocio

TideTrack Pymes opera en contexto argentino con las siguientes particularidades:
- **Bimonetarismo real**: ARS y USD coexisten en todas las transacciones
- **Cotización dinámica**: el tipo de cambio se registra al momento de cada transacción (retroactividad estricta)
- **CUIT/CUIL**: campo obligatorio para Clientes y Proveedores (identificación fiscal argentina)
- **Unidades de Negocio (UEN)**: permiten análisis P&L segmentado — son la dimensión analítica más importante
- **Proyectos**: subdivisión dentro de cada UEN, vinculan las cuentas con la realidad operativa de la empresa
## 11. Contexto de Producto y Filosofía de Trabajo

TideTrack nació como una planilla y su destino siempre fue una aplicación web.
Este repositorio es la materialización de ese objetivo.

El desarrollo es asistido por Claude Code como agente principal de ejecución.
Las sesiones deben ser focalizadas: una tarea concreta por sesión, confirmación
antes de ejecutar cambios estructurales, y actualización del CLAUDE.md ante
cualquier decisión arquitectónica relevante.

El usuario no tiene formación técnica formal en programación. Las explicaciones
deben ser claras cuando se introducen conceptos nuevos. El código debe estar
comentado en español donde el dominio financiero lo requiera.