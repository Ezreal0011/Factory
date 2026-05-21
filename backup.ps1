param(
  [string]$DataDir = "",
  [string]$BackupDir = "",
  [int]$Keep = 30
)

$ErrorActionPreference = "Stop"

if ($DataDir) {
  $env:DATA_DIR = $DataDir
}

if ($BackupDir) {
  $env:BACKUP_DIR = $BackupDir
}

$env:BACKUP_KEEP = "$Keep"

node tools/backup-db.mjs
