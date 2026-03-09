# Security Guide - Hide Sensitive Data

## ✅ ALREADY PROTECTED

Your sensitive data is **already safe**:

- `.env` files are in `.gitignore` ✓
- Only `.env.example` (no real keys) is tracked ✓
- Real credentials in `backend/.env` are NOT tracked ✓

## 🔒 What's Protected

### Files NOT pushed to GitHub:

- `backend/.env` - Contains:
  - DB_PASSWORD: `your_mysql_password`
  - GEMINI_API_KEY: `your_gemini_api_key`
- `frontend/.env.local`
- `node_modules/`, `__pycache__/`, `.venv/`

### Files SAFE to push:

- `backend/.env.example` - Placeholder values only
- `frontend/.env.local.example` - No real keys

## ⚠️ Before Pushing to GitHub

### 1. Verify Protection

```bash
git status
```

Should NOT show `.env` files (only `.env.example` is ok)

### 2. Check What Will Be Committed

```bash
git add .
git status
```

If you see `backend/.env` or any file with real keys → STOP!

### 3. If Accidentally Added

```bash
git reset backend/.env
```

### 4. Safe Push Commands

```bash
git add .
git commit -m "Update chatbot with Gemini API"
git push origin main
```

## 🚨 If Already Pushed Secrets

### Immediate Actions:

1. **Revoke API Keys**
   - Gemini: https://makersuite.google.com/app/apikey
   - OpenAI: https://platform.openai.com/api-keys

2. **Change MySQL Password**

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'NEW_PASSWORD';
   ```

3. **Update `.env`** with new credentials

4. **Remove from Git History**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" --prune-empty --tag-name-filter cat -- --all
   ```

## 📋 Team Setup Instructions

When someone clones your repo:

```bash
# 1. Clone repo
git clone <your-repo-url>

# 2. Copy example files
cd backend
cp .env.example .env

# 3. Add real credentials to .env
# Edit .env with their own API keys and passwords
```

## 🔑 Environment Variables Summary

**Never commit:**

- API Keys (Gemini, OpenAI)
- Database Passwords
- Secret Keys
- Tokens
- Certificates (`.pem` files)

**Always commit:**

- `.gitignore`
- `.env.example` (placeholders only)
- Documentation

## ✓ Current Status

Your setup is **SECURE**:

- ✅ .gitignore configured correctly
- ✅ .env files excluded from Git
- ✅ Example files use placeholders
- ✅ No secrets in tracked files

## Quick Check Command

```bash
# See what Git is tracking
git ls-files | Select-String "\.env"

# Should only show:
# backend/.env.example
# frontend/.env.local.example
```

**You're good to push to GitHub safely!** 🎉
