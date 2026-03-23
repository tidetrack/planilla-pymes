#!/bin/bash
# Script puente para sincronizar Antigravity con Apps Script

echo "================================================="
echo "   Tidetrack Planilla Pymes - Sync Bridge        "
echo "================================================="

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de Node..."
    npm install
fi

# Verificar si el usuario está logueado en clasp
if ! npx clasp login --status &> /dev/null; then
    echo "🔑 No estás autenticado en clasp. Por favor, inicia sesión:"
    npx clasp login
fi

echo "🚀 Iniciando visor de cambios (Watcher) con Apps Script..."
echo "Cualquier archivo modificado en la carpeta /src será sincronizado automáticamente."
echo "Para detener la sincronización presiona Ctrl+C."
echo "-------------------------------------------------"

npm run sync
