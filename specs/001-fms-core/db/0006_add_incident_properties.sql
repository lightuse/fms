-- 0006_add_incident_properties.sql
-- Add back `properties` jsonb column to incidents to match API/legacy clients.
-- This migration is idempotent: it will only add the column if it does not already exist.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'incidents' AND column_name = 'properties'
  ) THEN
    ALTER TABLE incidents
      ADD COLUMN properties jsonb DEFAULT '{}'::jsonb;
  END IF;
END$$;

-- Optional: ensure there is no unexpected NULLs (column has default). If desired, backfill from other columns here.
