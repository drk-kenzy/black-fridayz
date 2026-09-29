@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installation des dependances...
  call npm install
)
echo Demarrage de StyleVibe sur http://localhost:5173
start "" http://localhost:5173
call npm run dev
