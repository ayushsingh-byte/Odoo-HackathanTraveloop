#!/bin/bash
set -e

echo "=== Traveloop Setup ==="

if ! command -v mysql &> /dev/null; then
  echo "ERROR: MySQL not found. Install: brew install mysql"
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js not found. Install from nodejs.org"
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env — edit DB_PASS and SESSION_SECRET before running"
fi

echo "Installing dependencies..."
npm install

echo "Setting up database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS traveloop;" 2>/dev/null || true
mysql -u root -p traveloop < sql/schema.sql
mysql -u root -p traveloop < sql/seed.sql

echo ""
echo "=== Setup complete! ==="
echo "1. Edit .env with your MySQL password"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "Default accounts:"
echo "  Admin: admin@traveloop.com / Admin@123"
