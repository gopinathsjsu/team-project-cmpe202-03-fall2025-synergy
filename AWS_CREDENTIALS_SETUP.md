# 🔐 AWS Credentials Setup Guide

## ❌ Error: Missing AWS Credentials

You're getting this error because AWS credentials are not configured:
```
Unable to load credentials from any of the providers in the chain
```

## ✅ Solution: Set Up AWS Credentials

You have **3 options** to provide AWS credentials:

---

## Option 1: Environment Variables (Recommended)

Set environment variables before starting the backend:

### On macOS/Linux:
```bash
export AWS_ACCESS_KEY_ID=your_access_key_here
export AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### On Windows (PowerShell):
```powershell
$env:AWS_ACCESS_KEY_ID="your_access_key_here"
$env:AWS_SECRET_ACCESS_KEY="your_secret_key_here"
```

### On Windows (Command Prompt):
```cmd
set AWS_ACCESS_KEY_ID=your_access_key_here
set AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

**Then start the backend:**
```bash
cd backend
./mvnw spring-boot:run
```

---

## Option 2: AWS CLI Configuration (Recommended for Development)

If you have AWS CLI installed, configure it:

```bash
aws configure
```

Enter:
- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key
- **Default region**: `us-east-1`
- **Default output format**: `json` (or leave blank)

The backend will automatically use these credentials.

---

## Option 3: Direct Configuration (Not Recommended)

**⚠️ WARNING: Don't commit credentials to git!**

Edit `backend/src/main/resources/application.yml`:

```yaml
aws:
  s3:
    bucket-name: spartan-exchange-s3
    region: us-east-1
  access-key-id: YOUR_ACCESS_KEY_HERE
  secret-access-key: YOUR_SECRET_KEY_HERE
```

**Make sure to add `application.yml` to `.gitignore` if you do this!**

---

## 🔑 How to Get AWS Credentials

### Step 1: Log in to AWS Console
Go to: https://console.aws.amazon.com/

### Step 2: Open IAM (Identity and Access Management)
1. Search for "IAM" in the AWS Console
2. Click on "IAM"

### Step 3: Create Access Key
1. Click on your **username** (top right)
2. Click **"Security credentials"**
3. Scroll to **"Access keys"**
4. Click **"Create access key"**
5. Choose **"Application running outside AWS"**
6. Click **"Next"**
7. Add a description (optional): "Spartan Exchange S3 Upload"
8. Click **"Create access key"**

### Step 4: Save Your Credentials
**⚠️ IMPORTANT: Save these immediately - you can only see the secret key once!**

- **Access Key ID**: `AKIA...` (starts with AKIA)
- **Secret Access Key**: `wJalr...` (long string)

---

## 🔒 Required S3 Permissions

Your AWS user/role needs these S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::spartan-exchange-s3/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::spartan-exchange-s3"
    }
  ]
}
```

### How to Add Permissions:
1. Go to **IAM** → **Users** → Click your username
2. Click **"Add permissions"** → **"Attach policies directly"**
3. Search for **"AmazonS3FullAccess"** (or create custom policy above)
4. Click **"Add permissions"**

---

## ✅ Verify Setup

After setting credentials, restart the backend and check logs:

```
S3 Client initialized for bucket: spartan-exchange-s3, region: us-east-1
```

If you see this, credentials are working! ✅

---

## 🧪 Test Image Upload

1. Go to: `http://localhost:5173/create-listing`
2. Fill out the form
3. Select an image
4. Click "Create Listing"

**Expected:** Image uploads successfully, no 500 error!

---

## 🚨 Troubleshooting

### Still getting 500 error?
1. **Check credentials are set:**
   ```bash
   echo $AWS_ACCESS_KEY_ID
   echo $AWS_SECRET_ACCESS_KEY
   ```
   Should show your keys (not empty).

2. **Check backend logs:**
   Look for: `S3 Client initialized for bucket: ...`
   If you see credential errors, credentials aren't loaded.

3. **Verify S3 bucket exists:**
   - Bucket name: `spartan-exchange-s3`
   - Region: `us-east-1`
   - Make sure bucket is accessible from your AWS account.

4. **Check IAM permissions:**
   - User has S3 permissions
   - Access key is active (not disabled)

---

## 📝 Summary

**Quick Start:**
```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
cd backend
./mvnw spring-boot:run
```

**That's it!** The backend will now be able to upload images to S3. 🎉

