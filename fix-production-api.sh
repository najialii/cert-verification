#!/bin/bash

echo "=== Fixing Production API Configuration ==="
echo ""

SERVER="root@5.189.163.66"

echo "1. Uploading nginx configuration..."
scp nginx-api-proxy.conf $SERVER:/tmp/arabainsafety.com.conf

echo ""
echo "2. Installing nginx configuration..."
ssh $SERVER << 'ENDSSH'
    # Backup existing config if it exists
    if [ -f /etc/nginx/sites-available/arabainsafety.com ]; then
        cp /etc/nginx/sites-available/arabainsafety.com /etc/nginx/sites-available/arabainsafety.com.backup
    fi
    
    # Install new config
    mv /tmp/arabainsafety.com.conf /etc/nginx/sites-available/arabainsafety.com
    
    # Enable site
    ln -sf /etc/nginx/sites-available/arabainsafety.com /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    echo "Testing nginx configuration..."
    nginx -t
    
    if [ $? -eq 0 ]; then
        echo "Nginx configuration is valid. Reloading..."
        systemctl reload nginx
        echo "✓ Nginx reloaded successfully"
    else
        echo "✗ Nginx configuration test failed!"
        exit 1
    fi
    
    # Check if backend is running
    echo ""
    echo "Checking backend status..."
    pm2 status
    
    # Test backend
    echo ""
    echo "Testing backend API..."
    curl -s http://localhost:3001/health
    echo ""
ENDSSH

echo ""
echo "3. Testing production API..."
curl -s "https://arabainsafety.com/api/content/items/certificates?filter[certienum]=AT0116960" | head -c 200
echo ""

echo ""
echo "=== Done! ==="
echo "The production site should now use the Node.js backend."
echo "Try searching for AT0116960 on https://arabainsafety.com"
