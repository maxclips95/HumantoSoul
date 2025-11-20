@echo off
title Aider Auto Setup - Full Project Access
echo ================================================
echo     AUTO AIDER SETUP - FULL PROJECT ACCESS
echo ================================================
echo.

REM --- SET YOUR PROJECT FOLDER HERE ---
set PROJECT=C:\Users\Administrator\Desktop\jai-gurudev-clone

REM --- LM STUDIO API ---
set OPENAI_API_KEY=lmstudio
set OPENAI_API_BASE=http://127.0.0.1:1234/v1

echo Project Folder: %PROJECT%
echo API Base: %OPENAI_API_BASE%
echo.

echo Starting Aider...
echo (Do NOT close this window)

cd %PROJECT%

REM --- CREATE TEMP FILE WITH /add COMMANDS ---
powershell -Command ^
  "$exclude = @('node_modules','.git','.aider*','build','dist');" ^
  "Get-ChildItem -Recurse -File | Where-Object {" ^
  "  $path=$_.FullName;" ^
  "  foreach ($ex in $exclude) { if ($path -like \"*\\$ex\\*\") {return $false} }" ^
  "  return $true" ^
  "} | ForEach-Object {" ^
  "  Write-Output \"/add $($_.FullName)\"" ^
  "} | Set-Content add-files.txt"

echo ================================================
echo Auto-generating file add list: add-files.txt
echo ================================================
echo.

REM --- START AIDER + FEED ALL FILES AUTOMATICALLY ---
type add-files.txt | aider --model "openai/local" --openai-api-base %OPENAI_API_BASE% --api-key openai=%OPENAI_API_KEY%

echo.
echo DONE. Aider now has FULL project access.
pause
