# 🚀 Update iPhone Image - Complete Solution

## ✅ Automated Solution (Recommended)

### Step 1: Install Dependencies
```bash
pip install boto3 psycopg2-binary
```

### Step 2: Run the Script
```bash
python scripts/find_and_set_iphone_image.py
```

**That's it!** The script will:
- ✅ Find iPhone image in S3 bucket
- ✅ Get the correct S3 URL
- ✅ Update database automatically
- ✅ Show you the result

### Step 3: Refresh Browser
- Go to: `http://localhost:5173`
- Refresh the page (F5 or Cmd+R)
- **iPhone 13 image should appear in Featured Listings!** 🎉

---

## 🔧 Manual Solution (If Script Doesn't Work)

### Step 1: Get S3 Image URL

1. **Go to your S3 bucket:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects

2. **Find your iPhone image:**
   - Look for files with "iphone" in the name
   - Click on the image file

3. **Copy the Object URL:**
   - In the object details, find "Object URL"
   - Copy it (should look like: `https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png`)
   - **Note:** If the filename has spaces, they'll be encoded as `+` in the URL

4. **Make sure it's public:**
   - Go to "Permissions" tab
   - Click "Make public using ACL" if needed

### Step 2: Update Database

**Option A: Using psql**
```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

Then run:
```sql
UPDATE products 
SET image_url = 'YOUR_S3_URL_HERE'
WHERE name = 'Apple iPhone 13';

-- Verify
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```

**Option B: Using Database GUI**
1. Connect to your database
2. Run the SQL query above

### Step 3: Refresh Browser
- Go to: `http://localhost:5173`
- Refresh page
- Image should appear!

---

## ✅ Verification

### Check 1: Database
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```
- `image_url` should NOT be NULL
- Should show your S3 URL

### Check 2: S3 URL
- Open the S3 URL directly in browser
- Image should load
- If 403 → Make it public
- If 404 → Check filename/path

### Check 3: Browser
- Open: `http://localhost:5173`
- Check Featured Listings
- iPhone 13 image should appear

---

## 🎯 Expected Result

After updating:
- ✅ iPhone 13 image appears in Featured Listings
- ✅ Image loads from S3
- ✅ No placeholder images
- ✅ Image displays correctly

---

## 🆘 Troubleshooting

### Image Still Not Showing

1. **Check database:**
   ```sql
   SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
   ```

2. **Test S3 URL:**
   - Open URL directly in browser
   - Should load the image

3. **Hard refresh browser:**
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check browser console (F12):**
   - Look for errors
   - Check Network tab for image requests

---

## 📝 Quick Reference

**S3 Bucket:** `spartan-exchange-s3`  
**Region:** `us-east-1`  
**URL Format:** `https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/{filename}`

**Database:**
- Host: `database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com`
- Database: `campus_marketplace`
- User: `postgres`

**SQL:**
```sql
UPDATE products 
SET image_url = 'YOUR_S3_URL'
WHERE name = 'Apple iPhone 13';
```

