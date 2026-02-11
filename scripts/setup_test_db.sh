#!/usr/bin/env bash

# Simple helper to prepare a local Postgres database with PostGIS for tests.
# Usage: DB_NAME=fms_test DB_USER=postgres ./scripts/setup_test_db.sh

set -euo pipefail

DB_NAME="${DB_NAME:-fms_test}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "Creating test database: $DB_NAME on $DB_HOST:$DB_PORT as $DB_USER"

psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/postgres" -v ON_ERROR_STOP=1 <<SQL
DO
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}') THEN
      PERFORM pg_sleep(0); -- placeholder to keep syntax
    END IF;
  END
END
$$;
SQL

createdb --if-not-exists --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" "$DB_NAME" || true

echo "Enabling PostGIS and extensions on $DB_NAME"
psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}" -v ON_ERROR_STOP=1 <<SQL
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SQL

echo "Test DB prepared: $DB_NAME"

exit 0
