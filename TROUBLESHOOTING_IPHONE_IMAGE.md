# 🔧 Troubleshooting: iPhone 13 Image Not Displaying

## 🚀 Quick Diagnostic

Run this script to automatically check everything:

```bash
python scripts/diagnose_iphone_image.py
```

This will tell you exactly what's wrong and how to fix it!

---

## 🔍 Manual Troubleshooting Steps

### Step 1: Check Database

**Connect to database:**
```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

**Check if image_url is set:**
```sql
SELECT id, name, image_url FROM products WHERE name LIKE '%iPhone%';
```

**❌ If image_url is NULL or empty:**
```sql
-- Get the S3 URL first (see Step 2), then run:
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/YOUR_PATH/iphone13.jpg'
WHERE name = 'Apple iPhone 13';
```

**✅ If image_url is set:**
- Note the URL
- Proceed to Step 2

---

### Step 2: Check S3 URL

**Test the S3 URL directly in browser:**
1. Copy the URL from database (or get it from S3 console)
2. Open in new browser tab
3. Check what happens:

**✅ Image loads:**
- URL is correct
- Proceed to Step 3

**❌ 403 Forbidden:**
- Image is not public
- **Fix:** Go to S3 → Click file → Permissions → Make public

**❌ 404 Not Found:**
- File doesn't exist at that path
- **Fix:** Check filename and folder path in S3

---

### Step 3: Check Backend API

**Test if backend returns the image URL:**
1. Open browser
2. Go to: `http://localhost:8080/api/products`
3. Find "Apple iPhone 13" in the JSON
4. Check if `image_url` field has the S3 URL

**❌ If image_url is missing or wrong:**
- Backend might not be returning it
- Check if backend is running
- Restart backend if needed

---

### Step 4: Check Frontend

**Check browser console:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Go to Network tab
5. Refresh page
6. Look for image request

**Common issues:**
- **CORS error:** S3 bucket needs CORS configuration
- **404 on image:** URL is wrong or file doesn't exist
- **403 on image:** File is not public

---

### Step 5: Hard Refresh Browser

**Clear cache and refresh:**
- **Windows:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

Or:
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

---

## 🔧 Common Problems & Solutions

### Problem 1: image_url is NULL in Database

**Solution:**
```sql
-- First, get the S3 Object URL from S3 console
-- Then update:
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg'
WHERE name = 'Apple iPhone 13';
```

---

### Problem 2: S3 Image Returns 403 Forbidden

**Solution:**
1. Go to S3 console
2. Click on your iPhone image file
3. Go to "Permissions" tab
4. Under "Object actions" → Click "Make public using ACL"
5. Click "Make public"
6. Test URL again in browser

---

### Problem 3: S3 Image Returns 404 Not Found

**Solution:**
1. Check the filename in S3 matches the URL
2. Check the folder path (should be `electronics/` if category is electronics)
3. Verify the file is actually uploaded
4. Update database with correct URL

---

### Problem 4: CORS Error in Browser Console

**Solution:**
1. Go to S3 bucket → Permissions → CORS
2. Add this CORS configuration:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

---

### Problem 5: Image URL is Wrong Format

**Correct format:**
```
https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg
```

**Wrong formats:**
- Console URL: `https://us-east-1.console.aws.amazon.com/...` ❌
- Missing https: `spartan-exchange-s3.s3.amazonaws.com/...` ❌
- Wrong bucket: `https://other-bucket.s3.amazonaws.com/...` ❌

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Database has image_url set (not NULL)
- [ ] S3 URL loads directly in browser
- [ ] Image is public in S3
- [ ] Backend API returns image_url in JSON
- [ ] Browser console has no errors
- [ ] Hard refresh done
- [ ] Featured Listings shows image

---

## 🎯 Quick Fix Commands

**If you know the S3 URL:**
```sql
UPDATE products 
SET image_url = 'YOUR_S3_URL_HERE'
WHERE name = 'Apple iPhone 13';
```

**If you need to find the S3 URL:**
1. Go to: https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3
2. Click on iPhone image
3. Copy "Object URL"
4. Use it in UPDATE query above

---

## 🆘 Still Not Working?

1. **Run diagnostic script:**
   ```bash
   python scripts/diagnose_iphone_image.py
   ```

2. **Check all steps above**

3. **Verify:**
   - Backend is running
   - Frontend is running
   - Database is accessible
   - S3 bucket is accessible

4. **Check browser console for specific errors**

---

## 📞 Quick Reference

**Database:**
- Host: `database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com`
- Database: `campus_marketplace`
- User: `postgres`

**S3:**
- Bucket: `spartan-exchange-s3`
- Region: `us-east-1`
- URL format: `https://spartan-exchange-s3.s3.amazonaws.com/{folder}/{filename}`

**Test URLs:**
- Backend API: `http://localhost:8080/api/products`
- Frontend: `http://localhost:5173`

