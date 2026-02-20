# Deployment Guide for arabainsafety.com

Server: `5.189.163.66`
Domain: `arabainsafety.com`

## Quick Deploy (Automated)

```bash
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment Steps

### 1. Build Frontend
```bash
npm run build
```

### 2. Connect to Server
```bash
ssh root@5.189.163.66
```

### 3. On Server - Setup Directories
```bash
mkdir -p /var/www/arabainsafety.com
mkdir -p /var/www/arabainsafety.com/backend
```

### 4. Upload Files (from local machine)
```bash
# Upload frontend
scp -r dist/* root@5.189.163.66:/var/www/arabainsafety.com/

# Upload backend
scp -r backend/* root@5.189.163.66:/var/www/arabainsafety.com/backend/

# Upload nginx config
scp nginx-api-proxy.conf root@5.189.163.66:/etc/nginx/sites-available/arabainsafety.com
```

### 5. On Server - Configure Nginx
```bash
# Remove conflicting configs
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/wesal*

# Enable arabainsafety.com
ln -sf /etc/nginx/sites-available/arabainsafety.com /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart nginx
systemctl restart nginx
```

### 6. On Server - Setup Backend
```bash
cd /var/www/arabainsafety.com/backend

# Install dependencies
npm install --production

# Install PM2 if not installed
npm install -g pm2

# Start backend
pm2 stop certificate-api 2>/dev/null || true
pm2 delete certificate-api 2>/dev/null || true
pm2 start server.js --name certificate-api
pm2 save
pm2 startup
```

### 7. Verify Deployment
```bash
# Check nginx status
systemctl status nginx

# Check backend status
pm2 status

# Check backend logs
pm2 logs certificate-api

# Test API
curl http://localhost:3001/health
curl https://arabainsafety.com/health
```

## Fix Nginx Issue (Wesal Site Showing)

If arabainsafety.com is showing the Wesal site, run this on the server:

```bash
# Find all nginx configs
ls -la /etc/nginx/sites-enabled/

# Remove all except arabainsafety.com
cd /etc/nginx/sites-enabled/
rm -f default wesal* 

# Keep only arabainsafety.com
ls -la

# Restart nginx
nginx -t
systemctl restart nginx
```

## Troubleshooting

### Check which site nginx is serving:
```bash
nginx -T | grep server_name
```

### Check if backend is running:
```bash
pm2 status
netstat -tulpn | grep 3001
```

### View nginx error logs:
```bash
tail -f /var/log/nginx/error.log
```

### View backend logs:
```bash
pm2 logs certificate-api
```

## SSL Certificate (Let's Encrypt)

If SSL certificate doesn't exist:
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d arabainsafety.com -d www.arabainsafety.com
```
