# Deploying Drive Zen to a VPS (Docker Compose)

Everything runs **on your own VPS** — the Next.js app, the PostgreSQL database, and uploaded product
images all live on the VPS's disk. No external database or storage service is required.

```
┌─────────────── VPS ───────────────┐
│  nginx (80/443, TLS)              │
│    └─▶ app container (port 3000)  │
│           └─▶ db container (postgres, internal only) │
│  ./data/uploads  → bind-mounted into app  (product images) │
│  pgdata volume   → postgres data files                     │
└────────────────────────────────────┘
```

## 1. Prerequisites on the VPS

- A VPS running Ubuntu 22.04/24.04 (or similar), with a non-root sudo user.
- A domain name pointed at the VPS's IP (an `A` record), if you want HTTPS with a real domain.
- Docker + Docker Compose installed:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
# log out and back in for the group change to take effect
```

## 2. Get the code onto the VPS

```bash
git clone <your-repo-url> drivezen
cd drivezen
```

(Or `scp`/`rsync` the project folder if it's not in a git remote yet.)

## 3. Configure environment variables

```bash
cp .env.example .env
nano .env
```

Fill in, at minimum:

- `POSTGRES_PASSWORD` — a strong password.
- `AUTH_SECRET` — a long random string, e.g. `openssl rand -base64 32`.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the real admin login you want (used only the first time you seed).

`.env` is read automatically by `docker compose` and is already git-ignored — never commit it.

## 4. Build and start

```bash
docker compose up -d --build
```

This starts, in order:

1. `db` — PostgreSQL, with data persisted in the `pgdata` Docker volume.
2. `migrate` — applies `prisma/migrations/*` to the database, then exits.
3. `app` — the Next.js server, published on `${APP_PORT}` (default `3000`).

Check everything is healthy:

```bash
docker compose ps
docker compose logs -f app
```

## 5. Seed the database (first deploy only)

```bash
docker compose --profile tools run --rm seed
```

This creates the admin login (from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`) and the demo product/FAQ
content, which you can then edit from `/admin`. Safe to skip if you'd rather start from an empty
database and create everything by hand in the admin panel — except you'll still need an admin user to
log in, so run at least the `AdminUser` part of the seed once.

## 6. Put nginx in front (reverse proxy + HTTPS)

Install nginx and certbot:

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/drivezen`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        # required for streaming/App Router responses — do not buffer
        proxy_buffering off;
    }
}
```

Enable it and get a certificate:

```bash
sudo ln -s /etc/nginx/sites-available/drivezen /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

Certbot auto-renews via a systemd timer it installs — no extra steps needed.

## 7. Redeploying after code changes

```bash
git pull
docker compose up -d --build
```

The `migrate` service re-runs automatically and only applies new, pending migrations. Uploaded images
(`./data/uploads`) and the database (`pgdata` volume) are untouched by rebuilds.

## 8. Backups

**Database:**

```bash
docker compose exec db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup-$(date +%F).sql
```

Restore with:

```bash
cat backup-2026-07-16.sql | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
```

**Uploaded images:** just back up the `./data/uploads` directory (plain files on the VPS disk) —
e.g. with `rsync` or a nightly `tar` to off-VPS storage. Put both backup commands in a cron job.

## 9. Where things live on disk

| What | Where |
|---|---|
| Postgres data files | Docker volume `drivezen_pgdata` (name pinned by `COMPOSE_PROJECT_NAME` in `.env`) |
| Uploaded product images | `./data/uploads` on the VPS (bind-mounted into the app container) |
| App source / build | wherever you cloned the repo |

## Troubleshooting

- **`docker compose up` fails at `migrate`:** check `docker compose logs migrate` — usually a bad
  `DATABASE_URL`/`POSTGRES_*` mismatch in `.env`.
- **Images 404 after redeploy:** confirm the `./data/uploads` bind mount is present in
  `docker-compose.yml` under the `app` service — without it, uploads only live inside the old
  container's filesystem and are lost on rebuild.
- **502 from nginx:** the `app` container isn't up yet or crashed — `docker compose logs app`.
