#!/bin/zsh
set -e

cd "/Users/stephaneprudhomme/Desktop/codex"

if [ ! -d "node_modules" ]; then
  echo "Installing app dependencies..."
  npm install --no-audit --no-fund
fi

echo "Starting EduBoost..."
echo "Leave this window open while using the app."
echo ""
npm run dev
