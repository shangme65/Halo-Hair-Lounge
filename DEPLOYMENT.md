# GitHub Actions + Vercel Deployment Setup

This project is configured to automatically deploy to Vercel whenever you push to GitHub.

## Required GitHub Secrets

To enable automatic deployments, you need to add the following secrets to your GitHub repository:

### 1. Get Vercel Token
1. Go to https://vercel.com/account/tokens
2. Create a new token with a descriptive name (e.g., "GitHub Actions")
3. Copy the token

### 2. Get Vercel Project IDs
Run these commands in your project directory:
```bash
npm i -g vercel
vercel login
vercel link
```

Then get your IDs:
```bash
# For Organization ID
cat .vercel/project.json | grep orgId

# For Project ID
cat .vercel/project.json | grep projectId
```

### 3. Add Secrets to GitHub
1. Go to your GitHub repository: https://github.com/shangme65/Halo-Hair-Lounge
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these three secrets:

   - **Name:** `VERCEL_TOKEN`
     **Value:** Your Vercel token from step 1

   - **Name:** `VERCEL_ORG_ID`
     **Value:** Your Organization ID from step 2

   - **Name:** `VERCEL_PROJECT_ID`
     **Value:** Your Project ID from step 2

## How It Works

- **Push to `master` or `main` branch** → Production deployment
- **Push to `develop` or any other branch** → Preview deployment

## Deployment Status

You can view deployment status in the **Actions** tab of your GitHub repository.

## Manual Deployment

If you need to deploy manually:
```bash
vercel --prod
```

## Git Configuration

This project is configured with:
- **User:** shangme65
- **Email:** shangme65@users.noreply.github.com

To verify your git config:
```bash
git config user.name
git config user.email
```
