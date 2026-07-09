@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:MENU
cls
echo ==========================================
echo       Docker Dev Helper — Batch Menu
echo ==========================================
echo.
echo  [1] Start containers
echo  [2] Stop containers
echo  [3] Run artisan command
echo  [4] Run composer
echo  [5] Run npm
echo  [6] Run tests
echo  [7] Show logs
echo  [8] Exit
echo.
set /p choice="Select an option (1-8): "

if "%choice%"=="1" goto START
if "%choice%"=="2" goto STOP
if "%choice%"=="3" goto ARTISAN
if "%choice%"=="4" goto COMPOSER
if "%choice%"=="5" goto NPM
if "%choice%"=="6" goto TEST
if "%choice%"=="7" goto LOGS
if "%choice%"=="8" goto EOF
goto MENU

:START
echo.
docker compose up -d
echo.
pause
goto MENU

:STOP
echo.
docker compose down
echo.
pause
goto MENU

:ARTISAN
echo.
set /p cmd="php artisan "
docker compose exec php php artisan %cmd%
echo.
pause
goto MENU

:COMPOSER
echo.
set /p cmd="composer "
docker compose exec php composer %cmd%
echo.
pause
goto MENU

:NPM
echo.
set /p cmd="npm "
docker compose exec node npm %cmd%
echo.
pause
goto MENU

:TEST
echo.
set /p cmd="php artisan test "
docker compose exec php php artisan test %cmd%
echo.
pause
goto MENU

:LOGS
echo.
set /p svc="Service name (nginx, php, mysql, phpmyadmin, node): "
docker compose logs -f %svc%
echo.
pause
goto MENU

:EOF
endlocal
