# S3 Image Upload - Complete Setup Guide

## ✅ What's Been Implemented

### Backend
1. ✅ **AWS S3 SDK** added to `pom.xml`
2. ✅ **S3Service** - Handles image uploads to S3
3. ✅ **ImageUploadController** - API endpoint: `POST /api/images/upload`
4. ✅ **Product creation** - Saves S3 URL in database

### Frontend
1. ✅ **imageApi** - Service for uploading images
2. ✅ **CreateListingPage** - Uploads image to S3 before creating product
3. ✅ **ListingsPage** - Displays images from S3 URLs
4. ✅ **HomePage** - Featured listings display S3 images

---

## 🔧 Setup Instructions

### Step 1: Configure AWS Credentials

The S3 service uses AWS SDK default credential chain. Configure one of these:

**Option A: AWS CLI (Recommended)**
```bash
aws configure
```
Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`
- Default output format: `json`

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

**Option C: IAM Role (for EC2/ECS)**
- Attach IAM role with S3 permissions to your instance

### Step 2: Verify S3 Bucket Permissions

1. **Go to S3 Console:**
   https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3

2. **Check Bucket Policy:**
   - Permissions → Bucket Policy
   - Ensure your IAM user/role has `s3:PutObject` and `s3:PutObjectAcl` permissions

3. **Check CORS (for browser uploads):**
   - Permissions → CORS
   - Add this if not present:
   ```json
   [
       {
           "AllowedHeaders": ["*"],
           "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
           "AllowedOrigins": ["*"],
           "ExposeHeaders": []
       }
   ]
   ```

### Step 3: Install Backend Dependencies

```bash
cd backend
mvn clean install
```

This will download the AWS S3 SDK.

### Step 4: Start Your Application

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install  # If not already done
npm run dev
```

---

## 📝 How It Works

### Creating a Listing with Image

1. **User fills out form** on Create Listing page
2. **User selects image** - Image is automatically uploaded to S3
3. **S3 returns URL** - Format: `https://spartan-exchange-s3.s3.amazonaws.com/{category}/{uuid}.jpg`
4. **Product created** - S3 URL saved in `image_url` column
5. **Image displays** - In listings page using the S3 URL

### Image Organization

Images are organized by category in S3:
```
spartan-exchange-s3/
├── electronics/
│   ├── uuid1.jpg
│   └── uuid2.jpg
├── textbooks/
│   └── uuid3.jpg
├── furniture/
│   └── uuid4.jpg
└── gaming/
    └── uuid5.jpg
```

### API Endpoints

**Upload Image:**
```
POST /api/images/upload
Content-Type: multipart/form-data

Form Data:
- file: (image file)
- category: (optional, e.g., "electronics")

Response:
{
  "imageUrl": "https://spartan-exchange-s3.s3.amazonaws.com/electronics/uuid.jpg",
  "message": "Image uploaded successfully"
}
```

**Create Product (with image URL):**
```
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 100.00,
  "category": "electronics",
  "condition": "good",
  "sellerId": 1,
  "imageUrl": "https://spartan-exchange-s3.s3.amazonaws.com/electronics/uuid.jpg",
  "status": "ACTIVE"
}
```

---

## 🧪 Testing

### Test Image Upload

1. **Go to Create Listing page:**
   http://localhost:5173/create-listing

2. **Fill out form and select image**

3. **Check browser console:**
   - Should see "Image uploaded to S3: [URL]"

4. **Check S3 bucket:**
   - Image should appear in `{category}/` folder

5. **Check database:**
   ```sql
   SELECT id, name, image_url FROM products ORDER BY id DESC LIMIT 1;
   ```
   - `image_url` should have S3 URL

### Test Image Display

1. **Go to Listings page:**
   http://localhost:5173/listings

2. **Verify images display:**
   - Should see product images from S3
   - No placeholder images

3. **Check browser console:**
   - No CORS errors
   - Images load successfully

---

## 🔍 Troubleshooting

### Error: "Failed to upload image"

**Check:**
1. AWS credentials configured correctly
2. IAM user has S3 permissions:
   - `s3:PutObject`
   - `s3:PutObjectAcl`
3. Bucket name is correct: `spartan-exchange-s3`
4. Region is correct: `us-east-1`

### Error: "Access Denied" or 403

**Solution:**
1. Check IAM permissions
2. Verify bucket policy allows your user
3. Check CORS configuration

### Images Not Displaying

**Check:**
1. Database has `image_url` set (not NULL)
2. S3 URL is correct format
3. Image is public in S3
4. CORS is configured
5. Browser console for errors

### Backend Won't Start

**Check:**
1. Maven dependencies installed: `mvn clean install`
2. AWS SDK downloaded
3. No compilation errors

---

## 📋 Configuration

### Backend Configuration

**application.yml:**
```yaml
aws:
  s3:
    bucket-name: spartan-exchange-s3
    region: us-east-1
```

### Environment Variables (Optional)

```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

---

## ✅ Success Checklist

- [ ] AWS credentials configured
- [ ] S3 bucket permissions set
- [ ] CORS configured
- [ ] Backend dependencies installed
- [ ] Backend starts without errors
- [ ] Image upload works
- [ ] Images appear in S3 bucket
- [ ] Database saves S3 URLs
- [ ] Images display in listings

---

## 🎉 You're Done!

Your application now:
- ✅ Uploads images to S3 when creating listings
- ✅ Saves S3 URLs in database
- ✅ Displays images from S3 in listings
- ✅ Organizes images by category

**Next Steps:**
1. Test creating a new listing with an image
2. Verify the image appears in listings
3. Check S3 bucket to see uploaded images

