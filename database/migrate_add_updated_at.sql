-- Migration: Add updated_at column to products table
-- This migration adds the updated_at column that the Product entity expects

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN updated_at TIMESTAMP;
        
        -- Set updated_at to created_at for existing records
        UPDATE products 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
    END IF;
END $$;

