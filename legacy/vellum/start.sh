#!/usr/bin/env bash
# Vellum — arranque simplificado (Linux / macOS)
set -e
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "→ Instalando dependencias…"
  npm install
fi

echo "→ Compilando la interfaz…"
npm run build

echo "→ Arrancando Vellum (Electron)…"
echo "   (Ctrl+C para salir)"
exec npm run desktop