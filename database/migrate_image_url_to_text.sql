-- Migration script to change image_url column from VARCHAR(500) to TEXT
-- This allows storing base64-encoded images which can be very long

-- Alter the image_url column to TEXT type
ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;

