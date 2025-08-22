#!/bin/sh
set -e  # Stoppe le script si une commande échoue

# 🔹 Remplace $API_URL dans env.js
if [ -f /usr/share/nginx/html/env.template.js ]; then
  echo "Generating env.js from template..."
  envsubst '$API_URL' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

# 🔹 Lancer Nginx en mode foreground
echo "Starting Nginx..."
exec nginx -g 'daemon off;'
