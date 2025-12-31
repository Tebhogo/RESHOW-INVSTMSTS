# Troubleshooting GitHub Pages 404 Error

If you're seeing a 404 error, follow these steps:

## Step 1: Enable GitHub Pages in Settings

1. Go to: https://github.com/Tebhogo/RESHOW-INVSTMSTS/settings/pages
2. Under **"Source"**, select **"GitHub Actions"** (NOT "Deploy from a branch")
3. Click **Save**

## Step 2: Check if Workflow Ran

1. Go to: https://github.com/Tebhogo/RESHOW-INVSTMSTS/actions
2. Look for "Deploy to GitHub Pages" workflow
3. If it shows "This workflow has a workflow_dispatch event trigger":
   - Click on "Deploy to GitHub Pages"
   - Click "Run workflow" button (top right)
   - Select branch: `main`
   - Click "Run workflow"
4. Wait for it to complete (green checkmark)

## Step 3: Verify Deployment

1. After workflow completes, go back to: https://github.com/Tebhogo/RESHOW-INVSTMSTS/settings/pages
2. You should see: "Your site is live at https://tebhogo.github.io/RESHOW-INVSTMSTS/"
3. If you see an error, check the Actions tab for failure logs

## Step 4: Common Issues

### Issue: "Workflow not found"
- Make sure you pushed the `.github/workflows/deploy.yml` file
- Check that it's in the correct location: `.github/workflows/deploy.yml`

### Issue: "Build failed"
- Check Actions tab for error details
- Common causes:
  - Missing dependencies in package.json
  - Build errors in React code
  - Missing environment variables

### Issue: "Page still shows 404 after workflow success"
- Wait 5-10 minutes for GitHub Pages to propagate
- Clear browser cache
- Try incognito/private window
- Check Settings → Pages to confirm it shows "Published"

## Quick Fix: Manual Trigger

If the workflow hasn't run automatically:

1. Go to: https://github.com/Tebhogo/RESHOW-INVSTMSTS/actions
2. Select "Deploy to GitHub Pages" from the left sidebar
3. Click "Run workflow" (top right)
4. Select branch: `main`
5. Click "Run workflow"
6. Wait for it to complete

## Still Not Working?

If you're still getting 404 after following all steps:

1. Check the Actions tab for any error messages
2. Verify the workflow file exists at: `.github/workflows/deploy.yml`
3. Make sure you're using the correct repository name in the homepage URL
4. Try accessing: `https://tebhogo.github.io/RESHOW-INVSTMSTS/` (with trailing slash)

