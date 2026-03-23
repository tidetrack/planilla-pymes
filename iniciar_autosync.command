#!/bin/bash
# Script de acceso rápido para arrancar Clasp Watch (Auto-Sync)
echo "🚀 Iniciando Auto-Sync de Tidetrack con Google Apps Script..."

# Navegar al directorio del proyecto (resuelto automáticamente)
cd "$(dirname "$0")" || { echo "❌ Error: No se pudo navegar al directorio del proyecto."; exit 1; }

echo "Ubicación: $(pwd)"
echo "App: clasp push --watch"
echo "──────────────────────────────────────────────"
echo "👀 Observando cambios... (Cierra esta ventana para detener)"

# Ejecutar el comando sync (clasp push --watch) usando npm
npm run sync
 