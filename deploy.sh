#!/bin/bash

# Certificate Verification System - Deployment Script
# Server: arabainsafety.com (5.189.163.66)

SERVER="root@5.189.163.66"
DOMAIN="arabainsafety.com"
FRONTEND_DIR="/var/www/arabainsafety.com"
BACKEND_DIR="/var/www/arabainsafety.com/backend"

echo "🚀 Starting deployment to $DOMAIN..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Deploy frontend
echo "📤 Deploying frontend..."
ssh $SERVER "mkdir -p $FRONTEND_DIR"
scp -r dist/* $SERVER:$FRONTEND_DIR/

# Deploy backend
echo "📤 Deploying backend..."
ssh $SERVER "mkdir -p $BACKEND_DIR"
scp -r backend/* $SERVER:$BACKEND_DIR/

# Install backend dependencies
echo "📦 Installing backend dependencies..."
ssh $SERVER "cd $BACKEND_DIR && npm install --production"

# Setup nginx configuration
echo "⚙️  Setting up nginx..."
scp nginx-api-proxy.conf $SERVER:/etc/nginx/sites-available/arabainsafety.com

# Enable site and restart nginx
ssh $SERVER << 'ENDSSH'
# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Enable arabainsafety.com site
ln -sf /etc/nginx/sites-available/arabainsafety.com /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx

# Setup PM2 for backend
cd /var/www/arabainsafety.com/backend

# Stop existing process if running
pm2 stop certificate-api 2>/dev/null || true
pm2 delete certificate-api 2>/dev/null || true

# Start backend with PM2
pm2 start server.js --name certificate-api
pm2 save
pm2 startup

echo "✅ Deployment complete!"
ENDSSH

echo "✅ Deployment finished!"
echo "🌐 Frontend: https://$DOMAIN"
echo "🔌 Backend API: https://$DOMAIN/api"
echo ""
echo "To check backend status: ssh $SERVER 'pm2 status'"
echo "To view backend logs: ssh $SERVER 'pm2 logs certificate-api'"
