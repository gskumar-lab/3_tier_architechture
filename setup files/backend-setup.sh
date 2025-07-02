#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update the system
echo "Updating system packages..."
sudo yum update -y

# Install Node.js (LTS version)
echo "Installing Node.js..."
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify Node.js and npm installation
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install MariaDB 10.5
echo "Adding MariaDB repository and installing MariaDB 10.5..."
sudo tee /etc/yum.repos.d/MariaDB.repo <<EOL
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.5/centos7-amd64
gpgkey=https://mariadb.org/mariadb_release_signing_key.asc
gpgcheck=1
EOL

sudo yum install -y MariaDB-server MariaDB-client

# Start and enable MariaDB service
echo "Starting MariaDB service..."
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure MariaDB installation (interactive, optional)
echo "Running MariaDB secure installation..."
sudo mysql_secure_installation

# Install required npm packages
echo "Installing npm packages..."
npm install express cors body-parser mysql2

# Install PM2 globally
echo "Installing PM2 globally..."
sudo npm install -g pm2

# Verify PM2 installation
echo "PM2 version: $(pm2 -v)"

# Display installation summary
echo "Setup completed successfully!"
echo "Installed versions:"
echo "  - Node.js: $(node -v)"
echo "  - npm: $(npm -v)"
echo "  - MariaDB: $(mysql --version)"
echo "  - PM2: $(pm2 -v)"
