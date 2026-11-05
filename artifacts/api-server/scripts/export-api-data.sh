#!/usr/bin/env bash
# Schreibt die schreibgeschuetzten API-Antworten als JSON ins Frontend,
# damit alle Seiten auch ohne erreichbaren API-Server vollstaendig sind.
# Aufruf (aus artifacts/api-server): bash scripts/export-api-data.sh
set -euo pipefail

OUT="../../artifacts/green-balance/public/api-data"
mkdir -p "$OUT"
pnpm run build >/dev/null 2>&1
# Der Server verlangt eine DATABASE_URL beim Start; fuer die schreibgeschuetzten
# Endpunkte wird keine Verbindung gebraucht, deshalb ein Platzhalter.
DATABASE_URL="${DATABASE_URL:-postgres://export:export@127.0.0.1:5432/export}" \
OPENAI_API_KEY="${OPENAI_API_KEY:-sk-export-placeholder}" \
  PORT=3999 node dist/index.mjs >/tmp/api-export.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
for i in $(seq 1 30); do
  sleep 0.5
  curl -sf -o /dev/null "http://127.0.0.1:3999/api/healthz" && break
done

fetch() { # $1=dateiname $2=pfad
  if curl -sf -m 10 "http://127.0.0.1:3999$2" -o "$OUT/$1.json"; then
    echo "  $1: ok"
  else
    echo "[]" > "$OUT/$1.json"
    echo "  $1: nicht verfuegbar, leeres Array"
  fi
}

fetch conflicts /api/conflicts
fetch states /api/states
fetch dashboard-summary /api/dashboard/summary
fetch dashboard-co2 /api/dashboard/co2
fetch dashboard-energy /api/dashboard/energy
fetch dashboard-jobs /api/dashboard/jobs
fetch polls /api/polls
