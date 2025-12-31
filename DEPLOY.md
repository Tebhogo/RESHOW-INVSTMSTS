# Deployment Guide - Reshow Investments

This guide will help you deploy the Reshow Investments website to Render.com (free tier available).

## Prerequisites

1. GitHub repository (already done: https://github.com/Tebhogo/RESHOW-INVSTMSTS)
2. Render.com account (sign up at https://render.com)

## Deployment Steps

### Option 1: Quick Deploy with Render.yaml (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect your GitHub repository**: Select `Tebhogo/RESHOW-INVSTMSTS`
4. **Render will auto-detect `render.yaml`** and create both services
5. **Set Environment Variables**:
   - For backend service, add:
     ```
     JWT_SECRET=your-super-secret-jwt-key-here-change-this
     ```
   - The `REACT_APP_API_URL` will be automatically set

### Option 2: Manual Deployment

#### Step 1: Deploy Backend API

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `reshow-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here-change-this
   ```
6. Click **"Create Web Service"**
7. Wait for deployment to complete
8. **Copy the service URL** (e.g., `https://reshow-backend.onrender.com`)

#### Step 2: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `reshow-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://reshow-backend.onrender.com/api
   ```
   (Replace with your actual backend URL)
5. Click **"Create Static Site"**

### Step 3: Initialize Admin User

After backend is deployed:

1. Go to your backend service URL: `https://reshow-backend.onrender.com/api/health`
2. Should see: `{"status":"ok","message":"Reshow API is running"}`
3. You'll need to initialize the admin user. The users.json file should have been deployed, but you may need to create the first admin user through the API or manually.

### Step 4: Access Your Site

- **Frontend URL**: `https://reshow-frontend.onrender.com`
- **Backend API**: `https://reshow-backend.onrender.com/api`

## Important Notes

1. **Free Tier Limitations**:
   - Services may spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **Environment Variables**:
   - Keep `JWT_SECRET` secure and never commit it
   - Update `REACT_APP_API_URL` in frontend to match your backend URL

3. **File Storage**:
   - Uploads are stored in the filesystem
   - On free tier, files may be lost on redeploy
   - Consider using cloud storage (S3, Cloudinary) for production

4. **Database**:
   - Currently using JSON files for data storage
   - For production, consider migrating to a database (MongoDB, PostgreSQL)

## Troubleshooting

- **502 Bad Gateway**: Service is spinning up, wait 30-60 seconds
- **CORS Errors**: Ensure backend has CORS enabled (already configured)
- **API Not Found**: Check that `REACT_APP_API_URL` matches your backend URL
- **Uploads Not Working**: Check file permissions and uploads directory exists

## Alternative Deployment Options

- **Vercel** (Frontend) + **Railway** (Backend)
- **Netlify** (Frontend) + **Render** (Backend)
- **AWS** (EC2, S3, RDS)
- **DigitalOcean** (Droplet)

