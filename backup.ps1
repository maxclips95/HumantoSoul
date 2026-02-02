# Backup Script for Jai Gurudev Website
# This script creates a zip file of your entire website (Database + Photos + Code)

$projectName = "jai_gurudev_backup"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFileName = "$projectName`_$timestamp.zip"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Jai Gurudev Website - Backing up... " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Define what to include and what to exclude
$includePaths = @(
    "server/database.db",
    "server/uploads/",
    "server/server.js",
    "server/database.js",
    "server/package.json",
    "src/",
    "public/",
    "package.json",
    "master_blueprint.md",
    "requirements.txt",
    ".env",
    "start.ps1",
    "stop.ps1",
    "SCALING_GUIDE.txt"
)

$tempFolder = "temp_backup"

# 1. Preparation
if (Test-Path $tempFolder) { Remove-Item -Path $tempFolder -Recurse -Force }
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Step 1: Copying all folders and files (excluding bulky modules)..." -ForegroundColor Gray

# Copy everything except node_modules and previous backups
Get-ChildItem -Path . -Exclude "node_modules", "*.zip", "temp_backup", ".git", ".vscode" | ForEach-Object {
    $dest = Join-Path $tempFolder $_.Name
    Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force -Exclude "node_modules"
}

# 3. Zip the backup
Write-Host "Step 2: Creating $backupFileName..." -ForegroundColor Yellow
if (Test-Path $backupFileName) { Remove-Item $backupFileName }
Compress-Archive -Path "$tempFolder\*" -DestinationPath $backupFileName

# 4. Cleanup
Write-Host "Step 3: Cleaning up..." -ForegroundColor Gray
Remove-Item -Path $tempFolder -Recurse -Force

Write-Host "========================================" -ForegroundColor Green
Write-Host "   BACKUP COMPLETED SUCCESSFULLY!      " -ForegroundColor Green
Write-Host "   File: $backupFileName             " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Keep this zip file in a safe place (Google Drive or Pen Drive)."
