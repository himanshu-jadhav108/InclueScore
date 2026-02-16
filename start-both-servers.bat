@echo off
echo.
echo ========================================
echo   Project Zenith - Multi-User Platform
echo ========================================
echo.

echo Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "python main.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Wait for both servers to fully start,
echo then open http://localhost:3000 in your browser
echo.
echo Press any key to exit this window...
pause > nul