#!/usr/bin/env bash
set -euo pipefail

export BACKUP_KEEP="${BACKUP_KEEP:-30}"

node tools/backup-db.mjs
