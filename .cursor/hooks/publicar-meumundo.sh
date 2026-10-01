#!/bin/bash
# Publica o que ficou pendente no repositório daatmidia/meumundo ao fim de cada tarefa.
cat >/dev/null || true

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || { echo '{}'; exit 0; }

LOCK="$ROOT/.git/auto-sync.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  echo '{}'
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo '{}'
  exit 0
fi

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
if [ "$branch" != "main" ]; then
  echo '{}'
  exit 0
fi

git add -A
while IFS= read -r f; do
  [ -z "$f" ] && continue
  case "$f" in
    .env|.env.*|*.pem|*credentials*|*secret*)
      git reset -q -- "$f" 2>/dev/null || true
      ;;
  esac
done < <(git diff --cached --name-only)

if ! git diff --cached --quiet; then
  git commit -m "$(cat <<'EOF'
Atualiza o Meu Mundo.

EOF
)" || true
fi

git push origin main >&2 || true
echo '{}'
exit 0
