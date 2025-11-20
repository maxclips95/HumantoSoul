@echo off
setlocal enabledelayedexpansion

:: ==================================
:: AUTO DETECT PROJECT DIRECTORY
:: ==================================
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

:: ==================================
:: RESET BROKEN GIT COMPLETELY
:: ==================================
if exist ".git" (
    rmdir /s /q .git
)

git init >nul

:: ==================================
:: CREATE CLEAN .gitignore
:: ==================================
echo node_modules/ > .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore
echo .env >> .gitignore
echo .aider* >> .gitignore

:: ==================================
:: ADD PROJECT FILES
:: ==================================
git add .
git commit -m "auto setup" >nul

:: ==================================
:: CREATE AUTO AIDER COMMAND SCRIPT
:: This will run *inside* Aider automatically
:: ==================================
(
echo /add .
) > aider_auto_commands.txt

:: ==================================
:: START AIDER WITH AUTO COMMAND PIPE
:: ==================================
start powershell -NoExit -Command "cd '%PROJECT_DIR%'; Get-Content 'aider_auto_commands.txt' | aider --yes-always --model openai/local --openai-api-base http://127.0.0.1:1234/v1 --openai-api-key lmstudio ."

exit
