-- Update Apple iPhone 13 with S3 image URL
-- Run this SQL in your database

-- Step 1: Check current state
SELECT id, name, category, image_url 
FROM products 
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- Step 2: Update with S3 URL
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name = 'Apple iPhone 13';

-- Step 3: If exact name doesn't match, try with LIKE
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- Step 4: Verify the update
SELECT id, name, image_url 
FROM products 
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- The image_url should now be: https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png

