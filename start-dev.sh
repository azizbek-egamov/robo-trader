#!/usr/bin/env bash
# XORAZM FOREX (XF COPYTRADE & PROP PLATFORMASI) — ISHGA TUSHIRISH
echo "=========================================="
echo "   XORAZM FOREX (XF COPYTRADE & PROP)     "
echo "=========================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Backend
echo "[1/2] Backend (Django + Daphne ASGI) ishga tushirilmoqda..."
cd "$DIR/backend"
source venv/bin/activate
python -m daphne -b 127.0.0.1 -p 8000 config.asgi:application &

# Frontend
echo "[2/2] Frontend (React + Vite) ishga tushirilmoqda..."
cd "$DIR/frontend"
npm run dev &

wait
