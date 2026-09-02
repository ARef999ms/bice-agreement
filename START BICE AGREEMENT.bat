@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo Node.js is not installed.
    echo Please install Node.js first.
    echo.
    pause
    exit /b
)

start "" /min cmd /c "node server.js"

timeout /t 2 /nobreak >nul

start "" "http://127.0.0.1:3000"

exit
