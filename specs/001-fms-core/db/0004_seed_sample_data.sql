-- 0004_seed_sample_data.sql
-- Development seed data for FMS core (used by automated RLS tests)

-- Tenants
INSERT INTO tenants (id, name)
VALUES
  ('11111111-1111-1111-1111-111111111111','tenant_a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tenants (id, name)
VALUES
  ('22222222-2222-2222-2222-222222222222','tenant_b')
ON CONFLICT (id) DO NOTHING;

-- Tenant A data
SELECT fms_set_current_tenant('11111111-1111-1111-1111-111111111111');

-- Users
INSERT INTO users (id, tenant_id, username, display_name, email, roles)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'dispatcher_a', 'Dispatcher A', 'disp_a@example.local', ARRAY['dispatcher'])
ON CONFLICT (id) DO NOTHING;

-- Station and Unit for tenant A (coordinates near Tokyo station for example)
INSERT INTO stations (id, tenant_id, name, location, address)
VALUES
  ('aaaaaaaa-0000-0000-0000-aaaaaaaa0001','11111111-1111-1111-1111-111111111111','Station A', ST_SetSRID(ST_MakePoint(139.7670,35.6814),4326), 'Tokyo Station')
ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, tenant_id, station_id, unit_type, status, position, last_seen_at)
VALUES
  ('bbbbbbbb-0000-0000-0000-bbbbbbbb0001','11111111-1111-1111-1111-111111111111','aaaaaaaa-0000-0000-0000-aaaaaaaa0001','Engine','Available', ST_SetSRID(ST_MakePoint(139.7671,35.6815),4326), now())
ON CONFLICT (id) DO NOTHING;

-- Incident for tenant A (near the unit)
INSERT INTO incidents (id, tenant_id, creator_id, location, location_text, type, severity, notes)
VALUES
  ('cccccccc-0000-0000-0000-cccccccc0001','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', ST_SetSRID(ST_MakePoint(139.76705,35.68145),4326), 'Near Tokyo Station','Fire','High','Test incident for tenant A')
ON CONFLICT (id) DO NOTHING;

-- Tenant B data
SELECT fms_set_current_tenant('22222222-2222-2222-2222-222222222222');

INSERT INTO users (id, tenant_id, username, display_name, email, roles)
VALUES
  ('dddddddd-aaaa-aaaa-aaaa-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'dispatcher_b', 'Dispatcher B', 'disp_b@example.local', ARRAY['dispatcher'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO stations (id, tenant_id, name, location, address)
VALUES
  ('bbbbbbbb-1111-1111-1111-bbbbbbbb1111','22222222-2222-2222-2222-222222222222','Station B', ST_SetSRID(ST_MakePoint(139.5,35.6),4326), 'Somewhere B')
ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, tenant_id, station_id, unit_type, status, position, last_seen_at)
VALUES
  ('eeeeeeee-1111-1111-1111-eeeeeeee1111','22222222-2222-2222-2222-222222222222','bbbbbbbb-1111-1111-1111-bbbbbbbb1111','Engine','Available', ST_SetSRID(ST_MakePoint(139.5001,35.6001),4326), now())
ON CONFLICT (id) DO NOTHING;

-- Reset session tenant to null for safety
SELECT set_config('fms.current_tenant', NULL, true);
