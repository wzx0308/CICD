#!/bin/bash

set -e

APP_DIR="/var/www/api4"
NODE_USER="www-data"
NODE_GROUP="www-data"

echo "======= Deploying API ======="

# Navigate to app directory
cd $APP_DIR

# Stop existing PM2 process
if pm2 list | grep -q api4; then
    echo "Stopping existing PM2 process..."
    pm2 stop api4
    pm2 delete api4
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Ensure upload directory exists
mkdir -p $APP_DIR/upload
chown -R $NODE_USER:$NODE_GROUP $APP_DIR

# Start with PM2
echo "Starting API with PM2..."
pm2 start ecosystem.config.js --name api4

# Save PM2 state
pm2 save

# Setup PM2 startup
pm2 startup

echo "======= API Deployed Successfully ======="

# Health check
sleep 3
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo "API is running and responding"
else
    echo "Warning: API may not be responding correctly"
    pm2 logs api4 --lines 20
fi