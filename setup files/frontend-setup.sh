#!/bin/bash

# Update the package repository
echo "Updating package repository..."
sudo yum update -y

# Install Apache HTTP Server
echo "Installing httpd..."
sudo yum install httpd -y

# Start and enable Apache service
echo "Starting and enabling httpd service..."
sudo systemctl start httpd
sudo systemctl enable httpd

# Allow HTTP traffic through the firewall (if using firewalld)
echo "Configuring firewall for HTTP traffic..."
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --reload
else
    echo "firewalld is not installed or configured."
fi

# Create a sample HTML page
echo "Setting up a sample HTML page..."
sudo bash -c 'cat > /var/www/html/index.html <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Frontend</title>
</head>
<body>
    <h1>Welcome to the Frontend Server!</h1>
    <form id="userForm">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br><br>
        <button type="submit">Submit</button>
    </form>
</body>
</html>
EOF'

# Restart Apache to apply changes
echo "Restarting httpd to apply changes..."
sudo systemctl restart httpd

# Print success message
echo "Apache HTTP Server setup is complete. Access the server via its public IP!"
