# Self-Hosted Server Setup Guide

Complete step-by-step guide to deploy the YT-Clone on a new server.

---

## Architecture

```
Internet
   │
   ▼
Tailscale Funnel (HTTPS) ── <your-node>.tail<id>.ts.net
   │
   ▼
Nginx (:80) ────────────── Reverse Proxy
   ├── /          → Frontend (static)
   ├── /api/*     → Backend (:3000)
   ├── /health    → Backend health check
   ├── /uploads   → Backend uploads
   ├── /status    → Monitor Dashboard (:3001)
   └── /api/metrics, /api/deploy, /api/restart → Monitor API
   │
   ├── PostgreSQL (:5432) ── Persistent volume
   ├── Backend ──────────── Node.js + Prisma
   ├── Frontend ─────────── React + Vite
   └── Monitor ──────────── Express + Docker API
```

---

## Prerequisites

- Ubuntu 24.04 LTS (or similar Debian-based distro)
- Root or sudo access
- Internet connection
- A GitHub account with access to the repository
- A Tailscale account (free)
- A Gmail account (for email verification)

---

## Step 1: Install Docker & Dependencies

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add your user to docker group (no sudo needed for docker commands)
sudo usermod -aG docker $USER
newgrp docker

# Install Bun (fast JavaScript runtime, faster than npm)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verify installations
docker --version
docker compose version
bun --version
```

---

## Step 2: Install & Configure Tailscale

Tailscale provides secure public HTTPS access without port forwarding or SSL certificates.

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start and authenticate with your tailnet
sudo tailscale up

# This will output a URL. Open it in your browser, log in, and authorize the machine

# Verify connection
tailscale status
```

Your server now has a Tailscale IP (e.g., `100.x.x.x`) and a hostname like `myserver.tail123456.ts.net`.

---

## Step 3: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/lighty7/Yt-Clone.git
cd Yt-Clone

# Switch to the dev branch
git checkout dev
```

---

## Step 4: Configure Environment Variables

```bash
# Copy the example template
cp .env.production.example .env.production
```

Edit the file with your values:

```bash
nano .env.production
```

```env
# JWT Secret — generate with: openssl rand -hex 32
JWT_SECRET=your-32-char-hex-string

# Gmail App Password (not your regular password!)
# Generate at: https://myaccount.google.com/apppasswords
# Requires 2FA enabled on your Google account
SMTP_PASS=xxxx xxxx xxxx xxxx

# Deploy token — generate with: openssl rand -hex 16
DEPLOY_TOKEN=your-16-char-hex-string
```

Generate secure values:

```bash
# Generate a 32-char hex JWT secret
openssl rand -hex 32

# Generate a 16-char hex deploy token
openssl rand -hex 16
```

> **Important:** `.env.production` contains sensitive secrets and is gitignored. Never commit it.

---

## Step 5: Deploy Everything

```bash
cd ~/Yt-Clone

# Load environment variables and start all containers
cp .env.production .env
docker compose up -d --build
```

This starts 5 Docker containers:

| Container | Image | Purpose |
|---|---|---|
| `yt-clone-db` | `postgres:16-alpine` | PostgreSQL database |
| `yt-clone-backend` | Custom (Bun) | Node.js API server |
| `yt-clone-frontend` | Custom (Bun + Nginx) | React frontend (static) |
| `yt-clone-monitor` | Custom (Node.js) | Live monitoring dashboard |
| `yt-clone-nginx` | `nginx:alpine` | Reverse proxy |

Wait for the build to complete (first build takes ~2-3 minutes).

---

## Step 6: Enable Tailscale Funnel

```bash
# Expose the app publicly via HTTPS
sudo tailscale funnel --bg 80

# Check status
tailscale funnel status
```

Your app is now publicly accessible at:
```
https://<your-node-name>.tail<id>.ts.net/
https://<your-node-name>.tail<id>.ts.net/status    (monitoring dashboard)
https://<your-node-name>.tail<id>.ts.net/health    (API health check)
```

---

## Step 7: Set Up Auto-Start on Boot

Ensure the app starts automatically after a server reboot:

```bash
chmod +x scripts/setup-autostart.sh
sudo bash scripts/setup-autostart.sh
```

This creates a systemd service (`yt-clone.service`) that:
1. Waits for Docker and Tailscale to be ready
2. Starts all containers via `docker compose`
3. Re-enables Tailscale Funnel after startup

### Manage the Service

```bash
# Check status
sudo systemctl status yt-clone

# Start
sudo systemctl start yt-clone

# Stop
sudo systemctl stop yt-clone

# View live logs
journalctl -u yt-clone -f
```

---

## Verification

### Check Container Status

```bash
docker compose ps
```

Expected output (all should show `Up` or `healthy`):

```
NAME                IMAGE                STATUS
yt-clone-db         postgres:16-alpine   Up (healthy)
yt-clone-backend    yt-clone-backend     Up (healthy)
yt-clone-frontend   yt-clone-frontend    Up
yt-clone-monitor    yt-clone-monitor     Up
yt-clone-nginx      nginx:alpine         Up
```

### Test Endpoints

```bash
# Backend health
curl http://localhost/health

# Frontend (should return 200)
curl -o /dev/null -w "%{http_code}" http://localhost/

