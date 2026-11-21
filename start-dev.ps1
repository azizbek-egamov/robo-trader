# XORAZM FOREX (XF COPYTRADE & PROP PLATFORMASI) — ISHGA TUSHIRISH
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   XORAZM FOREX (XF COPYTRADE & PROP)     " -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Cyan

$RootDir = $PSScriptRoot

# 1. Backendni ishga tushirish (Daphne ASGI WebSockets bilan)
Write-Host "[1/2] Backend (Django + Daphne ASGI WebSockets) ishga tushirilmoqda..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootDir\backend'; .\venv\Scripts\python.exe -m daphne -b 127.0.0.1 -p 8000 config.asgi:application"

# 2. Frontendni ishga tushirish (Vite React Dark Mode)
Write-Host "[2/2] Frontend (React + Vite Dark Mode) ishga tushirilmoqda..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootDir\frontend'; npm run dev"

Write-Host "Tayyor! Brauzerda http://localhost:5173 manzilini oching." -ForegroundColor Green
