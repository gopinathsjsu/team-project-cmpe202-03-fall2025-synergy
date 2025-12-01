# 🚀 Quick Update: Display iPhone 13 Image from S3

## ✅ Good News!
You've already uploaded the iPhone 13 image to S3! Now we just need to:
1. Find the image URL
2. Update the database
3. Refresh your browser

---

## 🎯 Method 1: Automated Script (Easiest - 2 minutes)

### Step 1: Install Dependencies
```bash
pip install boto3 psycopg2-binary
```

### Step 2: Run the Script
```bash
python scripts/find_and_update_iphone.py
```

**That's it!** The script will:
- ✅ Find your iPhone image in S3
- ✅ Get the correct URL
- ✅ Update the database automatically
- ✅ Show you the result

### Step 3: Refresh Browser
- Go to: http://localhost:5173
- Refresh the page (F5 or Cmd+R)
- **iPhone 13 image should appear!** 🎉

---

## 🎯 Method 2: Manual Update (If Script Doesn't Work)

### Step 1: Get the S3 Image URL

1. **Go to your S3 bucket:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects

2. **Find your iPhone image:**
   - Look for the file you uploaded
   - It might be in the root or in a folder

3. **Click on the image file**

4. **Copy the "Object URL"**
   - It should look like: `https://spartan-exchange-s3.s3.amazonaws.com/your-folder/iphone13.jpg`
   - Or: `https://spartan-exchange-s3.s3.amazonaws.com/iphone13.jpg`

5. **Make sure it's public:**
   - Go to "Permissions" tab
   - Click "Make public using ACL" if not already public

### Step 2: Update Database

**Option A: Using Terminal**
```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

Then run (replace with your actual URL):
```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/your-folder/iphone13.jpg'
WHERE name = 'Apple iPhone 13';
```

**Option B: Using Database GUI**
1. Connect to your database
2. Run the SQL query above

### Step 3: Verify
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```

Should show your S3 URL.

### Step 4: Refresh Browser
- Go to: http://localhost:5173
- Refresh page
- Image should appear!

---

## 🔍 Troubleshooting

### Image Still Not Showing?

**Check 1: Test S3 URL Directly**
- Open the S3 URL in a new browser tab
- If it loads → URL is correct
- If 403/404 → Make sure file is public

**Check 2: Database**
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```
- `image_url` should NOT be NULL
- Should show your S3 URL

**Check 3: Browser Console**
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for image requests

**Check 4: Hard Refresh**
- Clear cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## ✅ Success Checklist

- [ ] Image URL found in S3
- [ ] Image is public in S3
- [ ] Database updated with S3 URL
- [ ] S3 URL loads directly in browser
- [ ] Featured Listings shows iPhone 13 image

---

## 🎉 You're Done!

After updating the database, just refresh your browser and the iPhone 13 image will appear in Featured Listings!

