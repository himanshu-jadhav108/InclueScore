@echo off
echo ========================================
echo     Project Zenith Setup Script
echo     Dynamic Credit Scoring System
echo ========================================
echo.

REM Get the current directory to use absolute paths
set SCRIPT_DIR=%~dp0
echo Working from directory: %SCRIPT_DIR%

echo Step 1: Setting up Backend...
cd /d "%SCRIPT_DIR%backend"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and add it to your PATH
    pause
    exit /b 1
)

echo Creating virtual environment...
if exist "venv" (
    echo Virtual environment already exists. Skipping creation.
) else (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo Generating training data...
python data_generator.py
if errorlevel 1 (
    echo WARNING: Failed to generate training data
)

echo Training initial ML model...
python model.py
if errorlevel 1 (
    echo WARNING: Failed to train initial model
)

echo Starting FastAPI server...
start "Zenith Backend" cmd /k "call venv\Scripts\activate && python main.py"

echo.
echo Step 2: Setting up Frontend...
cd /d "%SCRIPT_DIR%frontend"

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js and npm, then run this script again
    pause
    exit /b 1
)

echo Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo Starting React development server...
start "Zenith Frontend" cmd /k "npm start"

echo.
echo ========================================
echo     Setup Complete!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo.
echo Both servers are starting in separate windows.
echo Wait for both to fully load before using the application.
echo.
echo If you encounter any issues:
echo 1. Check that Python 3.8+ is installed
echo 2. Check that Node.js and npm are installed
echo 3. Ensure ports 3000 and 8000 are available
echo.
pause