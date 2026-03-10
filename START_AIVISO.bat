@echo off
TITLE Aiviso AI Management System
echo ==========================================
echo Starting AI BASED INTELLIGENT CODE REVIEW
echo ==========================================

:: Kill any existing processes on port 5001
echo [1/3] Clearing environment...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5001') do taskkill /F /PID %%a 2>nul

echo [2/3] Starting Backend (Port 5001)...
cd backend
start /b cmd /c ".\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 5001"

echo [3/3] Starting Frontend...
cd ../frontend
npm run dev

echo ==========================================
echo System is booting... Please wait.
echo ==========================================
pause
