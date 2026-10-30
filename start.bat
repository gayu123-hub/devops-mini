@echo off
title MediCare Web Server
echo ========================================================
echo   MediCare - Smart Doctor Appointment System
echo   Starting local development server on port 3000...
echo ========================================================
echo.
start http://localhost:3000
py -m http.server 3000
if %errorlevel% neq 0 (
    python -m http.server 3000
)
pause
