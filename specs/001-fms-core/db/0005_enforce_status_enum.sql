-- 0005_enforce_status_enum.sql
-- Enforce allowed status values for units and incidents via ENUM types
-- Safe migration: create types if not exists, then alter columns using USING cast.

-- Unit status enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fms_unit_status') THEN
    CREATE TYPE fms_unit_status AS ENUM ('Available','Assigned','En Route','On Scene','Contained');
  END IF;
END$$;

-- Incident status enum (include common states; add Closed for future use)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fms_incident_status') THEN
    CREATE TYPE fms_incident_status AS ENUM ('Open','Assigned','En Route','On Scene','Contained','Closed');
  END IF;
END$$;

-- Alter units.status to enum type if the column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='status') THEN
    -- If current type is not enum fms_unit_status, attempt to alter
    PERFORM 1 FROM pg_type WHERE typname = 'fms_unit_status';
    BEGIN
      ALTER TABLE units ALTER COLUMN status TYPE fms_unit_status USING status::fms_unit_status;
      ALTER TABLE units ALTER COLUMN status SET DEFAULT 'Available';
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Skipping units.status enum migration: %', SQLERRM;
    END;
  END IF;
END$$;

-- Alter incidents.status to enum type if the column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='incidents' AND column_name='status') THEN
    BEGIN
      ALTER TABLE incidents ALTER COLUMN status TYPE fms_incident_status USING status::fms_incident_status;
      ALTER TABLE incidents ALTER COLUMN status SET DEFAULT 'Open';
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Skipping incidents.status enum migration: %', SQLERRM;
    END;
  END IF;
END$$;

-- Optionally, add check to prevent unexpected text values on new inserts (defensive)
-- (Handled by enum types above.)
