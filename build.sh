#!/usr/bin/env bash
# exit on error
set -o errexit

# Build Frontend
cd frontend
npm install
npm run build
cd ..

# Build Backend
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
cd..