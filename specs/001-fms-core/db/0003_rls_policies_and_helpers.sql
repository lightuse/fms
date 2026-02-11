-- 0003_rls_policies_and_helpers.sql
-- RLS policies and helper functions for single-schema multitenancy using session variable

-- Helper: set current tenant for the DB session
CREATE OR REPLACE FUNCTION fms_set_current_tenant(tenant uuid) RETURNS void LANGUAGE sql AS $$
  SELECT set_config('fms.current_tenant', tenant::text, true);
$$;

-- Helper: get current tenant (for policies convenience)
CREATE OR REPLACE FUNCTION fms_current_tenant() RETURNS uuid LANGUAGE sql AS $$
  SELECT current_setting('fms.current_tenant')::uuid;
$$;

-- Enable RLS on tenant-scoped tables
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS units ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS incidents ENABLE ROW LEVEL SECURITY;

-- Users RLS: allow access only to rows matching tenant_id
CREATE POLICY users_tenant_isolation ON users USING (tenant_id = fms_current_tenant());
-- Allow authenticated session to INSERT with tenant_id = current_tenant
CREATE POLICY users_insert_policy ON users FOR INSERT WITH CHECK (tenant_id = fms_current_tenant());

-- Stations RLS
CREATE POLICY stations_tenant_isolation ON stations USING (tenant_id = fms_current_tenant());
CREATE POLICY stations_insert_policy ON stations FOR INSERT WITH CHECK (tenant_id = fms_current_tenant());

-- Units RLS
CREATE POLICY units_tenant_isolation ON units USING (tenant_id = fms_current_tenant());
CREATE POLICY units_insert_policy ON units FOR INSERT WITH CHECK (tenant_id = fms_current_tenant());

-- Incidents RLS
CREATE POLICY incidents_tenant_isolation ON incidents USING (tenant_id = fms_current_tenant());
CREATE POLICY incidents_insert_policy ON incidents FOR INSERT WITH CHECK (tenant_id = fms_current_tenant());

-- Optionally create an admin bypass role: fms_admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'fms_admin') THEN
    CREATE ROLE fms_admin NOINHERIT;
  END IF;
END$$;

-- Grant permissions to admin role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fms_admin;

-- Notes:
-- Application must call SELECT fms_set_current_tenant('<tenant-uuid>') at the start of each session/transaction
-- Alternatively, use SET LOCAL fms.current_tenant = '<uuid>' inside transactions from middleware that extracts tenant from JWT
