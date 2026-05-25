#!/usr/bin/env bash
#
# rotate-secrets.sh
#
# Rotates the Postgres and Redis passwords used by the docker-compose stack
# in infra/. Generates fresh values, updates infra/.env in place (preserving
# all other keys, comments, and ordering), and restarts the compose stack so
# the new credentials take effect.
#
# Usage:
#   ./scripts/rotate-secrets.sh           # rotate + restart
#   ./scripts/rotate-secrets.sh --no-restart   # rotate only; you restart manually
#   ./scripts/rotate-secrets.sh --dry-run      # show what would change, write nothing
#
# Notes:
#   - Run this on the host where the compose stack lives (the droplet).
#   - A timestamped backup of infra/.env is saved next to it before any edit.
#   - This script does NOT push to git. Secrets must never be committed.

set -euo pipefail

# Resolve paths relative to the repo root, regardless of where the script is
# invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${REPO_ROOT}/infra/.env"
COMPOSE_FILE="${REPO_ROOT}/infra/docker-compose.yml"

DRY_RUN=0
RESTART=1
for arg in "$@"; do
  case "${arg}" in
    --dry-run)    DRY_RUN=1 ;;
    --no-restart) RESTART=0 ;;
    -h|--help)
      sed -n '2,20p' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *)
      echo "Unknown argument: ${arg}" >&2
      exit 2
      ;;
  esac
done

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found. Are you running this on the deploy host?" >&2
  exit 1
fi

# Generate cryptographically random passwords. 32 bytes of base64 yields ~43
# URL-safe characters; we strip characters that complicate shell / env parsing.
gen_secret() {
  openssl rand -base64 32 | tr -d '\n=+/' | cut -c1-40
}

NEW_PG_PASSWORD="$(gen_secret)"
NEW_REDIS_PASSWORD="$(gen_secret)"

echo "Generated new POSTGRES_PASSWORD and REDIS_PASSWORD."

# Replace (or append) a KEY=VALUE pair in an env file, preserving everything else.
# Uses an awk script to avoid sed quoting headaches with special characters.
replace_or_append() {
  local file="$1" key="$2" value="$3"
  if grep -qE "^${key}=" "${file}"; then
    awk -v k="${key}" -v v="${value}" '
      BEGIN { FS=OFS="=" }
      $1 == k { print k "=" v; next }
      { print }
    ' "${file}" > "${file}.tmp"
    mv "${file}.tmp" "${file}"
  else
    printf '%s=%s\n' "${key}" "${value}" >> "${file}"
  fi
}

if [[ "${DRY_RUN}" -eq 1 ]]; then
  echo "[dry-run] Would update ${ENV_FILE}:"
  echo "[dry-run]   POSTGRES_PASSWORD=<new 40-char secret>"
  echo "[dry-run]   REDIS_PASSWORD=<new 40-char secret>"
  echo "[dry-run] Would restart compose stack: ${COMPOSE_FILE}"
  exit 0
fi

# Back up first so an operator can always roll back.
BACKUP="${ENV_FILE}.bak.$(date +%Y%m%d-%H%M%S)"
cp "${ENV_FILE}" "${BACKUP}"
chmod 600 "${BACKUP}"
echo "Backed up existing env to ${BACKUP}"

replace_or_append "${ENV_FILE}" "POSTGRES_PASSWORD" "${NEW_PG_PASSWORD}"
replace_or_append "${ENV_FILE}" "REDIS_PASSWORD"    "${NEW_REDIS_PASSWORD}"
chmod 600 "${ENV_FILE}"

echo "Updated ${ENV_FILE}."

if [[ "${RESTART}" -eq 0 ]]; then
  echo "Skipping restart (--no-restart). Remember to restart the stack manually:"
  echo "  docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE} up -d"
  exit 0
fi

echo "Restarting compose stack..."
# Use `docker compose` (v2) if available, fall back to `docker-compose`.
if docker compose version >/dev/null 2>&1; then
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d
else
  docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d
fi

echo "Done. Verify services are healthy:"
echo "  docker compose -f ${COMPOSE_FILE} ps"
