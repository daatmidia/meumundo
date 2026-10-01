#!/bin/bash
# Roda quando o agente termina. Publica o site e não pede nova rodada.
cat >/dev/null
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
"$ROOT/tools/publicar-site.sh" >/dev/null 2>&1 || true
printf '%s\n' '{}'
exit 0
