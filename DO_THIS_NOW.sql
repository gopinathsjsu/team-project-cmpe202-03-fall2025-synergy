-- COPY AND PASTE THIS ENTIRE FILE INTO YOUR DATABASE
-- This will update the iPhone 13 image URL

-- Step 1: Find the product
SELECT id, name, category, image_url 
FROM products 
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- Step 2: Update with S3 URL (replace with your actual URL if different)
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name = 'Apple iPhone 13';

-- Step 3: Verify it worked
SELECT id, name, image_url 
FROM products 
WHERE name = 'Apple iPhone 13';

-- If the above doesn't work, try this (for different product name):
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- Verify again
SELECT id, name, image_url FROM products WHERE name LIKE '%iPhone%';

