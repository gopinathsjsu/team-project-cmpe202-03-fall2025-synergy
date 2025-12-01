# 📱 Complete Step-by-Step Guide: Add iPhone 13 Image to Featured Listings

## 🎯 Goal
Upload the iPhone 13 image to AWS S3 and display it in the Featured Listings on your homepage.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ AWS account with access to S3 bucket `spartan-exchange-s3`
- ✅ The iPhone 13 image file saved on your computer
- ✅ Access to your database (PostgreSQL)
- ✅ Your application running (backend + frontend)

---

## 🚀 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Find Your iPhone 13 Image File

1. **Locate the iPhone 13 image on your computer**
   - It might be in Downloads, Desktop, or wherever you saved it
   - Note the full path (e.g., `/Users/yourname/Downloads/iphone13.jpg`)

2. **If you don't have the image:**
   - Download it from wherever you have it
   - Save it somewhere easy to find (like Desktop or Downloads)

---

### STEP 2: Find the Product ID in Database

We need to know the product ID to name the file correctly.

**Option A: Using Command Line (Terminal)**

1. **Open Terminal** (on Mac: Cmd+Space, type "Terminal")

2. **Connect to your database:**
   ```bash
   psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
   ```
   - When prompted, enter password: `postgres` (or your password)

3. **Find the iPhone product:**
   ```sql
   SELECT id, name, category, image_url 
   FROM products 
   WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';
   ```

4. **Note the ID number** (probably `2` or similar)

5. **Exit psql:**
   ```sql
   \q
   ```

**Option B: Using Database GUI Tool**

If you have pgAdmin, DBeaver, or similar:
1. Connect to your database
2. Run the SQL query above
3. Note the product ID

**Option C: Check via API**

1. **Open your browser**
2. **Go to:** `http://localhost:8080/api/products`
3. **Find "Apple iPhone 13"** in the JSON response
4. **Note the `id` field**

---

### STEP 3: Upload Image to AWS S3

#### 3.1: Open S3 Console

1. **Open your web browser**
2. **Go to:** https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3?region=us-east-1&tab=objects
3. **Sign in** if needed

#### 3.2: Create the "electronics" Folder

1. **In the S3 bucket, click "Create folder"** (top right)
2. **Name it:** `electronics`
3. **Click "Create folder"**
4. **If the folder already exists, skip this step**

#### 3.3: Navigate into the Folder

1. **Click on the `electronics` folder** to open it

#### 3.4: Upload the iPhone Image

1. **Click "Upload" button** (top right)
2. **Click "Add files"** or **drag and drop** your iPhone 13 image file
3. **IMPORTANT - Rename the file:**
   - In the upload dialog, find your file
   - Click on the filename
   - Change it to: `2.jpg` (or `{your-product-id}.jpg` if different)
   - Example: If product ID is 5, name it `5.jpg`
4. **Click "Upload"** (bottom right)
5. **Wait for upload to complete**

#### 3.5: Make the Image Public

1. **Click on the uploaded file** (`2.jpg` or your filename)
2. **Go to the "Permissions" tab** (top menu)
3. **Scroll down to "Object actions"**
4. **Click "Make public using ACL"**
5. **Click "Make public"** in the confirmation dialog
6. **You should see a success message**

#### 3.6: Get the Image URL

1. **Click on the file again** (or refresh the page)
2. **Look for "Object URL"** field
3. **Copy the URL** - it should look like:
   ```
   https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg
   ```
4. **Save this URL** - you'll need it in the next step

---

### STEP 4: Update the Database

Now we need to tell the database where to find the image.

#### 4.1: Connect to Database

**Option A: Using Terminal (Command Line)**

1. **Open Terminal**
2. **Run:**
   ```bash
   psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
   ```
3. **Enter password:** `postgres` (or your password)

**Option B: Using Database GUI**

1. Open your database tool (pgAdmin, DBeaver, etc.)
2. Connect to your database

#### 4.2: Update the Product Record

**Run this SQL command** (replace `2` with your actual product ID if different):

```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg'
WHERE name = 'Apple iPhone 13';
```

