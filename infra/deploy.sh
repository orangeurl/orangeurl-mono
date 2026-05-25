#!/usr/bin/env bash
# Deploy / update orangeurl on a single EC2 host.
# Usage: ./deploy.sh <HOST> [USER]
#   ./deploy.sh orangeurl.live
#   ./deploy.sh 1.2.3.4 ubuntu

set -euo pipefail

HOST="${1:?Usage: ./deploy.sh <HOST> [USER]}"
USER="${2:-ubuntu}"
REMOTE_DIR="/opt/orangeurl"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Syncing tree to $USER@$HOST:$REMOTE_DIR"
rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.output' \
  --exclude '.wxt' \
  --exclude '/allto' \
  --exclude '/extension' \
  --exclude '/mcp' \
  --exclude '/docs' \
  --exclude 'backend/postgres-data' \
  --exclude 'backend/data' \
  --exclude '*.env' \
  --exclude 'infra/.env' \
  "$ROOT/" "$USER@$HOST:$REMOTE_DIR/"

echo "==> Bringing stack up"
ssh "$USER@$HOST" "cd $REMOTE_DIR/infra && docker compose up -d --build"

echo "==> Pruning dangling images"
ssh "$USER@$HOST" "docker image prune -f"

echo "==> Status"
ssh "$USER@$HOST" "cd $REMOTE_DIR/infra && docker compose ps"
echo "OK. https://orangeurl.live  https://app.orangeurl.live  https://api.orangeurl.live"
