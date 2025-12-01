# 🎯 EXACT STEPS - Do This Now

## Step 1: Open Terminal

Press `Cmd + Space` (Mac) and type "Terminal", then press Enter.

## Step 2: Connect to Database

Copy and paste this command:

```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

**When it asks for password, type:** `postgres` (then press Enter)

## Step 3: Update Database

Copy and paste this ENTIRE SQL command:

```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name = 'Apple iPhone 13';
```

**Press Enter**

## Step 4: Verify It Worked

Copy and paste this:

```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```

**You should see the image_url is now set!**

## Step 5: Exit Database

Type:
```sql
\q
```

Press Enter

## Step 6: Refresh Browser

1. Go to: `http://localhost:5173`
2. Press **F5** (or **Cmd+R** on Mac)
3. **iPhone image should appear!** 🎉

---

## ✅ That's It!

If the image still doesn't show:
1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check browser console (F12)** for errors
3. **Test the S3 URL directly** in browser to make sure it loads

---

## 🔍 If Product Name is Different

If the SQL above doesn't work, try this instead:

```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name LIKE '%iPhone%' OR name LIKE '%iphone%';
```

This will update ANY product with "iPhone" in the name.

