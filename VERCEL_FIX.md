# Vercel Chatbot Fix

## Problem

The chatbot doesn't work on Vercel deployment.

## Root Cause

Two issues were preventing the chatbot from working:

1. **Incorrect environment variable configuration** - Frontend was calling `localhost:8000` instead of Vercel's serverless function
2. **Outdated Gemini model name** - API route was using `gemini-1.5-flash` instead of `gemini-2.5-flash` (causing 404 errors)

## Solution

### Step 1: Configure Vercel Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables

#### Required Variables:

1. **`GEMINI_API_KEY`** (Production + Preview)
   - Your Google Gemini API key
   - Get it from: https://makersuite.google.com/app/apikey
   - Example: `AIzaSy...`

2. **`NEXT_PUBLIC_API_URL`** (Production + Preview)
   - **IMPORTANT**: Leave this BLANK or DELETE it entirely
   - DO NOT set it to `http://localhost:8000`
   - When blank, the app will use relative URLs (`/api/chat`)

> **Note**: The code has been updated to use `gemini-2.5-flash` model (fixes the 404 error). Make sure to deploy the latest code to Vercel.

### Step 2: Deploy Latest Code Changes

Push the latest code to GitHub (Vercel will auto-deploy) or manually redeploy:

1. **Option A - Push to GitHub** (recommended):

   ```bash
   git add .
   git commit -m "Fix Gemini API model to use gemini-2.5-flash"
   git push
   ```

2. **Option B - Manual Redeploy**:
   - Go to your Vercel dashboard
   - Click **Deployments** tab
   - Click **Redeploy** on your latest deployment (with the updated env vars)
   - Wait for deployment to complete

### Step 3: Test the Chatbot

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Navigate to the chat page
3. Send a test message
4. The chatbot should now respond

## How It Works

The frontend API client (`utils/api.ts`) has smart logic:

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "");
```

**Behavior:**

- **Local Development**: Uses `http://localhost:8000` (calls Python FastAPI backend)
- **Vercel Production**: Uses empty string (calls Next.js API route `/api/chat.ts`)

The Vercel serverless function at `/pages/api/chat.ts` handles chat requests directly using the Gemini REST API.

## Technical Details

### Gemini Model Fix

The API route was updated to use the correct model name:

**Before** (caused 404 error):

```typescript
// ❌ This model doesn't exist in v1beta API
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
```

**After** (working):

```typescript
// ✅ Using gemini-2.5-flash (latest model as of March 2026)
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
```

This matches the backend configuration in `backend/main.py` which also uses `gemini-2.5-flash`.

## Troubleshooting

### If chatbot still doesn't work:

1. **Check Browser Console** (F12):
   - Look for API errors
   - Should call `/api/chat` not `localhost:8000/api/chat`

2. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for errors in the `/api/chat` function
   - Common errors:
     - "GEMINI_API_KEY not configured"
     - "models/gemini-1.5-flash is not found" (old code - needs update)

3. **Verify Environment Variable**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Confirm `GEMINI_API_KEY` is set
   - Confirm `NEXT_PUBLIC_API_URL` is NOT set or is blank

4. **Redeploy After Changes**:
   - Any environment variable change requires a redeploy
   - Click the three dots on latest deployment → Redeploy

## Local Development vs Production

| Environment                  | Backend Used                | API URL                          |
| ---------------------------- | --------------------------- | -------------------------------- |
| **Local** (`localhost:3000`) | Python FastAPI on port 8000 | `http://localhost:8000/api/chat` |
| **Vercel Production**        | Next.js serverless function | `/api/chat` (relative URL)       |

## Summary Checklist

- [ ] Verify latest code is pushed to GitHub (includes `gemini-2.5-flash` model fix)
- [ ] Set `GEMINI_API_KEY` on Vercel
- [ ] Remove or blank out `NEXT_PUBLIC_API_URL` on Vercel
- [ ] Redeploy on Vercel (automatic if using GitHub, or manual)
- [ ] Test chatbot on production URL
- [ ] Check browser console and Vercel logs if issues persist
