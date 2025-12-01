# S3 Image Update Scripts

## Quick Start: Update Product Images from S3

### Option 1: Automated Script (Recommended)

1. **Install Python dependencies:**
   ```bash
   pip install boto3
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   # Or set environment variables:
   # export AWS_ACCESS_KEY_ID=your_key
   # export AWS_SECRET_ACCESS_KEY=your_secret
   ```

3. **Run the script:**
   ```bash
   python scripts/update_s3_images.py
   ```

4. **Review and run the generated SQL:**
   ```bash
   # The script generates: database/update_s3_image_urls_generated.sql
   # Review it, then run:
   psql -d campus_marketplace -f database/update_s3_image_urls_generated.sql
   ```

### Option 2: Manual SQL Updates

1. **Get S3 Object URLs:**
   - Go to: https://us-east-1.console.aws.amazon.com/s3/buckets/spartan-exchange-s3
   - Click on each image file
   - Copy the "Object URL" (not console URL)
   - Format: `https://spartan-exchange-s3.s3.amazonaws.com/filename.jpg`

2. **Update database:**
   ```sql
   UPDATE products 
   SET image_url = 'https://spartan-exchange-s3.s3.amazonaws.com/dell-xps-13.jpg'
   WHERE name = 'Dell XPS 13 Laptop';
   ```

3. **Verify:**
   ```sql
   SELECT id, name, image_url FROM products;
   ```

## Troubleshooting

### Script can't access S3
- Check AWS credentials: `aws sts get-caller-identity`
- Verify bucket name is correct
- Check IAM permissions for S3 read access

### Images still not showing
- Check browser console for CORS errors
- Verify S3 bucket has public read access
- Test URL directly in browser: `https://spartan-exchange-s3.s3.amazonaws.com/your-file.jpg`

### Database connection
- Modify `get_products_from_db()` in the script to connect to your actual database
- Or manually list your products and update the script

