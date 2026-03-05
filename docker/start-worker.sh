#!/bin/sh
set -e

echo "[AI WORKER] Running Prisma generate..."
npx prisma generate

echo "[AI WORKER] Starting scheduler..."
npm run ai:worker
