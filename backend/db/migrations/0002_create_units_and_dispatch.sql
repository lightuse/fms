-- Create units table and dispatch-related tables
CREATE TABLE IF NOT EXISTS units (
  unit_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  name text NOT NULL,
  capabilities jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'Available',
  last_known geometry(Point,4326),
  last_seen timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dispatch_events (
  event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id uuid NOT NULL,
  unit_id uuid NULL,
  actor_id uuid NULL,
  action text NOT NULL,
  details jsonb NULL,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS incident_assignments (
  incident_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (incident_id, unit_id)
);
