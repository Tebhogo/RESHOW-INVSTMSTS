@echo off
echo Starting Reshow Backend Server on port 5000...
cd /d "%~dp0"
if not exist .env (
    echo Creating .env file...
    echo PORT=5000 > .env
    echo JWT_SECRET=reshow-secret-key-change-in-production >> .env
    echo SMTP_HOST=smtp.gmail.com >> .env
    echo SMTP_PORT=587 >> .env
    echo SMTP_USER= >> .env
    echo SMTP_PASS= >> .env
)
echo.
echo Server will start on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
npm run dev

