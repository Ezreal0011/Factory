#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"
PORT_VALUE="${PORT:-5174}"

if [ ! -f ".env" ]; then
  cp .env.example .env
  SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")"
  sed -i "s/PORT=5174/PORT=${PORT_VALUE}/" .env
  sed -i "s/SESSION_SECRET=change-this-to-a-long-random-secret/SESSION_SECRET=${SECRET}/" .env
fi

mkdir -p data
docker compose up -d --build
echo "Factory server is running: http://localhost:${PORT_VALUE}"
