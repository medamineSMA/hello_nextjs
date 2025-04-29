#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create a deployment package
echo "Creating deployment package..."
tar -czf deploy.tar.gz \
    .next \
    node_modules \
    package.json \
    package-lock.json \
    public \
    ecosystem.config.js \
    .env

# Upload to server (replace with your server details)
echo "Uploading to server..."
scp deploy.tar.gz medsma@62.72.5.185:/htdocs/medsma.newwallpaper.net

# SSH into server and deploy
echo "Deploying on server..."
ssh medsma@62.72.5.185 << 'ENDSSH'
cd /htdocs/medsma.newwallpaper.net
tar -xzf deploy.tar.gz
npm install --production
pm2 restart api-dashboard || pm2 start ecosystem.config.js
rm deploy.tar.gz
ENDSSH

echo "Deployment complete!" 