# quickstart.md — 001-fms-core

## Purpose
Run a local developer setup for the MVP core: API (NestJS), Postgres+PostGIS, Redis, Keycloak, and a minimal web client.

## Prerequisites
- Docker & Docker Compose
- Node.js 18+
- pnpm or npm

## Quick steps (dev)

1. Start infra services (Postgres+PostGIS, Redis, Keycloak)

```bash
docker compose -f devops/docker-compose.dev.yml up -d
```

2. Run backend (NestJS)

```bash
cd backend
pnpm install
pnpm dev
```

3. Run frontend (Next.js)

```bash
cd frontend
pnpm install
pnpm dev
```

4. Seed test data (stations, units)

```bash
pnpm --filter backend seed:dev
```

## Notes
- Default config reads `TENANT_ID` from environment or Keycloak claim for local testing.
- For geocoding fallback, use the map UI to drop a pin if geocoding fails.
