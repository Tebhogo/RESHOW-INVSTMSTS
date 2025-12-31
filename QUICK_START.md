# Quick Start: Make Site Live on GitHub Pages

## ⚡ 3 Steps to Deploy

### Step 1: Enable GitHub Pages (30 seconds)
1. Go to: https://github.com/Tebhogo/RESHOW-INVSTMSTS/settings/pages
2. Under **"Source"**, select **"GitHub Actions"**
3. Click **Save**

### Step 2: Run the Workflow (1 minute)
1. Go to: https://github.com/Tebhogo/RESHOW-INVSTMSTS/actions
2. Click **"Deploy to GitHub Pages"** (left sidebar)
3. Click **"Run workflow"** button (top right)
4. Select branch: **main**
5. Click green **"Run workflow"** button
6. Wait 5-10 minutes for it to complete (watch the progress)

### Step 3: Check Your Site
After workflow shows ✅ green checkmark:
- Your site: https://tebhogo.github.io/RESHOW-INVSTMSTS/

## 🔴 If You See 404 Error

The 404 means GitHub Pages isn't enabled yet. Follow Step 1 above!

## 📋 Checklist

- [ ] Settings → Pages → Source set to "GitHub Actions"
- [ ] Actions tab shows workflow running/completed
- [ ] Green checkmark ✅ appears next to workflow run
- [ ] Site accessible at the URL

## ⚠️ Important Notes

1. **Backend API Required**: GitHub Pages only hosts the frontend. You still need to deploy the backend separately (see DEPLOY.md for Render.com setup).

2. **First Time**: First deployment takes 5-10 minutes. Be patient!

3. **Updates**: Every time you push to main branch, it automatically redeploys (or manually trigger from Actions tab).

## Need Help?

- See `TROUBLESHOOT_GITHUB_PAGES.md` for detailed troubleshooting
- See `GITHUB_PAGES_DEPLOY.md` for complete deployment guide

