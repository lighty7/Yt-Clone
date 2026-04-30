#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${GREEN}=== Setting up auto-start on boot ===${NC}"

cat << 'UNIT' | sudo tee /etc/systemd/system/yt-clone.service > /dev/null
[Unit]
Description=YT-Clone Application
Requires=docker.service tailscaled.service
After=docker.service tailscaled.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/qugeni/git-hub/Yt-Clone
ExecStart=/usr/bin/docker compose --env-file .env.production up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=120

ExecStartPost=/bin/bash -c 'sleep 10 && /usr/bin/tailscale funnel --bg 80'

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable yt-clone.service

echo ""
echo -e "${GREEN}Auto-start service created and enabled.${NC}"
echo -e "To start now:    ${GREEN}sudo systemctl start yt-clone${NC}"
echo -e "To check status: ${GREEN}sudo systemctl status yt-clone${NC}"
echo -e "Logs:            ${GREEN}journalctl -u yt-clone -f${NC}"
