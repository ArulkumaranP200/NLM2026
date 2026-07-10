@echo off
net stop postgresql-x64-18
net start postgresql-x64-18
echo PostgreSQL restarted with password auth
pause
