# Deploy EduPangan ke VPS (Docker)

## 1) Prasyarat VPS
- Ubuntu 22.04+ (direkomendasikan)
- Docker + Docker Compose plugin terpasang
- Port terbuka: `3000` (app) dan opsional `3306` (MySQL)

## 2) Clone project
```bash
git clone <repo-url> edupangan-ui
cd edupangan-ui
```

## 3) Siapkan environment
```bash
cp .env.example .env
```

Lalu edit `.env` minimal:
- `AUTH_SECRET` (wajib, random panjang)
- `BIZNETGIO_API_KEY` (wajib jika pakai AI)
- `MYSQL_ROOT_PASSWORD` (ubah dari default)
- `DATABASE_URL` (default compose sudah `mysql://root:root@db:3306/edupangan`)

## 4) Build dan jalankan
```bash
docker compose up -d --build
```

Atau sekali jalan dengan Nginx + SSL otomatis (script):
```bash
sudo bash scripts/deploy-vps-nginx.sh --domain <domain-anda> --email <email-anda>
```

Contoh dengan subdomain `www`:
```bash
sudo bash scripts/deploy-vps-nginx.sh --domain devstacklabs.net --secondary-domain www.devstacklabs.net --email admin@devstacklabs.net

Contoh custom port host (mis. 8080 -> container 3000):
```bash
sudo bash scripts/deploy-vps-nginx.sh --domain innovilage.devstacklabs.net --email admin@devstacklabs.net --app-port 8080
```
```

Service yang jalan:
- `db` (MySQL custom image: `edupangan-mysql:8.0`)
- `web` (Next.js + migrate deploy saat startup)
- `worker` (AI scheduler artikel)

Image yang akan dibuild:
- `edupangan-mysql:8.0`
- `edupangan-web` (via service `web`)
- `edupangan-worker` (via service `worker`)

## 5) Cek status
```bash
docker compose ps
docker compose logs -f web
docker compose logs -f worker
```

## 6) Seed data awal (sekali)
```bash
docker compose exec web npm run db:seed
```

## 7) Update deployment
```bash
git pull
docker compose up -d --build
```

## 8) Stop / restart
```bash
docker compose stop
docker compose restart
```

## 9) Backup database
```bash
docker compose exec db sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" edupangan > /tmp/edupangan.sql'
docker compose cp db:/tmp/edupangan.sql ./edupangan-backup.sql
```

## Catatan penting
- Untuk production publik, pasang reverse proxy (Nginx/Caddy) + HTTPS.
- Jangan commit `.env` ke git.
- Jika AI worker tidak dibutuhkan, bisa scale worker ke 0:
```bash
docker compose up -d --scale worker=0
```

## Kebutuhan untuk script deploy Nginx
- Paket `nginx` terpasang dan service aktif
- Paket `certbot` + `python3-certbot-nginx` terpasang
- DNS domain sudah mengarah ke IP VPS (A record)
