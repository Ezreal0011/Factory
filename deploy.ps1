param(
  [string]$Port = "5174"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  $secret = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
  (Get-Content ".env") `
    -replace "PORT=5174", "PORT=$Port" `
    -replace "SESSION_SECRET=change-this-to-a-long-random-secret", "SESSION_SECRET=$secret" |
    Set-Content ".env"
}

New-Item -ItemType Directory -Force -Path "data" | Out-Null
docker compose up -d --build
Write-Host "Factory server is running: http://localhost:$Port"
