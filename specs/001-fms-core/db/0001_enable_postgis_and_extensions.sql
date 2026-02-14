-- 0001_enable_postgis_and_extensions.sql
-- Enables required Postgres extensions for spatial data and UUIDs

-- Run as a superuser or a role with sufficient privileges
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optional: pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Note: some hosted Postgres providers require enabling extensions through their console.
