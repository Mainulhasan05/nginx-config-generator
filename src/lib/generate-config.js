export function generateNginxConfig(domain, port) {
  // Default port to 80 if not provided
  const serverPort = port || "80";

  return `server {
      listen ${serverPort};
      server_name ${domain} www.${domain};
  
      # Maximum file upload size for Next.js and Node.js projects
      client_max_body_size 50M;
  
      # Security headers
      add_header X-Frame-Options "SAMEORIGIN";
      add_header X-Content-Type-Options "nosniff";
      add_header X-XSS-Protection "1; mode=block";
      
      # Logging
      access_log /var/log/nginx/${domain}.access.log;
      error_log /var/log/nginx/${domain}.error.log;
  
      location / {
          proxy_pass http://localhost:${port};
          proxy_set_header Host $host;  # Pass the original Host header
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # Forward client IP
          proxy_set_header X-Real-IP $remote_addr;  # Forward the real IP address
          proxy_set_header X-Forwarded-Proto $scheme;  # Forward the protocol (http or https)
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_cache_bypass $http_upgrade;
      }
  
      # Handle static files with caching
      location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
          expires 7d;
          add_header Cache-Control "public, no-transform";
      }
      
      # Deny access to hidden files
      location ~ /\\. {
          deny all;
          access_log off;
          log_not_found off;
      }
  }`;
}
