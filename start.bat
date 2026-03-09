@echo off
echo ================================
echo XenorAI Quick Start Script
echo ================================
echo.

echo Step 1: Setting up Backend...
echo --------------------------------
cd backend
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate

echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo ⚠️  IMPORTANT: Before starting the servers...
echo 1. Copy backend\.env.example to backend\.env
echo 2. Add your Gemini API key to backend\.env
echo 3. Add your MySQL password to backend\.env
echo.
pause

echo.
echo Starting Backend Server...
start cmd /k "cd /d %CD% && venv\Scripts\activate && python main.py"

cd ..

echo.
echo Step 2: Setting up Frontend...
echo --------------------------------
cd frontend

echo Installing frontend dependencies...
call npm install

echo.
echo Starting Frontend Server...
start cmd /k "cd /d %CD% && npm run dev"

cd ..

echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
