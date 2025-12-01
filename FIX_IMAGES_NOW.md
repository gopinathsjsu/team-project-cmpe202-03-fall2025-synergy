# 🖼️ Fix Product Images - Quick Start

## The Problem
Your product images are showing as blank because the database `image_url` column is NULL or empty.

## The Solution
Update the database with actual S3 object URLs.

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Get S3 Object URLs

1. **Open your S3 bucket:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects

2. **For each image file:**
   - Click on the file name (e.g., `dell-xps-13.jpg`)
   - In the object details, find **"Object URL"** 
   - Copy it (format: `https://spartan-exchange-s3.s3.amazonaws.com/filename.jpg`)
   - **NOT the console URL!**

### Step 2: Update Database

**Option A: Using SQL directly**

Connect to your database and run:

```sql
-- Replace with your actual S3 URLs
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

**Option B: Using the SQL file**

1. Edit `database/update_s3_image_urls.sql`
2. Replace placeholder URLs with your actual S3 URLs
3. Run: `psql -d campus_marketplace -f database/update_s3_image_urls.sql`

### Step 3: Verify

```sql
SELECT id, name, image_url FROM products WHERE image_url IS NOT NULL;
```

### Step 4: Refresh Browser

Refresh your listings page - images should now appear!

---

## 🔍 Detailed Instructions

See: `database/QUICK_UPDATE_GUIDE.md`

## 🤖 Automated Option

If you have AWS CLI configured:

```bash
pip install boto3
python scripts/update_s3_images.py
```

This will:
- List all S3 objects
- Try to match them to products
- Generate SQL UPDATE statements

See: `scripts/README.md`

---

## ❓ Troubleshooting

### Images still blank?

1. **Check browser console (F12):**
   - Look for errors or warnings
   - Check if image URLs are logged

2. **Test S3 URL directly:**
   - Paste URL in browser: `https://spartan-exchange-s3.s3.amazonaws.com/your-file.jpg`
   - If it doesn't load, check S3 permissions

3. **Check S3 permissions:**
   - Bucket needs public read access (or use CloudFront)
   - Check CORS settings if you see CORS errors

### Can't find Object URL?

- In S3 console, click the file
- Look for "Object URL" field
- OR click "Open" - the browser URL is the object URL

### Database connection?

- Check your database connection string in `backend/src/main/resources/application.yml`
- Or use your database GUI (pgAdmin, DBeaver, etc.)

---

## 📝 Example

**Before:**
```sql
SELECT name, image_url FROM products;
-- image_url is NULL
```

**After running UPDATE:**
```sql
SELECT name, image_url FROM products;
-- image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/dell-xps-13.jpg'
```

**Result:** Images display in your listings! ✅

