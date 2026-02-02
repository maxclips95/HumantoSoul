# Simple Production Start Script
Write-Host "Starting Jai Gurudev - Production Mode" -ForegroundColor Green
Write-Host "Building Production Build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Server..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
cd server
node server.js
