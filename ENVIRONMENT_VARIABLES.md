# Environment Variables Setup Guide

## Overview

XenorAI uses environment variables for configuration. Different environments require different setup.

## Local Development

### Backend Environment Variables

Create `backend/.env`:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=xenorai_db
```

**How to get GEMINI_API_KEY:**

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
# API Base URL (points to local backend)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Vercel Production Deployment

Configure these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

### Required Variables

| Variable         | Value           | Description                            |
| ---------------- | --------------- | -------------------------------------- |
| `GEMINI_API_KEY` | `your_key_here` | Google Gemini API key for AI responses |

### Optional Variables (if using database)

| Variable      | Value           | Description                    |
| ------------- | --------------- | ------------------------------ |
| `DB_HOST`     | `your_host`     | MySQL host (e.g., PlanetScale) |
| `DB_PORT`     | `3306`          | MySQL port                     |
| `DB_USER`     | `your_user`     | Database username              |
| `DB_PASSWORD` | `your_password` | Database password              |
| `DB_NAME`     | `xenorai_db`    | Database name                  |

### Frontend Variables (Optional)

| Variable              | Value                        | Description                                  |
| --------------------- | ---------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Leave empty or set to domain | API base URL (leave empty for relative URLs) |

## Environment-Specific Behavior

### Local Development

- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Both read from local `.env` files

### Vercel Production

- Backend runs as serverless functions at `/api/*`
- Frontend is deployed as static Next.js site
- Both read from Vercel environment variables

## Security Best Practices

### ✅ DO:

- Keep `.env` files in `.gitignore`
- Use different API keys for development and production
- Rotate API keys regularly
- Use environment-specific credentials

### ❌ DON'T:

- Commit `.env` files to Git
- Share API keys publicly
- Use production keys in development
- Expose keys in client-side code

## Variable Naming Conventions

- **Backend variables**: Regular names (e.g., `GEMINI_API_KEY`)
- **Frontend variables**: Must start with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_API_URL`)
  - Only `NEXT_PUBLIC_*` variables are exposed to the browser
  - Other variables are server-side only

## Testing Your Configuration

### Test Backend Locally:

```bash
cd backend
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('GEMINI_API_KEY:', 'Set' if os.getenv('GEMINI_API_KEY') else 'Missing')"
```

### Test Frontend Locally:

```bash
cd frontend
npm run dev
# Check browser console for API_BASE_URL
```

### Test Vercel Deployment:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Check if Gemini is configured
curl https://your-app.vercel.app/api/health | grep "gemini_configured"
```

## Troubleshooting

### "GEMINI_API_KEY environment variable must be set"

**Problem**: API key is missing or not loaded  
**Solution**:

1. Check if `.env` file exists in `backend/` directory
2. Verify the key is correctly set: `GEMINI_API_KEY=your_key`
3. Ensure no spaces around the `=` sign
4. Restart the backend server

### "Unable to connect to the server"

**Problem**: Frontend can't reach backend  
**Solution**:

1. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
2. Verify backend is running on the correct port
3. Restart frontend server: `npm run dev`

### Vercel: "Module not found" or API errors

**Problem**: Environment variables not set in Vercel  
**Solution**:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all required variables
3. Redeploy: Dashboard → Deployments → ⋯ → Redeploy

### Vercel: CORS errors

**Problem**: Production domain not whitelisted  
**Solution**:

1. Update `api/index.py` CORS settings with your Vercel domain
2. Commit and push changes

## Quick Reference

### Start Local Development:

```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Python dotenv Documentation](https://pypi.org/project/python-dotenv/)

---

**Need help?** Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for full deployment guide.
