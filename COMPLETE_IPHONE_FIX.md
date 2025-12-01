# 📱 Complete iPhone Image Fix - Do Everything

## ✅ What I've Done

1. ✅ **Frontend is already correct** - Uses `product.imageUrl` from database
2. ✅ **Created automated script** - Finds image in S3 and updates database
3. ✅ **Created SQL script** - Manual update option

---

## 🚀 Quick Fix (2 Methods)

### Method 1: Automated Script (Easiest)

```bash
# Step 1: Install dependencies
pip install boto3 psycopg2-binary

# Step 2: Run the script
python scripts/find_and_set_iphone_image.py
```

**Done!** The script will:
- Find iPhone image in S3
- Get the URL
- Update database
- Show you the result

Then refresh your browser - image will appear!

---

### Method 2: Manual Update (If Script Fails)

#### Step 1: Get S3 URL

1. **Go to S3:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects

2. **Find iPhone image:**
   - Look for file with "iphone" in name
   - Click on it

3. **Copy Object URL:**
   - Should look like: `https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png`
   - Copy this URL

4. **Make it public:**
   - Permissions tab → Make public using ACL

#### Step 2: Update Database

**Connect to database:**
```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

**Run SQL (replace with your actual URL):**
```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name = 'Apple iPhone 13';

-- Verify
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```

#### Step 3: Refresh Browser

- Go to: `http://localhost:5173`
- Refresh page (F5 or Cmd+R)
- **Image should appear!** 🎉

---

## ✅ Code Verification

### Frontend Code (HomePage.tsx)

**Lines 125-132:**
```tsx
<img
  src={product.imageUrl}  // ✅ Correct - uses database value
  alt={product.name}
  className="h-48 w-full object-cover rounded-lg mb-4"
  onError={(e) => { 
    e.currentTarget.src = "/placeholder.png"; 
  }}
/>
```

**This code is correct!** It will display the S3 image once the database is updated.

---

## 🔍 Verify It Works

### Test 1: Database
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```
Should show the S3 URL (not NULL).

### Test 2: S3 URL
Open the S3 URL in browser - image should load.

### Test 3: Browser
- Go to: `http://localhost:5173`
- Check Featured Listings
- iPhone 13 image should appear

---

## 📋 Summary

**What's Already Done:**
- ✅ Frontend code is correct
- ✅ Featured Listings component ready
- ✅ Image display logic working

**What You Need to Do:**
1. Run the automated script OR
2. Manually update database with S3 URL
3. Refresh browser

**Result:**
- iPhone 13 image appears in Featured Listings
- Image loads from S3 bucket
- No placeholder images

---

## 🎯 Quick Start

**Fastest way:**
```bash
pip install boto3 psycopg2-binary
python scripts/find_and_set_iphone_image.py
```

Then refresh: `http://localhost:5173`

**Done!** ✅

