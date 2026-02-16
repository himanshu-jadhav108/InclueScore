@echo off
echo Installing Project Zenith Backend Dependencies...
echo.

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo Error: pip is not available. Please install Python and pip first.
    pause
    exit /b 1
)

echo Installing Python packages...
pip install -r requirements.txt

echo.
echo Installing additional database dependencies...
pip install python-dotenv

echo.
echo Installation completed!
echo.
echo Next steps:
echo 1. Ensure your .env.local file has the correct SUPABASE_URL and SUPABASE_KEY
echo 2. Test database connection: python test_db.py
echo 3. Start the server: python main.py
echo.
pause