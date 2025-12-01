# Category-Based S3 Image URLs Implementation

## Overview

The system now automatically generates S3 image URLs based on product categories when `imageUrl` is not set in the database. This ensures Featured Listings and all product displays show images correctly.

## How It Works

### Backend (Spring Boot)

1. **S3ImageUrlGenerator Utility** (`backend/src/main/java/com/example/app/util/S3ImageUrlGenerator.java`)
   - Generates S3 URLs in format: `https://spartan-exchange-s3.s3.amazonaws.com/{category}/{productId}.jpg`
   - Handles category normalization (lowercase, trimmed)
   - Validates S3 URLs

2. **ProductMapper** (`backend/src/main/java/com/example/app/util/ProductMapper.java`)
   - Automatically ensures `imageUrl` is set for all products
   - Uses existing `imageUrl` if valid
   - Generates category-based URL if `imageUrl` is null/empty

3. **All API Endpoints**
   - All product endpoints now return `ProductResponseDto` with guaranteed `imageUrl`
   - URLs are generated based on category:
     - `electronics` → `https://spartan-exchange-s3.s3.amazonaws.com/electronics/{id}.jpg`
     - `textbooks` → `https://spartan-exchange-s3.s3.amazonaws.com/textbooks/{id}.jpg`
     - `furniture` → `https://spartan-exchange-s3.s3.amazonaws.com/furniture/{id}.jpg`
     - `gaming` → `https://spartan-exchange-s3.s3.amazonaws.com/gaming/{id}.jpg`

### Frontend (React/Vite)

1. **HomePage.tsx - Featured Listings**
   - Updated image tag to use `product.imageUrl` directly
   - Added `onError` handler to fallback to `/placeholder.png`
   - Removed conditional check (backend guarantees imageUrl exists)

## URL Format

### Generated URLs (when imageUrl is null in DB)
```
https://spartan-exchange-s3.s3.amazonaws.com/{category}/{productId}.jpg
```

**Examples:**
- Product ID 1, category "electronics" → `https://spartan-exchange-s3.s3.amazonaws.com/electronics/1.jpg`
- Product ID 2, category "textbooks" → `https://spartan-exchange-s3.s3.amazonaws.com/textbooks/2.jpg`
- Product ID 3, category "furniture" → `https://spartan-exchange-s3.s3.amazonaws.com/furniture/3.jpg`
- Product ID 4, category "gaming" → `https://spartan-exchange-s3.s3.amazonaws.com/gaming/4.jpg`

### Custom URLs (when imageUrl is set in DB)
If you set `imageUrl` in the database, it will be used as-is (must be valid S3 URL).

## S3 Bucket Structure

Your S3 bucket should be organized by category:

```
spartan-exchange-s3/
├── electronics/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── textbooks/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── furniture/
│   ├── 1.jpg
│   └── ...
└── gaming/
    ├── 1.jpg
    └── ...
```

## Setting Up Images

### Option 1: Use Product ID as Filename (Recommended)
1. Upload images to S3 with product ID as filename
2. Place in category folder: `{category}/{productId}.jpg`
3. Example: Product ID 1, category "electronics" → `electronics/1.jpg`

### Option 2: Set Custom imageUrl in Database
If you want custom filenames, set `imageUrl` directly in the database:

```sql
UPDATE products 
SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/electronics/dell-xps-13.jpg'
WHERE id = 1;
```

## Validation

### URL Validation
- URLs must start with `https://spartan-exchange-s3.s3.amazonaws.com`
- Category is normalized to lowercase
- Product ID is used as filename if imageUrl is null

### Error Handling
- Frontend falls back to `/placeholder.png` if image fails to load
- Backend always returns a valid imageUrl (never null)

## Testing

1. **Check Backend Response:**
   ```bash
   curl http://localhost:8080/api/products
   ```
   Verify all products have `image_url` field set.

2. **Check Frontend:**
   - Open browser DevTools (F12) → Console
   - Look for image load/error messages
   - Verify images display in Featured Listings

3. **Test URL Directly:**
   ```
   https://spartan-exchange-s3.s3.amazonaws.com/electronics/1.jpg
   ```
   Should load the image in browser.

## Troubleshooting

### Images Still Not Showing

1. **Check S3 Permissions:**
   - Bucket must allow public read access
   - Or configure CORS for your domain

2. **Verify File Exists:**
   - Check S3 bucket has files at: `{category}/{productId}.jpg`
   - Or set custom `imageUrl` in database

3. **Check Browser Console:**
   - Look for CORS errors
   - Check if URLs are correct

### URL Format Issues

- Ensure category is lowercase in database
- Product ID must match filename in S3
- URL must start with `https://spartan-exchange-s3.s3.amazonaws.com`

## Code Changes Summary

### Backend
- ✅ Created `S3ImageUrlGenerator.java` utility
- ✅ Updated `ProductMapper.java` to ensure imageUrl
- ✅ Updated `ProductController.java` to use ProductMapper everywhere

### Frontend
- ✅ Updated `HomePage.tsx` Featured Listings image tag
- ✅ Added error handling with fallback to placeholder

## Next Steps

1. Upload product images to S3 organized by category
2. Use product ID as filename: `{category}/{productId}.jpg`
3. Or set custom `imageUrl` in database for specific products
4. Test Featured Listings on homepage