# Monitor API
curl http://localhost/api/metrics
```

### Database Migrations

Migrations run automatically on backend startup. To verify:

```bash
docker compose logs backend | grep -i migration
```

To run migrations manually:

```bash
docker exec yt-clone-backend bunx prisma migrate deploy
```

---

## Monitoring Dashboard

Access at: `https://<your-node>.tail<id>.ts.net/status`

### Features

| Card | Description |
|---|---|
| **Containers** | Count of running vs total containers |
| **System Load** | 1m, 5m, 15m load averages |
| **Disk Usage** | Total, used, available, percentage |
| **Uptime** | Server uptime (days/hours/minutes) |
| **Tailscale** | Connection status |
| **Funnel** | Whether public access is active |
| **Network** | RX/TX bytes on primary interface |
| **Container Details** | Per-container state, CPU%, memory usage |

### Action Buttons

| Button | What It Does |
|---|---|
| **Deploy from dev** | Fetches latest `dev` branch, rebuilds all containers |
| **Restart All Services** | Restarts containers without rebuilding |

Both buttons work immediately — no confirmation or token required.

---

## Updating the App

### Via Dashboard (Recommended)

1. Open `https://<your-node>.tail<id>.ts.net/status`
2. Click **Deploy from dev**
3. Wait ~30-60 seconds for rebuild
4. Page auto-refreshes with new status

### Via CLI

```bash
cd ~/Yt-Clone

# Pull latest code and rebuild
git pull origin dev
docker compose down
docker compose up -d --build
```

### Via Restart Script

```bash
./scripts/restart.sh
```

This stops containers, pulls latest `dev` code, rebuilds, and re-enables Funnel.

---

## File Structure

```
Yt-Clone/
├── docker-compose.yml              # Docker orchestration (5 services)
├── .env.production                 # Environment secrets (gitignored)
├── .env.production.example         # Template for new servers
├── backend/
│   ├── Dockerfile                  # Multi-stage Bun build
│   ├── prisma/schema.prisma        # Database schema
│   └── src/                        # Express.js API
├── frontend/
│   ├── Dockerfile                  # Multi-stage Bun build + Nginx
│   └── nginx.conf                  # SPA routing config
├── monitor/
│   ├── Dockerfile                  # Node.js with Docker CLI
│   ├── api.js                      # Metrics API + deploy endpoints
│   ├── dashboard.html              # Self-contained dashboard UI
│   └── package.json
├── nginx/
│   └── nginx.conf                  # Reverse proxy for all routes
├── scripts/
│   ├── restart.sh                  # Full restart + git pull + funnel
│   └── setup-autostart.sh          # Installs systemd service
└── docs/
    └── setup-server.md             # This file
```

---

## Troubleshooting

### Container Fails to Start

```bash
# View logs for a specific service
docker compose logs backend
docker compose logs db
docker compose logs monitor

# Restart a single service
docker compose up -d backend
```

### Database Connection Failed

```bash
# Verify PostgreSQL is healthy
docker compose ps db

# Test connection from backend container
docker exec yt-clone-backend sh -c "echo 'SELECT 1' | psql 'postgresql://yash:yash123@postgres:5432/yt_clone'"
```

### Tailscale Funnel Not Working

```bash
# Check status
tailscale funnel status

# Re-enable
sudo tailscale funnel --bg 80

# Verify serve config
tailscale serve status
```

### Dashboard Shows Empty/Zero Metrics

```bash
# Verify Docker socket access
docker exec yt-clone-monitor docker ps

# Rebuild monitor
docker compose up -d --build monitor

# Check monitor logs
docker compose logs monitor
```

### Deploy Button Not Working

```bash
# Verify git access inside monitor container
docker exec yt-clone-monitor sh -c "cd /app/project && git status"

# Check monitor logs for errors
docker compose logs monitor
```

### Port 80 Already in Use

```bash
# Find what's using port 80
sudo ss -tlnp | grep :80

# Stop the conflicting service (e.g., Apache)
sudo systemctl stop apache2
sudo systemctl disable apache2

# Restart nginx
docker compose restart nginx
```

### CORS Errors

If the frontend shows CORS errors, update `FRONTEND_URL` and `PRODUCTION_ORIGINS` in `docker-compose.yml` to match your Tailscale URL, then rebuild:

```bash
docker compose up -d --build backend frontend
```

---

## Security Notes

1. **Never commit `.env.production`** — it is in `.gitignore` for a reason
2. **Tailscale Funnel** provides free HTTPS — no need for Let's Encrypt
3. **Dashboard has no authentication** — only accessible via your Tailscale network (private by default)
4. **Change default PostgreSQL credentials** (`yash`/`yash123`) before exposing to anything other than Tailscale
5. **Use strong JWT_SECRET** — minimum 32 characters, generated with `openssl rand -hex 32`
6. **Gmail App Password** — never use your regular Gmail password; use an app-specific password

---

## Useful Commands

```bash
# Follow all logs in real time
docker compose logs -f

# Follow a specific service
docker compose logs -f backend

# Stop all containers
docker compose down

# Stop and remove volumes (DELETES ALL DATABASE DATA!)
docker compose down -v

# Rebuild everything from scratch (no cache)
docker compose up -d --build --no-cache

# Enter a container shell
docker exec -it yt-clone-backend sh
docker exec -it yt-clone-monitor sh
docker exec -it yt-clone-db psql -U yash -d yt_clone

# Check disk usage by Docker
docker system df

# Remove unused images to free space
docker image prune -af

# View container resource usage
docker stats
```
