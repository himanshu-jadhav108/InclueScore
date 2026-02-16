@echo off
echo ========================================
echo     Project Zenith - Starting Servers
echo     Dynamic Credit Scoring System
echo ========================================
echo.

REM Get the current directory to use absolute paths
set SCRIPT_DIR=%~dp0
echo Working from directory: %SCRIPT_DIR%

echo Starting Backend Server...
cd /d "%SCRIPT_DIR%backend"

REM Check if virtual environment exists
if not exist "venv" (
    echo ERROR: Virtual environment not found
    echo Please run setup.bat first to initialize the project
    pause
    exit /b 1
)

echo Activating virtual environment and starting FastAPI server...
start "Zenith Backend" cmd /k "call venv\Scripts\activate && python main.py"

echo.
echo Starting Frontend Server...
cd /d "%SCRIPT_DIR%frontend"

echo Starting React development server...
start "Zenith Frontend" cmd /k "npm start"

echo.
echo ========================================
echo     Servers Starting!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo.
echo Both servers are starting in separate windows.
echo Wait for both to fully load before using the application.
echo.
pause