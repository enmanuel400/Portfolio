@echo off
rem Vellum - arranque simplificado (Windows)
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo [ERROR] No se pudo instalar. Revisa que Node.js este instalado.
    pause
    exit /b 1
  )
)

echo Compilando la interfaz...
call npm run build
if errorlevel 1 (
  echo [ERROR] Fallo la compilacion.
  pause
  exit /b 1
)

echo Iniciando Vellum (Electron)...
call npm run desktop
endlocal