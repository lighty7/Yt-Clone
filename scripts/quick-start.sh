#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${GREEN}=== YT-Clone Quick Start ===${NC}"
echo ""

cd "$PROJECT_DIR"

echo -e "${YELLOW}[1/2] Starting containers...${NC}"
cp .env.production .env 2>/dev/null || echo -e "${YELLOW}Note: .env.production not found, using existing config${NC}"
docker compose up -d

echo ""
echo -e "${YELLOW}[2/2] Re-enabling Tailscale Funnel...${NC}"
sudo tailscale funnel --bg 80 2>/dev/null || echo -e "${RED}Warning: Could not re-enable funnel. Run 'sudo tailscale funnel --bg 80' manually.${NC}"

echo ""
echo -e "${GREEN}Waiting for health checks...${NC}"
sleep 5

echo ""
echo -e "${GREEN}=== Container Status ===${NC}"
docker compose ps

echo ""
echo -e "${GREEN}=== Funnel Status ===${NC}"
tailscale funnel status 2>/dev/null || echo -e "${RED}Funnel not active${NC}"

echo ""
echo -e "${GREEN}=== Done! ===${NC}"
echo -e "App:       https://<your-node>.tail<id>.ts.net/"
echo -e "Dashboard: https://<your-node>.tail<id>.ts.net/status"
