# Backend: Test environment notes

This folder contains the backend server code. The following helper scripts and
stubs are provided to bootstrap local test environments for the FMS Core MVP:

- `../scripts/setup_test_db.sh` — Create a Postgres test DB and enable PostGIS.
- `src/auth/test-auth-stub.ts` — Simple auth middleware for local integration tests.
- `src/middleware/tenant.middleware.ts` — Tenant context middleware skeleton.
- `db/migrations/0001_enable_postgis.sql` — Migration to enable PostGIS.

To prepare a local test DB (example):

```bash
DB_NAME=fms_test DB_USER=postgres ./scripts/setup_test_db.sh
```
# FMS Backend (Skeleton)

Minimal NestJS-based skeleton for FMS core MVP.

Environment
- Set `DATABASE_URL` to point to Postgres with PostGIS.
- Optionally set `JWT_SECRET` for token verification in middleware (otherwise middleware will decode without verification).

Run (dev):

```bash
cd backend
npm install
npm run start:dev
```

Endpoints:
- GET /incidents
- POST /incidents

Notes:
- Middleware extracts `tenant_id` from JWT and attempts to set DB session `fms.current_tenant`.
- This is a lightweight starting point; further work: unit tests, TypeORM/Repository wiring, OpenAPI decorators, request validation.
