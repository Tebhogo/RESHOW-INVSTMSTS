@echo off
echo Starting Reshow Investments Application...
echo.

cd server
start "Reshow Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

cd ..\client
start "Reshow Client" cmd /k "npm start"

echo.
echo Application started!
echo Server: http://localhost:5000
echo Client: http://localhost:3000
pause
