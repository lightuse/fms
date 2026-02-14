-- 0004_add_gps_pings.sql
-- Add GPS pings table and index for unit position history

CREATE TABLE IF NOT EXISTS gps_pings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id uuid NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  position geometry(Point,4326),
  accuracy_m numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE IF EXISTS gps_pings
  ADD CONSTRAINT fk_gps_pings_unit FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_gps_pings_position ON gps_pings USING GIST (position);
CREATE INDEX IF NOT EXISTS idx_gps_pings_unit ON gps_pings (unit_id);
