-- COPY THIS ENTIRE FILE AND RUN IT IN YOUR DATABASE
-- This will update the iPhone 13 image URL from S3

-- First, let's see what we have
SELECT id, name, category, image_url 
FROM products 
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- Update the image URL (try exact match first)
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name = 'Apple iPhone 13';

-- If that didn't work, try with LIKE (matches any product with iPhone in name)
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- Verify it worked
SELECT id, name, image_url 
FROM products 
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';

-- The image_url should now show: https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png

