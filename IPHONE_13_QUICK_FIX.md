# 🚀 iPhone 13 Image - Quick Fix (5 Minutes)

## What You Need
1. The iPhone 13 image file (saved on your computer)
2. AWS S3 access
3. Database access

---

## Method 1: Automated Script (Easiest) ⚡

### Step 1: Install Dependencies
```bash
pip install boto3 psycopg2-binary
```

### Step 2: Run the Script
```bash
# Replace with your actual image path
python scripts/upload_iphone_to_s3.py --image-path /path/to/iphone13.jpg
```

**That's it!** The script will:
- ✅ Upload to S3
- ✅ Make it public
- ✅ Update database
- ✅ Show you the URL

---

## Method 2: Manual Steps (If Script Fails)

### Step 1: Upload Image to S3 (2 minutes)

1. **Open S3 Console:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects

2. **Create `electronics` folder** (if it doesn't exist):
   - Click "Create folder"
   - Name: `electronics`
   - Click "Create folder"

3. **Upload iPhone image:**
   - Open the `electronics` folder
   - Click "Upload"
   - Drag & drop or select your iPhone 13 image
   - **IMPORTANT:** Rename file to `2.jpg` (or your product ID)
   - Click "Upload"

4. **Make it public:**
   - Click on the uploaded file (`2.jpg`)
   - Go to "Permissions" tab
   - Under "Object actions" → Click "Make public using ACL"
   - Click "Make public"

5. **Copy the URL:**
   - Click on the file again
   - Copy the "Object URL"
   - Should be: `https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg`

### Step 2: Update Database (1 minute)

**Option A: Using psql command line:**
```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

Then run:
```sql
-- Find the product ID first
SELECT id, name FROM products WHERE name LIKE '%iPhone%';

-- Update (replace 2 with actual product ID)
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg'
WHERE name = 'Apple iPhone 13';

-- Verify
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```

**Option B: Using a database GUI (pgAdmin, DBeaver, etc.):**
1. Connect to your database
2. Run the SQL queries above

### Step 3: Refresh Browser (10 seconds)
- Go to: http://localhost:5173
- Refresh the page (F5 or Cmd+R)
- **iPhone 13 image should now appear!** 🎉

---

## Verify It Works

### Test 1: Check S3 URL
Open in browser:
```
https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg
```
✅ If image loads → S3 is working  
❌ If 403/404 → Check permissions or filename

### Test 2: Check Database
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```
✅ Should show the S3 URL  
❌ If NULL → Update didn't work

### Test 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for image load messages
4. Check Network tab for image requests

---

## Common Issues & Fixes

### ❌ "Image still not showing"

**Check 1: S3 Permissions**
- File must be public
- Bucket must allow public read
- Check CORS settings if you see CORS errors

**Check 2: Database**
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```
- `image_url` should NOT be NULL
- URL should start with `https://spartan-exchange-s3.s3.amazonaws.com`

**Check 3: Product ID**
- Make sure filename matches product ID
- If product ID is 5, file should be `5.jpg`, not `2.jpg`

**Check 4: Browser Cache**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache

### ❌ "Script fails with Access Denied"
```bash
# Check AWS credentials
aws sts get-caller-identity

# If not configured:
aws configure
```

### ❌ "Product not found in database"
```sql
-- See all products
SELECT id, name, category FROM products;

-- Find iPhone product
SELECT id, name FROM products WHERE name LIKE '%iPhone%' OR name LIKE '%phone%';
```

---

## Expected Result

After completing these steps:
- ✅ iPhone 13 image appears in Featured Listings
- ✅ Image loads from S3 bucket
- ✅ No placeholder images
- ✅ Image URL is: `https://spartan-exchange-s3.s3.amazonaws.com/electronics/{productId}.jpg`

---

## Need Help?

1. **Check the automated script:** `scripts/upload_iphone_to_s3.py`
2. **See detailed guide:** `scripts/COMPLETE_IPHONE_SETUP.md`
3. **Check S3 setup:** `S3_IMAGE_SETUP.md`

---

## Quick Reference

**S3 Bucket:** `spartan-exchange-s3`  
**Region:** `us-east-1`  
**Folder:** `electronics/`  
**Filename:** `{productId}.jpg` (e.g., `2.jpg`)  
**URL Format:** `https://spartan-exchange-s3.s3.amazonaws.com/electronics/{productId}.jpg`

