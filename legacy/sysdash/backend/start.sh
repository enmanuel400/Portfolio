#!/usr/bin/env bash
# Sysdash — arranque simplificado para Linux / macOS
set -e
cd "$(dirname "$0")"

PORT="${PORT:-8000}"
URL="http://127.0.0.1:$PORT"

if [ ! -d "venv" ]; then
  echo "→ No existe el entorno virtual. Creándolo con python3..."
  python3 -m venv venv
  ./venv/bin/pip install --upgrade pip >/dev/null
  ./venv/bin/pip install -r requirements.txt
fi

echo "→ Arrancando Sysdash en  $URL"
echo "   (Ctrl+C para detener)"
./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port "$PORT" &
SERVER_PID=$!

# Abrir el navegador cuando el servidor esté arriba
(
  for i in $(seq 1 20); do
    if curl -s -o /dev/null "$URL/api/health"; then
      if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1 || true
      elif command -v open >/dev/null 2>&1; then open "$URL"
      fi
      break
    fi
    sleep 0.5
  done
) &

trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
wait "$SERVER_PID"