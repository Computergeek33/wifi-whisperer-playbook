import { Radio, AlertTriangle, Check, Info } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const MonitorMode = () => {
  const monitorScript = `#!/bin/bash
# Monitor Mode & Packet Capture Automation Script
# For Raspberry Pi 4 with Alfa AWUS036ACH
# Usage: sudo bash monitor_capture.sh <interface> [channel] [output_file]

set -e

INTERFACE=\${1:-wlan1}
CHANNEL=\${2:-6}
OUTPUT=\${3:-capture_$(date +%Y%m%d_%H%M%S)}

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

print_status() { echo -e "\${CYAN}[*]\${NC} \$1"; }
print_success() { echo -e "\${GREEN}[+]\${NC} \$1"; }
print_warning() { echo -e "\${YELLOW}[!]\${NC} \$1"; }
print_error() { echo -e "\${RED}[-]\${NC} \$1"; }

# Check if running as root
if [[ \$EUID -ne 0 ]]; then
   print_error "This script must be run as root (sudo)"
   exit 1
fi

# Verify interface exists
if ! iwconfig \$INTERFACE &>/dev/null; then
    print_error "Interface \$INTERFACE not found!"
    echo "Available interfaces:"
    iwconfig 2>/dev/null | grep -E "^\\w+" | awk '{print "  - " \$1}'
    exit 1
fi

print_status "Starting Monitor Mode Setup for \$INTERFACE"
echo "=========================================="

# Step 1: Check for interfering processes
print_status "Checking for interfering processes..."
INTERFERING=\$(airmon-ng check \$INTERFACE 2>/dev/null | grep -E "PID|NetworkManager|wpa_supplicant" || true)
if [ -n "\$INTERFERING" ]; then
    print_warning "Found interfering processes:"
    echo "\$INTERFERING"
    print_status "Killing interfering processes..."
    airmon-ng check kill
    sleep 2
fi

# Step 2: Bring interface down
print_status "Bringing interface down..."
ip link set \$INTERFACE down

# Step 3: Set monitor mode
print_status "Setting monitor mode..."
iw dev \$INTERFACE set type monitor

# Step 4: Bring interface up
print_status "Bringing interface up in monitor mode..."
ip link set \$INTERFACE up

# Step 5: Set channel (optional but recommended)
print_status "Setting channel to \$CHANNEL..."
iw dev \$INTERFACE set channel \$CHANNEL

# Step 6: Verify monitor mode
MODE=\$(iwconfig \$INTERFACE 2>/dev/null | grep -oP 'Mode:\\K\\w+')
if [ "\$MODE" == "Monitor" ]; then
    print_success "Monitor mode enabled successfully!"
else
    print_error "Failed to enable monitor mode. Current mode: \$MODE"
    exit 1
fi

# Step 7: Display interface info
print_status "Interface configuration:"
iwconfig \$INTERFACE

echo ""
print_success "Ready to capture packets!"
echo "=========================================="
echo ""

# Step 8: Start packet capture
print_status "Starting airodump-ng capture..."
print_status "Output files: \$OUTPUT-01.cap, \$OUTPUT-01.csv, \$OUTPUT-01.kismet.csv"
print_warning "Press Ctrl+C to stop capture"
echo ""

# Create output directory if it doesn't exist
mkdir -p ./captures

# Start capture
airodump-ng --write ./captures/\$OUTPUT --output-format pcap,csv,kismet \$INTERFACE

# Cleanup function
cleanup() {
    echo ""
    print_status "Stopping capture and restoring interface..."
    ip link set \$INTERFACE down
    iw dev \$INTERFACE set type managed
    ip link set \$INTERFACE up
    print_success "Interface restored to managed mode"
    print_success "Capture files saved in ./captures/"
    ls -la ./captures/\$OUTPUT* 2>/dev/null || true
}

trap cleanup EXIT`;

  const tcpdumpScript = `#!/bin/bash
# Advanced tcpdump Wireless Capture Script
# Captures specific frame types for analysis

INTERFACE=\${1:-wlan1mon}
OUTPUT=\${2:-tcpdump_capture}
DURATION=\${3:-60}

echo "[*] Starting tcpdump capture on \$INTERFACE for \$DURATION seconds..."

# Capture all wireless frames with full packet data
sudo tcpdump -i \$INTERFACE -w \${OUTPUT}.pcap -c 10000 \\
    -e -s 0 \\
    'type mgt or type ctl or type data' &

TCPDUMP_PID=\$!

# Run for specified duration
sleep \$DURATION

# Stop capture
kill \$TCPDUMP_PID 2>/dev/null

echo "[+] Capture complete: \${OUTPUT}.pcap"
echo "[*] Analyzing capture..."

# Quick analysis
tcpdump -r \${OUTPUT}.pcap -n | head -50
echo ""
echo "[*] Total packets captured:"
tcpdump -r \${OUTPUT}.pcap -n 2>/dev/null | wc -l`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 02</span>
              <h2 className="text-2xl font-bold text-foreground">Monitor Mode & Packet Capture</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Monitor mode allows your wireless adapter to capture all wireless traffic in range, not just traffic 
            destined for your device. This is the foundation of all WiFi penetration testing operations.
          </p>

          {/* Theory Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Understanding Monitor Mode
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Managed Mode (Default):</strong> Your adapter only receives packets 
                addressed to its MAC address or broadcast packets. This is how normal WiFi connections work.
              </p>
              <p>
                <strong className="text-foreground">Monitor Mode:</strong> Your adapter receives ALL wireless frames 
                within range, regardless of destination. This includes management frames (beacons, probes, authentication), 
                control frames, and data frames from other networks.
              </p>
              <p>
                <strong className="text-foreground">Why It Matters:</strong> Without monitor mode, you cannot capture 
                WPA handshakes, detect hidden networks, or perform deauthentication attacks.
              </p>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-4 rounded-lg border border-warning/50 bg-warning/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Prerequisites</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Module 01 completed (Alfa adapter driver installed)</li>
                  <li>• aircrack-ng suite installed (<code className="text-primary">sudo apt install aircrack-ng</code>)</li>
                  <li>• Root/sudo access required for all operations</li>
                  <li>• Authorization to monitor wireless networks in your area</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Method 1: Using iw (Recommended) */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 1: Using iw (Modern Approach)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The <code className="text-primary">iw</code> utility is the modern replacement for iwconfig and provides 
            more reliable control over wireless interfaces.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="iwconfig"
              description="Step 1: Identify your wireless interfaces"
              explanation="Lists all wireless interfaces. Your Alfa adapter typically appears as wlan1 (wlan0 is usually the built-in Pi WiFi)."
              output={`wlan0     IEEE 802.11  ESSID:"HomeNetwork"
          Mode:Managed  Frequency:2.437 GHz  Access Point: AA:BB:CC:DD:EE:FF
          
wlan1     IEEE 802.11AC  ESSID:off/any  
          Mode:Managed  Access Point: Not-Associated   Tx-Power=20 dBm`}
            />

            <CommandBlock
              command="sudo airmon-ng check kill"
              description="Step 2: Kill interfering processes"
              explanation="NetworkManager, wpa_supplicant, and other processes can interfere with monitor mode. This command kills them. WARNING: This will disconnect your WiFi - use Ethernet for the Pi."
              output={`Killing these processes:

    PID Name
   1234 NetworkManager
   1456 wpa_supplicant`}
            />

            <CommandBlock
              command="sudo ip link set wlan1 down"
              description="Step 3: Bring the interface down"
              explanation="The interface must be down before changing its mode. This is similar to 'ifconfig wlan1 down' but uses the modern ip command."
            />

            <CommandBlock
              command="sudo iw dev wlan1 set type monitor"
              description="Step 4: Set monitor mode"
              explanation="Changes the interface type from 'managed' (normal) to 'monitor'. The iw command is more reliable than iwconfig for this operation."
            />

            <CommandBlock
              command="sudo ip link set wlan1 up"
              description="Step 5: Bring the interface back up"
              explanation="Activates the interface in its new monitor mode. The interface is now ready to capture all wireless traffic."
            />

            <CommandBlock
              command="iwconfig wlan1"
              description="Step 6: Verify monitor mode is active"
              explanation="Confirm the interface shows 'Mode:Monitor'. If it still shows 'Mode:Managed', something went wrong."
              output={`wlan1     IEEE 802.11AC  Mode:Monitor  Frequency:2.437 GHz  Tx-Power=20 dBm`}
            />

            <CommandBlock
              command="sudo iw dev wlan1 set channel 6"
              description="Step 7: Set specific channel (optional)"
              explanation="Lock the adapter to a specific channel. Channel 1, 6, or 11 are most common for 2.4GHz. Use channels 36, 40, 44, 48 for 5GHz."
            />
          </div>

          {/* Method 2: Using airmon-ng */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 2: Using airmon-ng (Quick Method)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            airmon-ng automates the process but may rename your interface (wlan1 → wlan1mon).
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airmon-ng check kill"
              description="Step 1: Kill interfering processes"
              explanation="Same as before - eliminates processes that could interfere with monitor mode."
            />

            <CommandBlock
              command="sudo airmon-ng start wlan1"
              description="Step 2: Enable monitor mode"
              explanation="airmon-ng handles bringing the interface down, setting monitor mode, and bringing it back up. Note the new interface name in the output."
              output={`PHY     Interface       Driver          Chipset

phy0    wlan0           brcmfmac        Broadcom 43430
phy1    wlan1           88XXau          Realtek RTL8812AU

                (mac80211 monitor mode vif enabled for [phy1]wlan1 on [phy1]wlan1mon)
                (mac80211 station mode vif disabled for [phy1]wlan1)`}
            />

            <CommandBlock
              command="iwconfig wlan1mon"
              description="Step 3: Verify new monitor interface"
              explanation="Note the interface is now 'wlan1mon' not 'wlan1'. Use this new name for all subsequent commands."
              output={`wlan1mon  IEEE 802.11AC  Mode:Monitor  Frequency:2.412 GHz  Tx-Power=20 dBm`}
            />
          </div>

          {/* Packet Capture Section */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Packet Capture with airodump-ng</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once in monitor mode, airodump-ng is the primary tool for capturing wireless packets and discovering networks.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1mon"
              description="Basic network discovery scan"
              explanation="Scans all channels and displays all access points and clients in range. The display updates in real-time. Press Ctrl+C to stop."
              output={` CH  6 ][ Elapsed: 1 min ][ 2024-01-15 14:30

 BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID

 AA:BB:CC:DD:EE:01  -45      234      567   12   6   54e  WPA2 CCMP   PSK  TargetNetwork
 AA:BB:CC:DD:EE:02  -67       89       23    2  11  130e  WPA2 CCMP   PSK  NeighborWiFi
 AA:BB:CC:DD:EE:03  -78       45        0    0   1   54   OPN              OpenNetwork

 BSSID              STATION            PWR   Rate    Lost    Frames  Notes  Probes

 AA:BB:CC:DD:EE:01  11:22:33:44:55:66  -34   54e-24      0      123         iPhone
 AA:BB:CC:DD:EE:01  11:22:33:44:55:77  -56   54e-54      2       45         `}
            />

            <CommandBlock
              command="sudo airodump-ng wlan1mon --band abg"
              description="Scan both 2.4GHz and 5GHz bands"
              explanation="The --band option specifies which frequencies to scan. 'a' = 5GHz, 'bg' = 2.4GHz. Your Alfa AWUS036ACH supports both bands."
            />

            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:01 -w capture wlan1mon"
              description="Capture packets from specific network"
              explanation="-c 6 locks to channel 6, --bssid filters to one access point, -w specifies output file prefix. This focused capture is essential for handshake capture."
            />

            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:01 -w capture --output-format pcap,csv wlan1mon"
              description="Capture with specific output formats"
              explanation="Saves both PCAP (for Wireshark/hashcat) and CSV (for reporting). The PCAP file contains the actual packets including handshakes."
            />
          </div>

          {/* Alternative: tcpdump */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Alternative: Raw Capture with tcpdump</h3>
          <p className="text-sm text-muted-foreground mb-4">
            tcpdump provides lower-level packet capture and is useful for custom filtering and analysis.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo tcpdump -i wlan1mon -w raw_capture.pcap"
              description="Basic packet capture to file"
              explanation="Captures all packets to a PCAP file. This file can be opened in Wireshark for detailed analysis."
            />

            <CommandBlock
              command="sudo tcpdump -i wlan1mon -e -s 0 'type mgt subtype beacon'"
              description="Capture only beacon frames"
              explanation="-e shows link-layer headers, -s 0 captures full packets. The filter captures only beacon frames which contain SSID information."
            />

            <CommandBlock
              command="sudo tcpdump -i wlan1mon -e -s 0 'type mgt subtype probe-req'"
              description="Capture probe requests"
              explanation="Probe requests reveal what networks devices are searching for. Useful for understanding client behavior and potential targets."
            />

            <CommandBlock
              command="sudo tcpdump -i wlan1mon -e -s 0 'ether host AA:BB:CC:DD:EE:FF'"
              description="Filter by specific MAC address"
              explanation="Captures all traffic to/from a specific device. Replace the MAC with your target's address."
            />
          </div>

          {/* Restoring Managed Mode */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Restoring Managed Mode</h3>
          <p className="text-sm text-muted-foreground mb-4">
            After testing, restore your adapter to normal operation mode.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airmon-ng stop wlan1mon"
              description="Method 1: Using airmon-ng"
              explanation="Stops monitor mode and restores the original interface name (wlan1mon → wlan1)."
            />

            <CommandBlock
              command="sudo ip link set wlan1 down && sudo iw dev wlan1 set type managed && sudo ip link set wlan1 up"
              description="Method 2: Manual restoration"
              explanation="Manually sets the interface back to managed mode. Use if airmon-ng doesn't restore properly."
            />

            <CommandBlock
              command="sudo systemctl restart NetworkManager"
              description="Restart NetworkManager"
              explanation="Restarts the network manager service that was killed earlier. This re-enables automatic WiFi connections."
            />
          </div>

          {/* Understanding the Output */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Understanding airodump-ng Output</h3>
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
                    <td className="py-2 pr-4 font-mono text-primary">BSSID</td>
                    <td className="py-2">MAC address of the access point</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">PWR</td>
                    <td className="py-2">Signal strength (closer to 0 = stronger, -30 is excellent, -80 is weak)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Beacons</td>
                    <td className="py-2">Number of beacon frames received (APs broadcast these to announce presence)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">#Data</td>
                    <td className="py-2">Number of data packets captured (indicates active network usage)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">CH</td>
                    <td className="py-2">Channel the AP is operating on</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">ENC</td>
                    <td className="py-2">Encryption type (WPA2, WPA, WEP, OPN for open)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">CIPHER</td>
                    <td className="py-2">Cipher suite (CCMP = AES, TKIP = older/weaker)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">AUTH</td>
                    <td className="py-2">Authentication method (PSK = password, MGT = enterprise)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">ESSID</td>
                    <td className="py-2">Network name (may be hidden)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automated Monitor Mode Script</h3>
          <ScriptBlock
            title="Complete Monitor Mode & Capture Script"
            filename="monitor_capture.sh"
            language="bash"
            description="Automates monitor mode setup and packet capture. Usage: sudo bash monitor_capture.sh wlan1 6 my_capture"
            code={monitorScript}
          />

          <div className="mt-6">
            <ScriptBlock
              title="tcpdump Capture Script"
              filename="tcpdump_capture.sh"
              language="bash"
              description="Alternative capture script using tcpdump with frame type filtering."
              code={tcpdumpScript}
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
                <span>Successfully enabled monitor mode on Alfa adapter</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Verified monitor mode with iwconfig</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Captured packets with airodump-ng</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Saved capture files in PCAP format</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Restored adapter to managed mode</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
