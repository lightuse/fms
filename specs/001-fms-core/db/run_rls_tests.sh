#!/usr/bin/env bash
set -euo pipefail

# run_rls_tests.sh
# Usage: PSQL_CONN="postgresql://postgres:password@localhost:5432/fms" ./run_rls_tests.sh

PSQL_CONN=${PSQL_CONN:-}
if [ -z "$PSQL_CONN" ]; then
  echo "Please set PSQL_CONN environment variable, e.g. postgresql://postgres:password@localhost:5432/fms"
  exit 2
fi

ROOT_DIR="$(dirname "$0")"
SQL_DIR="$ROOT_DIR"

echo "Applying seed data..."
psql "$PSQL_CONN" -f "$SQL_DIR/0004_seed_sample_data.sql"

fail() {
  echo "[FAIL] $1"
  exit 1
}

run_query() {
  local q="$1"
  psql "$PSQL_CONN" -t -A -c "$q"
}

echo "Setting up non-privileged tester role for RLS checks..."
# Create a non-superuser if it doesn't exist and grant SELECTs needed for tests
psql "$PSQL_CONN" -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='fms_tester') THEN CREATE ROLE fms_tester LOGIN PASSWORD 'test'; END IF; END \$\$;"
psql "$PSQL_CONN" -v ON_ERROR_STOP=1 -c "GRANT SELECT ON users, incidents, units TO fms_tester;"

# Build TEST_CONN by replacing userinfo in the original URI with tester creds
# Expect PSQL_CONN form: postgresql://user:pass@host:port/dbname
HOSTPART=$(echo "$PSQL_CONN" | sed -E 's#postgresql://[^@]+@(.+)#\1#')
TEST_CONN="postgresql://fms_tester:test@${HOSTPART}"

echo "Running RLS checks as non-privileged role..."

TENANT_A='11111111-1111-1111-1111-111111111111'
TENANT_B='22222222-2222-2222-2222-222222222222'

run_query_as_test() {
  local q="$1"
  psql "$TEST_CONN" -t -A -c "$q"
}

echo "-- check users visibility for tenant A"
psql "$TEST_CONN" -c "SELECT set_config('fms.current_tenant','$TENANT_A', true);" >/dev/null
ucount=$(run_query_as_test "SELECT count(*) FROM users;")
if [ "$ucount" != "1" ]; then
  fail "expected 1 user for tenant A, got $ucount"
fi

echo "-- check users visibility for tenant B"
psql "$TEST_CONN" -c "SELECT set_config('fms.current_tenant','$TENANT_B', true);" >/dev/null
ucount_b=$(run_query_as_test "SELECT count(*) FROM users;")
if [ "$ucount_b" != "1" ]; then
  fail "expected 1 user for tenant B, got $ucount_b"
fi

echo "-- check incidents visibility (tenant A has 1)"
psql "$TEST_CONN" -c "SELECT set_config('fms.current_tenant','$TENANT_A', true);" >/dev/null
incount=$(run_query_as_test "SELECT count(*) FROM incidents;")
if [ "$incount" != "1" ]; then
  fail "expected 1 incident for tenant A, got $incount"
fi

echo "-- geospatial proximity check: tenant A incident should find 1 nearby unit within 5km"
psql "$TEST_CONN" -c "SELECT set_config('fms.current_tenant','$TENANT_A', true);" >/dev/null
near_count=$(run_query_as_test "SELECT count(distinct u.id) FROM units u JOIN incidents i ON (i.id = 'cccccccc-0000-0000-0000-cccccccc0001') WHERE ST_DWithin(i.location::geography, u.position::geography, 5000);")
if [ "$near_count" != "1" ]; then
  fail "expected 1 nearby unit for tenant A incident, got $near_count"
fi

echo "All RLS checks passed ✅"

# Optional cleanup
if [ "${CLEANUP:-false}" = "true" ]; then
  echo "Cleaning up tester role..."
  psql "$PSQL_CONN" -v ON_ERROR_STOP=1 -c "REVOKE SELECT ON users, incidents, units FROM fms_tester;" || true
  psql "$PSQL_CONN" -v ON_ERROR_STOP=1 -c "DROP ROLE IF EXISTS fms_tester;" || true
fi

exit 0
