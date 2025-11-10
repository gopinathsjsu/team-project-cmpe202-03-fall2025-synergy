-- Migration script to add status column and update existing records
-- Run this script to fix the "column contains null values" error

-- Step 1: Add the status column as nullable first (if it doesn't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20);

-- Step 2: Update all existing records to have ACTIVE status
UPDATE users SET status = 'ACTIVE' WHERE status IS NULL;

-- Step 3: Now make the column NOT NULL
ALTER TABLE users ALTER COLUMN status SET NOT NULL;

-- Step 4: Add a check constraint to ensure only ACTIVE or SUSPENDED values
ALTER TABLE users ADD CONSTRAINT check_status CHECK (status IN ('ACTIVE', 'SUSPENDED'));

-- Step 5: Set default value for future inserts
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'ACTIVE';

