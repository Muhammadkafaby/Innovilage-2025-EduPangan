#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   sudo bash scripts/deploy-vps-nginx.sh
#
# Default deploy target:
#   DOMAIN=innovilage.devstacklabs.net
#   APP_PORT=3000
#   EMAIL=admin@devstacklabs.net
#
# Override (optional):
#   sudo bash scripts/deploy-vps-nginx.sh --domain app.example.com --email you@example.com
# Optional:
#   --secondary-domain www.app.example.com
#   --app-port 3000
#   --no-ssl

DOMAIN="innovilage.devstacklabs.net"
SECONDARY_DOMAIN=""
EMAIL="admin@devstacklabs.net"
APP_PORT="3000"
ENABLE_SSL="true"
PROJECT_NAME="edupangan-ui"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --secondary-domain)
      SECONDARY_DOMAIN="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
      ;;
    --app-port)
      APP_PORT="$2"
      shift 2
      ;;
    --no-ssl)
      ENABLE_SSL="false"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

if [[ "$ENABLE_SSL" == "true" && -z "$EMAIL" ]]; then
  echo "ERROR: --email wajib diisi jika SSL aktif"
  exit 1
fi

if [[ ! "$APP_PORT" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --app-port harus angka"
  exit 1
fi

if [[ ! -f "docker-compose.yml" ]]; then
  echo "ERROR: Jalankan script ini dari root project (docker-compose.yml tidak ditemukan)."
  exit 1
fi

if [[ ! -f ".env" ]]; then
  if [[ -f ".env.example" ]]; then
    cp .env.example .env
    echo "[INFO] .env belum ada, dibuat dari .env.example."
    echo "[ACTION] Edit .env dulu (AUTH_SECRET, BIZNETGIO_API_KEY, MYSQL_ROOT_PASSWORD), lalu jalankan ulang script."
    exit 1
  fi
  echo "ERROR: .env tidak ditemukan"
  exit 1
fi

echo "[1/5] Build dan jalankan Docker services..."
if grep -q '^APP_PORT=' .env; then
  sed -i "s/^APP_PORT=.*/APP_PORT=\"${APP_PORT}\"/" .env
else
  echo "APP_PORT=\"${APP_PORT}\"" >> .env
fi
docker compose up -d --build

echo "[2/5] Seed database (aman, upsert)..."
docker compose exec -T web npm run db:seed || true

NGINX_CONF_PATH="/etc/nginx/sites-available/${PROJECT_NAME}.conf"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/${PROJECT_NAME}.conf"

echo "[3/5] Tulis konfigurasi Nginx: ${NGINX_CONF_PATH}"
cat > "$NGINX_CONF_PATH" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN}${SECONDARY_DOMAIN:+ ${SECONDARY_DOMAIN}};

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

ln -sf "$NGINX_CONF_PATH" "$NGINX_ENABLED_PATH"
nginx -t
systemctl reload nginx

if [[ "$ENABLE_SSL" == "true" ]]; then
  echo "[4/5] Setup SSL Let's Encrypt..."
  CERTBOT_DOMAINS=("-d" "$DOMAIN")
  if [[ -n "$SECONDARY_DOMAIN" ]]; then
    CERTBOT_DOMAINS+=("-d" "$SECONDARY_DOMAIN")
  fi

  certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect \
    "${CERTBOT_DOMAINS[@]}"

  systemctl reload nginx
else
  echo "[4/5] SSL dilewati (--no-ssl)."
fi

echo "[5/5] Status layanan"
docker compose ps
echo "\nDone."
echo "App URL: http://${DOMAIN}"
if [[ "$ENABLE_SSL" == "true" ]]; then
  echo "App URL HTTPS: https://${DOMAIN}"
fi
