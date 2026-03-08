# XenorAI - Quick Setup Checklist

Follow these steps to get your chatbot running:

## ✅ Checklist

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Python 3.8+ installed
- [ ] OpenAI API key obtained from https://platform.openai.com/api-keys

### Backend Setup (5 minutes)

- [ ] Navigate to `backend/` directory
- [ ] Create Python virtual environment: `python -m venv venv`
- [ ] Activate virtual environment:
  - Windows: `venv\Scripts\activate`
  - Mac/Linux: `source venv/bin/activate`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Copy `.env.example` to `.env`
- [ ] Add your OpenAI API key to `.env`
- [ ] Run backend: `python main.py`
- [ ] Verify backend is running at http://localhost:8000

### Frontend Setup (5 minutes)

- [ ] Open new terminal window
- [ ] Navigate to `frontend/` directory
- [ ] Install dependencies: `npm install`
- [ ] (Optional) Copy `.env.local.example` to `.env.local`
- [ ] Run frontend: `npm run dev`
- [ ] Verify frontend is running at http://localhost:3000

### Testing

- [ ] Open http://localhost:3000 in browser
- [ ] Click "Get Started" button
- [ ] Send a test message
- [ ] Verify you receive an AI response

## 🎯 Quick Start (Automated)

### Windows

```bash
start.bat
```

### Mac/Linux

```bash
chmod +x start.sh
./start.sh
```

## 📍 Important URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔑 API Key Setup

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

## ⚠️ Common Issues

**Backend won't start?**

- Check if Python is installed: `python --version`
- Verify virtual environment is activated
- Ensure all dependencies installed: `pip install -r requirements.txt`
- Check if API key is set in `.env`

**Frontend won't start?**

- Check if Node.js is installed: `node --version`
- Delete `node_modules` and reinstall: `npm install`
- Check if port 3000 is available

**Can't connect to API?**

- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `.env.local` has correct API URL

## 📚 Next Steps

1. ✅ Complete the setup
2. 🧪 Test the chatbot
3. 🎨 Customize the UI in `frontend/components/`
4. 🤖 Modify AI behavior in `backend/main.py`
5. 🚀 Deploy to production

## 📞 Need Help?

Check the main README.md for detailed instructions and troubleshooting.
