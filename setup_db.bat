@echo off
net stop postgresql-x64-18
net start postgresql-x64-18
timeout /t 3
cd "C:\Program Files\PostgreSQL\18\bin"
psql.exe -U postgres -h 127.0.0.1 -p 5432 -c "ALTER USER postgres WITH PASSWORD 'admin123';"
psql.exe -U postgres -h 127.0.0.1 -p 5432 -c "CREATE DATABASE newlife_matrimony;"
echo Done!
pause
