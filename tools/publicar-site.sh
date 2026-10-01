#!/bin/bash
# Publica alterações no site atual e no repositório meumundo.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 0

if [ ! -d .git ]; then
  exit 0
fi

LOCK=".git/jcb-auto-publish.lock"
if [ -f "$LOCK" ]; then
  exit 0
fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  exit 0
fi

git add -A -- . ':!*.env' ':!credentials.json' ':!.env*' || true
git reset -q -- .env .env.* credentials.json 2>/dev/null || true

if git diff --cached --quiet; then
  exit 0
fi

export JCB_PUBLISHING=1
git commit -m "$(cat <<'EOF'
Atualiza o site automaticamente.

EOF
)" || exit 0

if ! git remote get-url meumundo >/dev/null 2>&1; then
  git remote add meumundo https://github.com/daatmidia/meumundo.git
fi

git push origin HEAD:main || true
git push meumundo HEAD:projeto-jcb || true
