#!/bin/bash
# Enable Tailscale Funnel for YT-Clone
# Run with: sudo bash ~/git-hub/Yt-Clone/enable-funnel.sh

echo "=== Enabling Tailscale Serve on port 80 ==="
tailscale serve --bg 80

echo ""
echo "=== Enabling Tailscale Funnel ==="
tailscale funnel --bg 80

echo ""
echo "=== Current Status ==="
tailscale serve status
echo ""
tailscale funnel status

echo ""
echo "=== Done! ==="
echo "Your app should now be publicly accessible."
echo "Check the funnel status above for the public URL."
