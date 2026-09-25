@echo off
rem Sysdash — arranque simplificado para Windows
setlocal
cd /d "%~dp0"

set PORT=8000
set URL=http://127.0.0.1:%PORT%

if not exist "venv\Scripts\python.exe" (
  echo No existe el entorno virtual. Creandolo con py -3...
  py -3 -m venv venv
  if errorlevel 1 (
    echo [ERROR] No se encontro python. Instala Python 3 desde https://python.org
    pause
    exit /b 1
  )
  venv\Scripts\pip install --upgrade pip
  venv\Scripts\pip install -r requirements.txt
)

echo Iniciando Sysdash en %URL%
echo (Ctrl+C para detener)
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start "" %URL%"

venv\Scripts\python -m uvicorn main:app --host 127.0.0.1 --port %PORT%
endlocal