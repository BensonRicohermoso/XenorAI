# 🚀 Quick Vercel Deployment Guide

Deploy XenorAI to Vercel in 5 minutes!

## Prerequisites

- GitHub account
- Vercel account (free at vercel.com)
- Google Gemini API key (get at https://makersuite.google.com/app/apikey)

## Steps

### 1. Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/xenorai.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Configure Project**:
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
   - Keep other defaults

### 3. Add Environment Variable

In Vercel, add this ONE required variable:

- **Name**: `GEMINI_API_KEY`
- **Value**: Your Google Gemini API key

### 4. Deploy!

Click **"Deploy"** and wait 2-3 minutes.

That's it! Your app is live! 🎉

## After Deployment

1. **Get your URL**: Something like `https://xenorai-xxx.vercel.app`
2. **Update CORS** (optional but recommended):
   - Open `api/index.py`
   - Line 15: Replace `"https://xenorai.vercel.app"` with your actual URL
   - Commit and push (Vercel auto-deploys)

## Test Your Deployment

Visit: `https://your-app.vercel.app`

Test API: `https://your-app.vercel.app/api/health`

## Need More Details?

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete guide.

## Troubleshooting

**Problem**: API not working  
**Solution**: Check that `GEMINI_API_KEY` is set in Vercel environment variables

**Problem**: CORS errors  
**Solution**: Update `api/index.py` with your Vercel domain

**Problem**: Build failed  
**Solution**: Check Vercel build logs and ensure all dependencies are in `package.json`

---

**Local Development**:

```bash
# Backend
cd backend && python main.py

# Frontend (new terminal)
cd frontend && npm run dev
```

Visit: http://localhost:3000
