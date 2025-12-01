# Setting Up S3 Images for Products

## Problem
Product images are showing as blank/placeholder because the database `image_url` column is either NULL or contains incorrect URLs.

## Solution: Update Database with S3 Object URLs

### Step 1: Get the Actual S3 Object URLs

**IMPORTANT:** The AWS Console URL is NOT the file URL you need!

1. Go to your S3 bucket: https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects
2. Click on an object/file (e.g., `dell-xps-13.jpg`)
3. In the object details, look for the **"Object URL"** or click **"Open"**
4. The URL should look like: `https://spartan-exchange-s3.s3.amazonaws.com/dell-xps-13.jpg`

**NOT:** `https://us-east-1.console.aws.amazon.com/s3/buckets/...` (This is the console URL, not the file URL)

### Step 2: Verify S3 Bucket is Public

For images to load in the browser, your S3 bucket must be configured for public access:

1. Go to your S3 bucket → **Permissions** tab
2. Check **"Block public access"** settings
3. If blocked, you need to either:
   - Unblock public access (if appropriate for your use case)
   - OR use CloudFront/CDN
   - OR use pre-signed URLs (requires backend changes)

### Step 3: Update Database with S3 URLs

#### Option A: Using SQL Script

1. Open your database (PostgreSQL)
2. Run the SQL script: `database/update_s3_image_urls.sql`
3. Update the example UPDATE statements with your actual S3 URLs:

```sql
-- Example: Update by product name
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/dell-xps-13.jpg'
WHERE name = 'Dell XPS 13 Laptop';

UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/iphone-13.jpg'
WHERE name = 'Apple iPhone 13';

UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/sony-headphones.jpg'
WHERE name = 'Sony WH-1000XM4 Headphones';
```

#### Option B: Using Database GUI (pgAdmin, DBeaver, etc.)

1. Connect to your database
2. Run this query to see current products:
```sql
SELECT id, name, image_url 
FROM products 
ORDER BY id;
```

3. Update each product's `image_url` with the correct S3 URL

#### Option C: Using Backend API (if you have an update endpoint)

You can update products through your API if you have an update endpoint.

### Step 4: Verify URLs are Correct

Run this query to check:
```sql
SELECT id, name, image_url 
FROM products 
WHERE image_url IS NOT NULL AND image_url != '';
```

All URLs should start with: `https://spartan-exchange-s3.s3.amazonaws.com/`

### Step 5: Test in Browser

1. Refresh your listings page
2. Open browser DevTools (F12) → Console tab
3. Look for log messages:
   - `[ListingsPage] Product X: imageUrl = <url>` - Shows what URL is being used
   - `[ListingsPage] Successfully loaded image` - Image loaded successfully
   - `[ListingsPage] Failed to load image` - Image failed to load (check URL/CORS)

### Common Issues

1. **Images still blank after updating database:**
   - Check browser console for CORS errors
   - Verify S3 bucket permissions allow public read access
   - Verify the URL format is correct (not console URL)

2. **CORS Error:**
   - S3 bucket needs CORS configuration to allow your domain
   - Add CORS policy in S3 bucket → Permissions → CORS

3. **403 Forbidden:**
   - Bucket/object permissions not set correctly
   - Check bucket policy allows public read

### Example S3 Object URL Format

```
https://spartan-exchange-s3.s3.amazonaws.com/filename.jpg
https://spartan-exchange-s3.s3.amazonaws.com/filename.png
https://spartan-exchange-s3.s3.amazonaws.com/subfolder/filename.jpg
```

### Quick Test

To test if an S3 URL works, paste it directly in your browser:
```
https://spartan-exchange-s3.s3.amazonaws.com/your-file-name.jpg
```

If it loads in the browser, it will work in your app!

