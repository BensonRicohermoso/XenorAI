# XenorAI - Intelligent Chatbot System

A modern, full-stack AI chatbot application with a separated frontend and backend architecture.

## 🌟 Features

- **Modern UI/UX**: Beautiful, responsive design built with Next.js, React, and Tailwind CSS
- **Real-time Chat**: Smooth conversational experience with typing indicators
- **AI-Powered**: Integrated with OpenAI GPT-3.5-turbo for intelligent responses
- **Conversation History**: Maintains context throughout the conversation
- **Error Handling**: Robust error handling on both frontend and backend
- **RESTful API**: Clean FastAPI backend with proper CORS configuration

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** (comes with Node.js)
- **pip** (comes with Python)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## 🚀 Quick Start Guide

### 1️⃣ Clone or Download the Project

```bash
cd XenorAI
```

### 2️⃣ Backend Setup

#### Step 1: Navigate to the backend directory

```bash
cd backend
```

#### Step 2: Create a virtual environment (recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Configure environment variables

```bash
# Copy the example env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux
```

#### Step 5: Edit the `.env` file and add your OpenAI API key

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
HOST=0.0.0.0
PORT=8000
```

#### Step 6: Run the backend server

```bash
python main.py
```

The backend API will be available at `http://localhost:8000`

You should see:

```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3️⃣ Frontend Setup

Open a **new terminal window** and keep the backend running.

#### Step 1: Navigate to the frontend directory

```bash
cd frontend
```

#### Step 2: Install Node.js dependencies

```bash
npm install
# OR if you prefer yarn
yarn install
```

#### Step 3: Configure environment variables (optional)

```bash
# Copy the example env file
copy .env.local.example .env.local  # Windows
# OR
cp .env.local.example .env.local    # macOS/Linux
```

The default API URL is already set to `http://localhost:8000`, but you can modify it in `.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Step 4: Run the development server

```bash
npm run dev
# OR
yarn dev
```

The frontend will be available at `http://localhost:3000`

You should see:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 4️⃣ Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs (Interactive Swagger UI)

## 📁 Project Structure

```
XenorAI/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── .gitignore             # Git ignore file
│
├── frontend/
│   ├── pages/
│   │   ├── index.tsx          # Landing page
│   │   ├── chat.tsx           # Chat interface
│   │   └── _app.tsx           # Next.js app wrapper
│   ├── components/
│   │   ├── ChatWindow.tsx     # Chat message display
│   │   ├── MessageBubble.tsx  # Individual messages
│   │   └── ChatInput.tsx      # Message input field
│   ├── utils/
│   │   └── api.ts             # API communication
│   ├── styles/
│   │   └── globals.css        # Global styles
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.js         # Next.js config
│   └── .env.local.example     # Environment variables template
│
└── README.md                  # This file
```

## 🔧 Technology Stack

### Frontend

- **Next.js 14** - React framework with server-side rendering
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 3** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend

- **FastAPI** - Modern, fast Python web framework
- **OpenAI API** - GPT-3.5-turbo integration
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **python-dotenv** - Environment variable management

## 🎯 Usage

1. **Landing Page**: Visit the home page to see the features and benefits
2. **Start Chat**: Click "Get Started" or "Start Chatting Now"
3. **Send Messages**: Type your message and press Enter or click Send
4. **Clear Chat**: Use the "Clear Chat" button to start a new conversation
5. **View History**: Scroll through your conversation history

## 🔑 API Endpoints

### `GET /`

Health check endpoint

```json
{
  "status": "online",
  "service": "XenorAI Chatbot API",
  "version": "1.0.0"
}
```

### `POST /chat`

Send a message and get AI response

**Request Body:**

```json
{
  "message": "Hello, how are you?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**

```json
{
  "response": "I'm doing well, thank you!...",
  "success": true,
  "error": null
}
```

## 🛠️ Development

### Backend Development

```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm run dev
```

The development server includes:

- Hot Module Replacement (HMR)
- Fast Refresh
- TypeScript type checking

## 📦 Building for Production

### Backend

```bash
cd backend
# The backend can be deployed as-is with:
python main.py
# Or use a production ASGI server like gunicorn
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

### Backend Issues

**OpenAI API Key Error:**

- Make sure your `.env` file exists in the `backend/` directory
- Verify your API key is valid at https://platform.openai.com/api-keys
- Check that the key starts with `sk-`

**Port Already in Use:**

```bash
# Change the port in main.py or run with:
uvicorn main:app --host 0.0.0.0 --port 8001
```

**Module Not Found:**

```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**API Connection Error:**

- Ensure the backend is running on `http://localhost:8000`
- Check your `.env.local` file has the correct `NEXT_PUBLIC_API_URL`
- Verify CORS settings in backend `main.py`

**Port Already in Use:**

```bash
# Next.js will automatically try the next available port (3001, 3002, etc.)
# Or specify a port:
npm run dev -- -p 3001
```

**Dependencies Issues:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules & del package-lock.json  # Windows
npm install
```

## 🚀 Deployment Options

### Backend

- **Heroku**: Easy Python app deployment
- **Railway**: Modern deployment platform
- **AWS EC2**: Full control over infrastructure
- **Google Cloud Run**: Serverless container deployment
- **DigitalOcean App Platform**: Simple PaaS

### Frontend

- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: JAMstack platform
- **AWS Amplify**: Full-stack deployment
- **Cloudflare Pages**: Fast edge deployment

## 📝 Environment Variables

### Backend (.env)

```env
OPENAI_API_KEY=your_api_key_here
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available for personal and commercial use.

## 🎉 Acknowledgments

- OpenAI for the GPT API
- Next.js team for the amazing framework
- FastAPI for the modern Python web framework
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure both frontend and backend are running
4. Check the console for error messages

---

**Made with ❤️ using Next.js, React, FastAPI, and OpenAI**
