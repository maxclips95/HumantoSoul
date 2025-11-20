# AUTO ADD EVERY SOURCE FILE TO AIDER
Write-Host "Adding all project files to Aider..."

$exclude = @(
    "node_modules",
    ".git",
    ".aider*",
    "build",
    "dist"
)

Get-ChildItem -Recurse -File | Where-Object {
    $path = $_.FullName
    foreach ($ex in $exclude) {
        if ($path -like "*\$ex\*") { return $false }
    }
    return $true
} | ForEach-Object {
    $file = $_.FullName
    Write-Host "Adding: $file"
    Write-Output "/add $file"
}
