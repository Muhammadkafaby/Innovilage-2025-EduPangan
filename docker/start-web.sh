#!/bin/sh
set -e

echo "[WEB] Running Prisma generate..."
npx prisma generate

echo "[WEB] Syncing database schema..."
npx prisma db push --accept-data-loss

echo "[WEB] Seeding database..."
npm run db:seed || echo "[WEB] Seed skipped or already applied"

echo "[WEB] Starting Next.js server..."
npm run start
