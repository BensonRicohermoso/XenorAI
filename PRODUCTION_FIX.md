# Production Connection Fix

## Issue

Frontend showing: "Unable to connect to the server. Please check your internet connection and ensure the backend is running."

## Root Cause

The frontend was trying to connect to `http://localhost:8000` in production instead of using Vercel's serverless API routes.

## Solution Applied

Updated `frontend/utils/api.ts` to automatically detect the environment:

- **Local development**: Uses `http://localhost:8000`
- **Production (Vercel)**: Uses relative URLs (e.g., `/api/chat`)

## What Changed

```typescript
// Before
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// After
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "");
```

## Vercel Environment Variables

**You do NOT need to set `NEXT_PUBLIC_API_URL` in Vercel.**

The app will automatically use relative URLs in production, which route to your serverless functions.

## If You Already Deployed

1. The changes are now in your repository
2. Vercel will automatically redeploy on the next push
3. OR manually trigger a redeploy in Vercel dashboard

## Next Steps

Push these changes:

```bash
git add .
git commit -m "Fix production API connection - use relative URLs"
git push
```

Vercel will automatically redeploy and the error will be fixed! 🚀
