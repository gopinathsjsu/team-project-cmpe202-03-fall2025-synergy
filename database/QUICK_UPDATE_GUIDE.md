# Quick Guide: Update Product Images from S3

## Step-by-Step Instructions

### Step 1: Get Your Product List from Database

Run this SQL query to see all your products:
```sql
SELECT id, name, category, image_url 
FROM products 
ORDER BY id;
```

Copy the product names - you'll need them for mapping.

### Step 2: Get S3 Object URLs

1. **Open your S3 bucket:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects

2. **For each image file:**
   - Click on the file name
   - In the object details page, look for **"Object URL"** 
   - OR click the **"Open"** button - this will show you the actual URL
   - Copy the URL (should look like: `https://spartan-exchange-s3.s3.amazonaws.com/filename.jpg`)

3. **Map files to products:**
   - Match each S3 file to a product by name/category
   - Example: `dell-xps-13.jpg` → "Dell XPS 13 Laptop"

### Step 3: Create SQL Update Statements

Use this template - replace with your actual mappings:

```sql
-- Update products with S3 image URLs
-- Format: UPDATE products SET image_url = 'S3_URL' WHERE name = 'Product Name';

UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR-FILE-1.jpg'
WHERE name = 'Dell XPS 13 Laptop';

UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR-FILE-2.jpg'
WHERE name = 'Apple iPhone 13';

UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR-FILE-3.jpg'
WHERE name = 'Sony WH-1000XM4 Headphones';

-- Add more UPDATE statements for each product...
```

### Step 4: Run the SQL

**Option A: Using psql command line:**
```bash
psql -d campus_marketplace -U postgres -f update_s3_image_urls.sql
```

**Option B: Using database GUI (pgAdmin, DBeaver, etc.):**
1. Open your database client
2. Connect to your database
3. Paste and run the UPDATE statements

**Option C: Using Docker (if using docker-compose):**
```bash
docker-compose exec database psql -U postgres -d campus_marketplace -f /path/to/update_s3_image_urls.sql
```

### Step 5: Verify

Check that images are updated:
```sql
SELECT id, name, image_url 
FROM products 
WHERE image_url IS NOT NULL;
```

### Step 6: Test in Browser

1. Refresh your listings page: http://localhost:5173/listings
2. Open browser DevTools (F12) → Console
3. Look for log messages showing image URLs
4. Images should now display!

## Common Issues

### ❌ Images still blank
- **Check:** Are the URLs correct? Test in browser: `https://spartan-exchange-s3.s3.amazonaws.com/your-file.jpg`
- **Check:** Browser console for CORS errors
- **Check:** S3 bucket permissions (needs public read access)

### ❌ CORS Error
- Go to S3 bucket → Permissions → CORS
- Add CORS policy to allow your domain

### ❌ 403 Forbidden
- Check S3 bucket policy allows public read
- Or make objects public individually

### ❌ Can't find Object URL
- In S3 console, click the file
- Look for "Object URL" field
- OR click "Open" button - the browser URL is the object URL

## Example Mapping

Based on your current products:

| Product Name | S3 File Name | SQL Update |
|-------------|--------------|------------|
| Dell XPS 13 Laptop | `dell-xps-13.jpg` | `UPDATE products SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/dell-xps-13.jpg' WHERE name = 'Dell XPS 13 Laptop';` |
| Apple iPhone 13 | `iphone-13.jpg` | `UPDATE products SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/iphone-13.jpg' WHERE name = 'Apple iPhone 13';` |
| Sony WH-1000XM4 Headphones | `sony-headphones.jpg` | `UPDATE products SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/sony-headphones.jpg' WHERE name = 'Sony WH-1000XM4 Headphones';` |

**Note:** Replace the S3 file names with your actual file names from the bucket!

