#!/bin/bash
# Publica alterações no repositório do site no ar (GitHub Pages).
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

if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  git add -A -- . ':!*.env' ':!credentials.json' ':!.env*' || true
  git reset -q -- .env .env.* credentials.json 2>/dev/null || true

  if ! git diff --cached --quiet; then
    export JCB_PUBLISHING=1
    git commit -m "$(cat <<'EOF'
Atualiza o site automaticamente.

EOF
)" || true
  fi
fi

if ! git remote get-url react >/dev/null 2>&1; then
  git remote add react https://github.com/daatmidia/react.git
fi
if ! git remote get-url meumundo >/dev/null 2>&1; then
  git remote add meumundo https://github.com/daatmidia/meumundo.git
fi

# Site publicado: https://daatmidia.github.io/react/
GH="$ROOT/tools/gh"
if [ -x "$GH" ]; then
  git -c credential.helper= -c "credential.helper=!$GH auth git-credential" push react HEAD:main || true
  git -c credential.helper= -c "credential.helper=!$GH auth git-credential" push origin HEAD:main || true
  git -c credential.helper= -c "credential.helper=!$GH auth git-credential" push meumundo HEAD:projeto-jcb || true
else
  git push react HEAD:main || true
  git push origin HEAD:main || true
  git push meumundo HEAD:projeto-jcb || true
fi