**If your product ID is different** (e.g., 5), use:
```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/electronics/5.jpg'
WHERE name = 'Apple iPhone 13';
```

#### 4.3: Verify the Update

**Run this to check:**
```sql
SELECT id, name, category, image_url 
FROM products 
WHERE name = 'Apple iPhone 13';
```

**You should see:**
- `id`: Your product ID (e.g., 2)
- `name`: Apple iPhone 13
- `category`: electronics
- `image_url`: `https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg`

**If `image_url` is still NULL or empty:**
- Check that the UPDATE command ran successfully
- Make sure the product name matches exactly: `'Apple iPhone 13'`

#### 4.4: Exit Database (if using Terminal)

```sql
\q
```

---

### STEP 5: Test the Image URL

Before checking your app, test if the S3 URL works:

1. **Open a new browser tab**
2. **Paste the S3 URL:**
   ```
   https://spartan-exchange-s3.s3.amazonaws.com/electronics/2.jpg
   ```
3. **Press Enter**

**✅ If the image loads:**
- Great! The S3 setup is correct
- Proceed to Step 6

**❌ If you see 403 Forbidden or 404 Not Found:**
- Go back to Step 3.5 and make sure the file is public
- Check that the filename matches (e.g., `2.jpg`)
- Verify you're in the `electronics` folder

---

### STEP 6: Refresh Your Application

1. **Make sure your backend is running:**
   - Check: `http://localhost:8080/api/products`
   - Should return JSON with products

2. **Make sure your frontend is running:**
   - Check: `http://localhost:5173`
   - Should show your homepage

3. **Refresh the homepage:**
   - Go to: `http://localhost:5173`
   - Press **F5** (Windows) or **Cmd+R** (Mac) to refresh
   - Or click the refresh button

4. **Check Featured Listings:**
   - Scroll down to "Featured Listings" section
   - **The iPhone 13 image should now appear!** 🎉

---

## 🔍 Troubleshooting

### Problem: Image Still Not Showing

**Check 1: Database**
```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```
- `image_url` should NOT be NULL
- Should show the S3 URL

**Check 2: S3 URL**
- Test the URL directly in browser
- Should load the image

**Check 3: Browser Console**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Go to Network tab
5. Refresh page
6. Look for the image request - check if it's loading

**Check 4: Product ID Mismatch**
- Make sure filename in S3 matches product ID
- If product ID is 5, file should be `5.jpg`, not `2.jpg`

**Check 5: Hard Refresh**
- Clear browser cache
- Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### Problem: Can't Connect to Database

**Check connection string:**
- Host: `database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com`
- Port: `5432`
- Database: `campus_marketplace`
- User: `postgres`
- Password: `postgres` (or your password)

### Problem: S3 Upload Fails

**Check:**
- AWS credentials are correct
- You have permission to upload to the bucket
- Bucket name is correct: `spartan-exchange-s3`
- Region is correct: `us-east-1`

### Problem: File Not Public

**Solution:**
1. Go to S3 console
2. Click on the file
3. Permissions tab
4. Make public using ACL
5. Confirm

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Image uploaded to S3: `electronics/2.jpg` (or your product ID)
- [ ] Image is public in S3
- [ ] Database `image_url` field is updated
- [ ] S3 URL loads directly in browser
- [ ] Featured Listings shows iPhone 13 image
- [ ] No placeholder images

---

## 📝 Quick Reference

**S3 Bucket:** `spartan-exchange-s3`  
**Region:** `us-east-1`  
**Folder:** `electronics/`  
**Filename Format:** `{productId}.jpg`  
**URL Format:** `https://spartan-exchange-s3.s3.amazonaws.com/electronics/{productId}.jpg`

**Database:**
- Host: `database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com`
- Database: `campus_marketplace`
- User: `postgres`

**SQL Update:**
```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/electronics/{productId}.jpg'
WHERE name = 'Apple iPhone 13';
```

---

## 🎉 You're Done!

If you followed all steps correctly, the iPhone 13 image should now appear in your Featured Listings!

If you encounter any issues, check the Troubleshooting section above.

