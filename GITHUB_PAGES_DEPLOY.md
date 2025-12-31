# Deploy to GitHub Pages

This guide will help you deploy the frontend to GitHub Pages (free hosting).

## Important Notes

⚠️ **GitHub Pages only hosts static files**, so:
- ✅ Frontend (React app) can be deployed to GitHub Pages
- ❌ Backend (Node.js API) **cannot** be deployed to GitHub Pages
- 🔧 You'll need to deploy the backend separately (Render.com, Railway, etc.)

## Setup Steps

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/Tebhogo/RESHOW-INVSTMSTS
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** section
4. Under **"Source"**, select **"GitHub Actions"**
5. Save the settings

### Step 2: Set Up Backend API (Required)

Since GitHub Pages can't host Node.js, deploy your backend first:

**Option A: Render.com (Free)**
1. Go to https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variable: `JWT_SECRET=your-secret-key`
8. Copy your backend URL (e.g., `https://reshow-backend.onrender.com`)

**Option B: Railway.app (Free)**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Set root directory to `server`
5. Deploy

### Step 3: Configure API URL

After backend is deployed, you need to set the API URL:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `REACT_APP_API_URL`
4. Value: Your backend API URL (e.g., `https://reshow-backend.onrender.com/api`)
5. Click **"Add secret"**

### Step 4: Deploy Frontend

The GitHub Actions workflow will automatically deploy when you push to main branch, OR:

1. Go to **Actions** tab in your repository
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

### Step 5: Access Your Site

After deployment (5-10 minutes):
- Your site will be live at: `https://tebhogo.github.io/RESHOW-INVSTMSTS/`

## Manual Deployment (Alternative)

If you want to deploy manually:

```bash
# Install dependencies
cd client
npm install

# Build for production
REACT_APP_API_URL=https://your-backend-url.com/api npm run build

# The build folder can be deployed to any static host
```

## Troubleshooting

**404 Errors:**
- Make sure you set `homepage` in `package.json` or configure base path
- GitHub Pages serves from repository root or `/repository-name`

**API Not Working:**
- Check that `REACT_APP_API_URL` secret is set correctly
- Ensure backend is deployed and accessible
- Check browser console for CORS errors

**Build Fails:**
- Check Actions tab for error logs
- Ensure all dependencies are in package.json
- Check Node.js version compatibility

## Complete Setup Checklist

- [ ] Backend deployed (Render/Railway/etc.)
- [ ] Backend URL copied
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] `REACT_APP_API_URL` secret added
- [ ] Workflow runs successfully (check Actions tab)
- [ ] Site accessible at GitHub Pages URL

## Alternative: Deploy Both to Render.com

If you want everything in one place, use Render.com for both frontend and backend (see `DEPLOY.md` for instructions).

