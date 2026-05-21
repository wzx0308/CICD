#!/bin/bash

set -e

echo "======= Initial Server Setup ======="

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js
node --version
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup
sudo pm2 startup systemd

# Install Nginx
sudo apt-get install -y nginx

# Create web directories
sudo mkdir -p /var/www/api4
sudo mkdir -p /var/www/react

# Set permissions
sudo chown -R www-data:www-data /var/www

# Enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Firewall (optional)
sudo ufw allow 'Nginx Full'

echo "======= Server Setup Complete ======="
echo "Node version: $(node --version)"
echo "PM2 installed: $(pm2 --version)"
echo "Nginx status: $(systemctl is-active nginx)"