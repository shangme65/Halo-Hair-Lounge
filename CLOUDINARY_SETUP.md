# Image Upload Setup - Cloudinary

Since Vercel has a read-only filesystem, we use **Cloudinary** for image uploads.

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a **free account** (generous free tier)
3. After signup, you'll be taken to the dashboard

### 2. Get Your Credentials

On the Cloudinary Dashboard, you'll find:

- **Cloud Name**: e.g., `dzabcdef123`
- **API Key**: e.g., `123456789012345`
- **API Secret**: e.g., `abcdefGHIJKLMNOP1234567890`

### 3. Add to Environment Variables

#### Local Development (.env file)

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### Vercel Production

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Click **Save**
5. **Redeploy** your application

### 4. Test Upload

After setup:

1. Go to your admin portal
2. Try uploading an image
3. It should now upload to Cloudinary successfully!

## How It Works

- Images are processed with Sharp (resized, optimized)
- Uploaded to Cloudinary (cloud storage)
- Cloudinary returns a permanent URL
- That URL is saved in your database

## Free Tier Limits

Cloudinary's free tier includes:

- **25 GB storage**
- **25 GB bandwidth per month**
- **Unlimited transformations**

This is more than enough for most small to medium businesses!

## Folder Structure

Images are organized in Cloudinary folders:

- `halo-hair-lounge/services/` - Service images
- `halo-hair-lounge/products/` - Product images
- `halo-hair-lounge/testimonials/` - Testimonial images
