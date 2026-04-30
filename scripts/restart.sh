#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${GREEN}=== YT-Clone Restart ===${NC}"
echo ""

cd "$PROJECT_DIR"

echo -e "${YELLOW}[1/4] Stopping containers...${NC}"
docker compose down --remove-orphans 2>/dev/null || true

echo -e "${YELLOW}[2/4] Pulling latest code from dev...${NC}"
git fetch origin dev
git reset --hard origin/dev

echo -e "${YELLOW}[3/4] Building and starting containers...${NC}"
docker compose --env-file .env.production up -d --build

echo -e "${YELLOW}[4/4] Re-enabling Tailscale Funnel...${NC}"
sudo tailscale funnel --bg 80 2>/dev/null || echo -e "${RED}Warning: Could not re-enable funnel. Run 'sudo tailscale funnel --bg 80' manually.${NC}"

echo ""
echo -e "${GREEN}=== Waiting for health checks...${NC}"
sleep 5

echo ""
echo -e "${GREEN}=== Container Status ===${NC}"
docker compose ps

echo ""
echo -e "${GREEN}=== Funnel Status ===${NC}"
tailscale funnel status 2>/dev/null || echo -e "${RED}Funnel not active${NC}"

echo ""
echo -e "${GREEN}=== Restart Complete ===${NC}"
echo -e "Frontend: https://qugeni-test.tail463032.ts.net/"
echo -e "Dashboard:  https://qugeni-test.tail463032.ts.net/status"
echo -e "Deploy token: $(grep DEPLOY_TOKEN .env.production | cut -d= -f2)"
