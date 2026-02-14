-- 0002_create_core_tables.sql
-- Core schema for FMS MVP: tenants, users, stations, units, incidents, dispatch_events, gps_pings

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  username text NOT NULL,
  display_name text,
  email text,
  roles text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Stations
CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  location geometry(Point,4326),
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Units (Vehicles)
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  station_id uuid REFERENCES stations(id),
  unit_type text,
  status text NOT NULL DEFAULT 'Available',
  position geometry(Point,4326),
  last_seen_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES users(id),
  location geometry(Point,4326),
  location_text text,
  type text,
  severity text,
  notes text,
  status text NOT NULL DEFAULT 'Open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Dispatch events
CREATE TABLE IF NOT EXISTS dispatch_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  issued_by uuid REFERENCES users(id),
  issued_at timestamptz NOT NULL DEFAULT now(),
  response_status text DEFAULT 'Pending',
  response_at timestamptz,
  details jsonb DEFAULT '{}'::jsonb
);

-- GPS pings
CREATE TABLE IF NOT EXISTS gps_pings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  position geometry(Point,4326),
  accuracy_m numeric
);

-- Indexes and PostGIS optimizations
CREATE INDEX IF NOT EXISTS idx_units_position ON units USING GIST (position);
CREATE INDEX IF NOT EXISTS idx_stations_location ON stations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_gps_pings_position ON gps_pings USING GIST (position);

CREATE INDEX IF NOT EXISTS idx_units_tenant ON units (tenant_id);
CREATE INDEX IF NOT EXISTS idx_incidents_tenant ON incidents (tenant_id);

-- Partial index for available units to speed up proximity queries
CREATE INDEX IF NOT EXISTS idx_units_available ON units (tenant_id) WHERE status = 'Available';
