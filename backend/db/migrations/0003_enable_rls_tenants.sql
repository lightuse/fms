-- 0003_enable_rls_tenants.sql
-- Enable row-level security (RLS) policies for tenant isolation on core tables

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'units') THEN
    ALTER TABLE units ENABLE ROW LEVEL SECURITY;
    CREATE POLICY fms_tenant_isolation_units ON units USING (tenant_id = current_setting('fms.tenant_id', true)::uuid);
    ALTER TABLE units FORCE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'incidents') THEN
    ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
    CREATE POLICY fms_tenant_isolation_incidents ON incidents USING (tenant_id = current_setting('fms.tenant_id', true)::uuid);
    ALTER TABLE incidents FORCE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dispatch_events') THEN
    ALTER TABLE dispatch_events ENABLE ROW LEVEL SECURITY;
    -- dispatch_events may reference tenant via incident or unit; allow access when related rows match tenant
    -- Simple policy uses tenant_id column if present, otherwise denies access when not set.
    BEGIN
      EXECUTE 'ALTER TABLE dispatch_events ENABLE ROW LEVEL SECURITY';
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    -- If table has tenant_id directly, create a policy; otherwise create permissive policy guarded by incident's tenant
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dispatch_events' AND column_name='tenant_id') THEN
      CREATE POLICY fms_tenant_isolation_dispatch_events ON dispatch_events USING (tenant_id = current_setting('fms.tenant_id', true)::uuid);
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'incident_assignments') THEN
    ALTER TABLE incident_assignments ENABLE ROW LEVEL SECURITY;
    -- incident_assignments has no tenant_id; enforce via joined incidents table in policy expression
    CREATE POLICY fms_tenant_isolation_incident_assignments ON incident_assignments USING (
      (SELECT tenant_id FROM incidents WHERE incidents.id = incident_assignments.incident_id) = current_setting('fms.tenant_id', true)::uuid
    );
    ALTER TABLE incident_assignments FORCE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gps_pings') THEN
    ALTER TABLE gps_pings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY fms_tenant_isolation_gps_pings ON gps_pings USING (
      (SELECT tenant_id FROM units WHERE units.id = gps_pings.unit_id) = current_setting('fms.tenant_id', true)::uuid
    );
    ALTER TABLE gps_pings FORCE ROW LEVEL SECURITY;
  END IF;
END$$;

-- Note: session must set `fms.tenant_id` using `SET SESSION "fms.tenant_id" = '<tenant-uuid>'` before queries.
