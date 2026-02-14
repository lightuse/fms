#!/usr/bin/env bash
set -euo pipefail

# Simple migration runner: applies SQL files in `specs/001-fms-core/db` in lexical order
# Usage: SCRIPTDIR/scripts/run-migrations.sh [PG_CONN]
# Example: ./scripts/run-migrations.sh "postgresql://postgres:postgres@localhost:5432/fms"

DEFAULT_CONN="postgresql://postgres:postgres@localhost:5432/fms"
PG_CONN=${1:-${PG_CONN:-$DEFAULT_CONN}}

DIR="$(dirname "$0")/../specs/001-fms-core/db"
if [ ! -d "$DIR" ]; then
  echo "ERROR: migrations dir not found: $DIR" >&2
  exit 2
fi

echo "Using PG_CONN=$PG_CONN"

for f in $(ls "$DIR"/*.sql 2>/dev/null | sort); do
  echo "---- Applying $f ----"
  psql "$PG_CONN" -v ON_ERROR_STOP=1 -f "$f"
done

echo "Migrations applied."
