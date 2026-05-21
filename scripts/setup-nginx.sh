#!/bin/bash

set -e

NGINX_CONF="/etc/nginx/sites-available/app"
NGINX_ENABLED="/etc/nginx/sites-enabled/app"
WEB_ROOT="/var/www/react"
API_PORT=3000

echo "======= Setting up Nginx ======="

# Create nginx config
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN:-localhost};

    root $WEB_ROOT;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # React static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Upload files
    location /upload/ {
        alias /var/www/api4/upload/;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable site
sudo ln -sf $NGINX_CONF $NGINX_ENABLED

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "======= Nginx Configured Successfully ======="