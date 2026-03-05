#!/bin/sh
set -e

echo "[WEB] Running Prisma generate..."
npx prisma generate

echo "[WEB] Running Prisma migrations..."
npx prisma migrate deploy

echo "[WEB] Starting Next.js server..."
npm run start
