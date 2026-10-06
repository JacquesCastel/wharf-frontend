#!/usr/bin/env bash
set -euo pipefail
commit=${1:?Provide the exact deployment commit}
[[ "$commit" =~ ^[0-9a-f]{40}$ ]] || exit 1
checkout=/home/wharf/wharf-frontend
release=/home/wharf/releases/wharf-frontend-$commit
backup=/home/wharf/backups/deployment-$commit
mkdir -p "$backup"; chmod 700 "$backup"
cd "$checkout"
git fetch origin main
git cat-file -e "$commit^{commit}"
test ! -e "$release"
mkdir -p "$release"
git archive "$commit" | tar -x -C "$release"
for name in .env.local .env.production; do
  if [ -f "$checkout/$name" ]; then cp "$checkout/$name" "$release/$name"; chmod 600 "$release/$name"; fi
done
cd "$release"
npm ci
NODE_OPTIONS=--max-old-space-size=1536 npm run build
mkdir -p .next/standalone/public .next/standalone/.next/static
cp -a public/. .next/standalone/public/
cp -a .next/static/. .next/standalone/.next/static/
for name in .env.local .env.production; do
  if [ -f "$release/$name" ]; then cp "$release/$name" "$release/.next/standalone/$name"; chmod 600 "$release/.next/standalone/$name"; fi
done
cd "$checkout"
git status --porcelain > "$backup/source-status.txt"
# Swap only build artifacts. User files and Git checkout remain untouched.
mv .next "$backup/next-before"
if ! mv "$release/.next" .next; then mv "$backup/next-before" .next; exit 1; fi
pm2 restart wharf-frontend
healthy=0
for attempt in {1..20}; do
  if curl --max-time 5 -fsS http://127.0.0.1:3000/ >/dev/null; then healthy=1; break; fi
  sleep 1
done
if [ "$healthy" != 1 ]; then
  mv .next "$backup/next-failed"
  mv "$backup/next-before" .next
  pm2 restart wharf-frontend
  exit 1
fi
git status --porcelain > "$backup/source-status-after.txt"
cmp "$backup/source-status.txt" "$backup/source-status-after.txt"
printf '%s\n' "$commit" > "$backup/commit-deployed.txt"
printf 'DEPLOYMENT_VERIFIED %s\n' "$commit"
