# Vercel Deployment Guide for XenorAI

This guide will walk you through deploying your XenorAI application to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Google Gemini API Key**: Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Project Structure

```
XenorAI/
├── api/                  # Serverless backend (Vercel Functions)
│   ├── index.py         # FastAPI application
│   └── requirements.txt # Python dependencies
├── frontend/            # Next.js application
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── package.json
├── vercel.json          # Vercel configuration
└── .vercelignore        # Files to ignore during deployment
```

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Prepare for Vercel deployment"

# Add your remote repository
git remote add origin https://github.com/yourusername/xenorai.git

# Push to GitHub
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js in the `frontend/` directory

### 3. Configure Build Settings

Vercel should auto-configure, but verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4. Configure Environment Variables

In the Vercel dashboard, add these environment variables:

#### Required Variables:

- **`GEMINI_API_KEY`**: Your Google Gemini API key (REQUIRED)
  - Get from: https://makersuite.google.com/app/apikey
  - Example: `AIzaSy...`

#### Frontend Variables:

- **`NEXT_PUBLIC_API_URL`**: **IMPORTANT - Leave this BLANK or DO NOT set it**
  - When blank/unset, the app uses relative URLs to call Vercel serverless functions
  - DO NOT set to `http://localhost:8000` on Vercel
  - Only set in local `.env.local` for development

#### Optional Database Variables (if using MySQL):

- **`DB_HOST`**: Your MySQL host (e.g., from PlanetScale or Railway)
- **`DB_PORT`**: Database port (default: 3306)
- **`DB_USER`**: Database username
- **`DB_PASSWORD`**: Database password
- **`DB_NAME`**: Database name (default: xenorai_db)

**Note:** Currently, the Vercel deployment uses serverless functions without database. Database variables are only needed if you integrate MySQL support into the Next.js API route.

### 5. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies for both frontend and backend
   - Build the Next.js application
   - Deploy serverless functions from `/api`
   - Provide you with a deployment URL

### 6. Update CORS Settings (After First Deploy)

After your first deployment, get your Vercel URL (e.g., `https://xenorai.vercel.app`), then:

1. Update `api/index.py` line 15:

   ```python
   allow_origins=[
       "http://localhost:3000",
       "http://localhost:3001",
       "https://*.vercel.app",
       "https://your-actual-domain.vercel.app"  # Add your domain here
   ],
   ```

2. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update CORS for production domain"
   git push
   ```

Vercel will automatically redeploy.

## Database Configuration (Optional)

Since Vercel Serverless Functions don't support persistent MySQL connections, you have two options:

### Option 1: Use a Serverless Database (Recommended)

Use a cloud MySQL service:

- **PlanetScale**: https://planetscale.com (MySQL-compatible, serverless)
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com (PostgreSQL)

### Option 2: Run Without Database

The current deployment uses only the Gemini API without database features. The conversation history is maintained in the frontend state.

## Verifying Deployment

### Test Your Endpoints:

1. **Health Check**:

   ```
   https://your-app.vercel.app/api/health
   ```

2. **Chat API**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello", "conversation_history": []}'
   ```

### Check Logs:

- Go to Vercel Dashboard → Your Project → "Functions"
- Click on `/api/index` to see serverless function logs

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update CORS in `api/index.py` with your custom domain

## Troubleshooting

### Issue: API not responding

**Solution**: Check Vercel function logs and ensure environment variables are set correctly.

### Issue: CORS errors

**Solution**: Update `allow_origins` in `api/index.py` to include your production domain.

### Issue: Module not found errors

**Solution**: Ensure `api/requirements.txt` includes all necessary dependencies.

### Issue: Build failures

**Solution**:

- Check the build logs in Vercel dashboard
- Ensure `frontend/package.json` has all dependencies
- Verify Node.js version compatibility

## Local Development vs Production

### Local Development:

```bash
# Backend (Terminal 1)
cd backend
python main.py

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production:

- Frontend: Vercel handles automatically
- Backend: Runs as serverless functions on Vercel

## Environment Variables Summary

Create a `.env.local` file in `frontend/` for local development:

```env
# Frontend .env.local (local development only)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create a `.env` file in `backend/` for local development:

```env
# Backend .env (local development only)
GEMINI_API_KEY=your_gemini_api_key_here
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=xenorai_db
```

**Note**: Never commit `.env` files to GitHub! They're in `.gitignore`.

## Continuous Deployment

Once connected to GitHub, Vercel automatically:

- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Runs builds and tests before deployment

## Monitoring

Monitor your deployment:

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → View Function Logs
- **Performance**: Vercel Dashboard → Speed Insights

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- FastAPI on Vercel: https://vercel.com/docs/functions/serverless-functions/runtimes/python

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Set up error tracking (Sentry, etc.)
5. Optimize for production (caching, CDN, etc.)

---

**Your XenorAI app is now live on Vercel! 🚀**
