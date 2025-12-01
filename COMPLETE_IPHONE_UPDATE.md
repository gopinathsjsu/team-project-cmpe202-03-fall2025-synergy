# ✅ Complete iPhone 13 Image Update

## 📍 Component Location

**File:** `frontend/src/pages/HomePage.tsx`

**Featured Listings Section:** Lines 98-153

## 🔍 Current Code Analysis

### 1. Data Source (Lines 21-43)
```tsx
useEffect(() => {
  const fetchFeatured = async () => {
    setFeaturedLoading(true)
    setFeaturedError('')
    try {
      const products = await productApi.getAll()  // ✅ Fetches from API
      setFeaturedProducts(products)
    } catch (err: unknown) {
      // Error handling...
    } finally {
      setFeaturedLoading(false)
    }
  }
  fetchFeatured()
}, [])
```

**✅ Correct:** Fetches products from backend API (not hardcoded)

### 2. Featured Listings Display (Lines 118-145)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {featuredProducts.slice(0, 3).map((product) => (
    <Link
      key={product.id}
      to={`/listings/${product.id}`}
      className="card hover:shadow-md transition-shadow cursor-pointer block"
    >
      <img
        src={product.imageUrl}  // ✅ Uses imageUrl from database
        alt={product.name}
        className="h-48 w-full object-cover rounded-lg mb-4"
        onError={(e) => { 
          e.currentTarget.src = "/placeholder.png"; 
        }}
      />
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-2xl font-bold text-primary-600 mb-2">${product.price}</p>
        {/* ... more product details ... */}
      </div>
    </Link>
  ))}
</div>
```

**✅ Correct:** Uses `product.imageUrl` from the API response

## 🔧 What Needs to Be Done

The frontend code is **already correct**! The issue is that the database doesn't have the `imageUrl` set for Apple iPhone 13.

**Solution:** Update the database with the S3 URL.

---

## 🚀 Update Database (Required)

### Step 1: Connect to Database

Open Terminal and run:
```bash
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
```

Password: `postgres`

### Step 2: Update iPhone 13 Image URL

Run this SQL:
```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'
WHERE name = 'Apple iPhone 13';
```

### Step 3: Verify

```sql
SELECT id, name, image_url FROM products WHERE name = 'Apple iPhone 13';
```

Should show:
- `image_url`: `https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png`

### Step 4: Exit

```sql
\q
```

### Step 5: Refresh Browser

1. Go to: `http://localhost:5173/`
2. Press **F5** or **Cmd+R** (hard refresh: **Ctrl+Shift+R** or **Cmd+Shift+R**)
3. **iPhone 13 image should appear!** 🎉

---

## ✅ Code Confirmation

### HomePage.tsx - Featured Listings (Lines 125-132)

```tsx
<img
  src={product.imageUrl}  // ✅ Will display S3 image once database is updated
  alt={product.name}
  className="h-48 w-full object-cover rounded-lg mb-4"
  onError={(e) => { 
    e.currentTarget.src = "/placeholder.png"; 
  }}
/>
```

**This code is correct!** It will display the S3 image once the database has the URL.

---

## 📋 Summary

| Component | Status | Action Needed |
|-----------|--------|---------------|
| HomePage.tsx | ✅ Correct | None - code is ready |
| Image tag | ✅ Correct | Uses `product.imageUrl` |
| Data fetching | ✅ Correct | Fetches from API |
| Database | ❌ Needs update | Run SQL command above |

---

## 🎯 Result After Database Update

Once you run the SQL command:

1. ✅ Database will have: `image_url = 'https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png'`
2. ✅ API will return: `imageUrl` field with S3 URL
3. ✅ Frontend will display: `<img src="https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png" />`
4. ✅ Image will load from S3 bucket
5. ✅ Featured Listings will show iPhone 13 image

---

## ✅ Confirmation

**After running the SQL and refreshing browser:**

- ✅ Apple iPhone 13 image will appear in Featured Listings
- ✅ Image will load from: `https://spartan-exchange-s3.s3.us-east-1.amazonaws.com/iphone+13+.png`
- ✅ No placeholder images
- ✅ Image displays correctly

**The frontend code is ready - just update the database!**

