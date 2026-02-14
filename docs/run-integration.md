# Running integration checks (DB required)

This feature includes a small integration test that requires a Postgres database
with PostGIS and the project's migrations applied.

1. Ensure `psql` is available in your environment.
2. Create and prepare the database (example):

```bash
DB_NAME=fms DB_USER=postgres ./scripts/setup_test_db.sh
psql postgresql://postgres@localhost:5432/fms -f backend/db/migrations/0001_enable_postgis.sql
psql postgresql://postgres@localhost:5432/fms -f backend/db/migrations/0002_create_units_and_dispatch.sql
```

3. Run integration tests (from repo root):

```bash
cd backend
npm ci
npm test
```

If the DB is not reachable the integration tests will be skipped and reported as such.
