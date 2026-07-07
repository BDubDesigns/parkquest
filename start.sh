#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/tools && npm run db:migrate

echo "Starting ParkQuest..."
exec node /app/server.js
