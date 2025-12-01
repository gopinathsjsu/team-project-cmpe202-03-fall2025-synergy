-- SQL script to update product image URLs with S3 bucket URLs
-- 
-- INSTRUCTIONS:
-- 1. Go to: https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects
-- 2. Click on each image file to get the Object URL
-- 3. Replace the placeholder URLs below with your actual S3 object URLs
-- 4. Run this script in your database
--
-- IMPORTANT: The S3 object URL format is:
-- https://spartan-exchange-s3.s3.amazonaws.com/<file-name>
-- 
-- NOT the console URL: https://us-east-1.console.aws.amazon.com/s3/buckets/...

-- ============================================================================
-- STEP 1: Check current products and their image URLs
-- ============================================================================
SELECT id, name, category, image_url 
FROM products 
ORDER BY id;

-- ============================================================================
-- STEP 2: Update products with S3 image URLs
-- Replace the URLs below with your actual S3 object URLs from the bucket
-- ============================================================================

-- Example: Update by product name
-- Uncomment and replace with your actual URLs:

-- UPDATE products 
-- SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR-FILE-NAME-HERE.jpg'
-- WHERE name = 'Dell XPS 13 Laptop';

-- UPDATE products 
-- SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR-FILE-NAME-HERE.jpg'
-- WHERE name = 'Apple iPhone 13';

-- UPDATE products 
-- SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR-FILE-NAME-HERE.jpg'
-- WHERE name = 'Sony WH-1000XM4 Headphones';

-- Add more UPDATE statements for each product...

-- To see current image URLs (or NULL values):
SELECT id, name, image_url 
FROM products 
ORDER BY id;

-- To see which products have NULL image URLs:
SELECT id, name, image_url 
FROM products 
WHERE image_url IS NULL OR image_url = '';

