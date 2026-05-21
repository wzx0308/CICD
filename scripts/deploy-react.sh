#!/bin/bash

set -e

REACT_DIR="/var/www/react"
NODE_USER="www-data"
NODE_GROUP="www-data"

echo "======= Deploying React ======="

# Navigate to react directory
cd $REACT_DIR

# Ensure directory exists
mkdir -p $REACT_DIR

# Set permissions
chown -R $NODE_USER:$NODE_GROUP $REACT_DIR

echo "======= React Deployed Successfully ======="

# Verify deployment
if [ -f "$REACT_DIR/index.html" ]; then
    echo "index.html found - deployment successful"
else
    echo "Warning: index.html not found"
fi