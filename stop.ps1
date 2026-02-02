# Stop Script for Jai Gurudev Website
# Run this from the project root folder

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Jai Gurudev Website - Stopping...   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Function to kill process by port
function Kill-Port($port) {
    $listening = netstat -ano | findstr ":$port" | findstr "LISTENING"
    if ($listening) {
        $process_id = ($listening -split '\s+')[-1]
        Write-Host "Found process on port $port (PID: $process_id). Killing..." -ForegroundColor Yellow
        taskkill /PID $process_id /F | Out-Null
    }
}

# 1. Kill Specific Ports
Kill-Port 3000
Kill-Port 5000

# 2. General Cleanup of Node processes
# Ideally we only kill our own, but for a dev machine, killing node.exe is the surest way to stop ghosts.
Write-Host "Cleaning up any remaining Node.js processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null

Start-Sleep -Seconds 1

Write-Host "========================================" -ForegroundColor Green
Write-Host "   All Services Stopped Successfully!  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
