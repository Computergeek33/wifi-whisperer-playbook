import { Search, AlertTriangle, Check, Info, Target, Users, Globe } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const NetworkDiscovery = () => {
  const reconScript = `#!/bin/bash
# Comprehensive WiFi Reconnaissance Script
# For Raspberry Pi 4 with Alfa AWUS036ACH
# Usage: sudo bash wifi_recon.sh <interface> [duration_seconds]

set -e

INTERFACE=\${1:-wlan1mon}
DURATION=\${2:-120}
OUTPUT_DIR="./recon_$(date +%Y%m%d_%H%M%S)"
REPORT_FILE="\$OUTPUT_DIR/recon_report.md"

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

print_status() { echo -e "\${CYAN}[*]\${NC} \$1"; }
print_success() { echo -e "\${GREEN}[+]\${NC} \$1"; }
print_warning() { echo -e "\${YELLOW}[!]\${NC} \$1"; }

# Create output directory
mkdir -p "\$OUTPUT_DIR"

# Initialize report
cat << EOF > "\$REPORT_FILE"
# WiFi Reconnaissance Report
**Date:** $(date)
**Interface:** \$INTERFACE
**Duration:** \$DURATION seconds

---

EOF

print_status "Starting WiFi Reconnaissance on \$INTERFACE"
echo "=========================================="
print_status "Output directory: \$OUTPUT_DIR"
print_status "Scan duration: \$DURATION seconds"
echo ""

# Step 1: Verify monitor mode
MODE=\$(iwconfig \$INTERFACE 2>/dev/null | grep -oP 'Mode:\\K\\w+' || echo "Unknown")
if [ "\$MODE" != "Monitor" ]; then
    print_warning "Interface not in monitor mode. Attempting to enable..."
    MANAGED_IF=\${INTERFACE%mon}
    sudo ip link set \$MANAGED_IF down 2>/dev/null || true
    sudo iw dev \$MANAGED_IF set type monitor 2>/dev/null || true
    sudo ip link set \$MANAGED_IF up 2>/dev/null || true
    INTERFACE=\$MANAGED_IF
fi

# Step 2: Quick 2.4GHz scan
print_status "Phase 1: Scanning 2.4GHz band..."
timeout \$((DURATION/2)) airodump-ng \$INTERFACE \\
    --band bg \\
    --write "\$OUTPUT_DIR/scan_2ghz" \\
    --output-format csv,netxml 2>/dev/null &
SCAN_PID=\$!
sleep \$((DURATION/2))
kill \$SCAN_PID 2>/dev/null || true

# Step 3: Quick 5GHz scan  
print_status "Phase 2: Scanning 5GHz band..."
timeout \$((DURATION/2)) airodump-ng \$INTERFACE \\
    --band a \\
    --write "\$OUTPUT_DIR/scan_5ghz" \\
    --output-format csv,netxml 2>/dev/null &
SCAN_PID=\$!
sleep \$((DURATION/2))
kill \$SCAN_PID 2>/dev/null || true

print_success "Scan complete!"
echo ""

# Step 4: Parse and analyze results
print_status "Analyzing results..."

# Count networks
TOTAL_2GHZ=\$(grep -c "WPA\\|WEP\\|OPN" "\$OUTPUT_DIR/scan_2ghz-01.csv" 2>/dev/null || echo "0")
TOTAL_5GHZ=\$(grep -c "WPA\\|WEP\\|OPN" "\$OUTPUT_DIR/scan_5ghz-01.csv" 2>/dev/null || echo "0")

# Categorize by encryption
WPA3_COUNT=\$(grep -c "WPA3" "\$OUTPUT_DIR"/*.csv 2>/dev/null || echo "0")
WPA2_COUNT=\$(grep -c "WPA2" "\$OUTPUT_DIR"/*.csv 2>/dev/null || echo "0")
WPA_COUNT=\$(grep -c "WPA," "\$OUTPUT_DIR"/*.csv 2>/dev/null || echo "0")
WEP_COUNT=\$(grep -c " WEP" "\$OUTPUT_DIR"/*.csv 2>/dev/null || echo "0")
OPEN_COUNT=\$(grep -c " OPN" "\$OUTPUT_DIR"/*.csv 2>/dev/null || echo "0")

# Append to report
cat << EOF >> "\$REPORT_FILE"
## Network Summary

| Band | Networks Found |
|------|----------------|
| 2.4 GHz | \$TOTAL_2GHZ |
| 5 GHz | \$TOTAL_5GHZ |
| **Total** | **\$((TOTAL_2GHZ + TOTAL_5GHZ))** |

## Encryption Analysis

| Type | Count | Risk Level |
|------|-------|------------|
| WPA3 | \$WPA3_COUNT | Low |
| WPA2 | \$WPA2_COUNT | Medium |
| WPA | \$WPA_COUNT | High |
| WEP | \$WEP_COUNT | Critical |
| Open | \$OPEN_COUNT | Critical |

EOF

# Display summary
echo ""
echo "=========================================="
print_success "RECONNAISSANCE SUMMARY"
echo "=========================================="
echo "2.4 GHz Networks: \$TOTAL_2GHZ"
echo "5 GHz Networks:   \$TOTAL_5GHZ"
echo ""
echo "Encryption Breakdown:"
echo "  WPA3: \$WPA3_COUNT (Most Secure)"
echo "  WPA2: \$WPA2_COUNT (Secure, but attackable)"
echo "  WPA:  \$WPA_COUNT (Weak)"
echo "  WEP:  \$WEP_COUNT (CRITICAL - Easily cracked)"
echo "  Open: \$OPEN_COUNT (No encryption)"
echo ""
print_success "Report saved: \$REPORT_FILE"
print_success "Raw data: \$OUTPUT_DIR/"
echo ""

# List vulnerable networks
if [ "\$WEP_COUNT" -gt 0 ] || [ "\$OPEN_COUNT" -gt 0 ]; then
    print_warning "VULNERABLE NETWORKS DETECTED!"
    grep -E " WEP| OPN" "\$OUTPUT_DIR"/*.csv 2>/dev/null | head -10 || true
fi`;

  const clientEnumScript = `#!/bin/bash
# Client Enumeration Script
# Identifies all wireless clients and their associated networks

INTERFACE=\${1:-wlan1mon}
DURATION=\${2:-60}
OUTPUT="clients_$(date +%Y%m%d_%H%M%S)"

echo "[*] Starting client enumeration on \$INTERFACE..."
echo "[*] Duration: \$DURATION seconds"

# Capture for specified duration
timeout \$DURATION airodump-ng \$INTERFACE \\
    --write \$OUTPUT \\
    --output-format csv 2>/dev/null

echo ""
echo "[+] Client Analysis:"
echo "===================="

# Extract and display clients
if [ -f "\${OUTPUT}-01.csv" ]; then
    echo ""
    echo "Associated Clients:"
    grep -v "not associated" "\${OUTPUT}-01.csv" | \\
        grep -E "^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}" | \\
        awk -F',' '{print "  MAC: " \$1 " -> AP: " \$6 " (PWR: " \$4 "dBm)"}' | \\
        head -20
    
    echo ""
    echo "Unassociated Clients (Probing):"
    grep "not associated" "\${OUTPUT}-01.csv" | \\
        awk -F',' '{print "  MAC: " \$1 " - Probing for: " \$7}' | \\
        head -20
fi`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 03</span>
              <h2 className="text-2xl font-bold text-foreground">Network Discovery & Reconnaissance</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Reconnaissance is the foundation of any penetration test. This module covers comprehensive techniques 
            for discovering networks, identifying clients, mapping network topology, and gathering intelligence 
            before active exploitation.
          </p>

          {/* Recon Types */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Globe className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Passive Recon</h3>
                  <p className="text-sm text-muted-foreground">
                    Listen-only mode. Capture beacons, probes, and traffic without transmitting.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Target className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Active Recon</h3>
                  <p className="text-sm text-muted-foreground">
                    Send probe requests to elicit responses. More data, but detectable.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Users className="w-8 h-8 text-success flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Client Enum</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify devices, their associations, and behavioral patterns.
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
                  <li>• Module 02 completed (monitor mode working)</li>
                  <li>• Interface in monitor mode before starting</li>
                  <li>• Wireshark installed for packet analysis (<code className="text-primary">sudo apt install wireshark</code>)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passive Reconnaissance */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 1: Passive Reconnaissance</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Passive recon involves listening only—no packets are transmitted. This makes you invisible to 
            wireless intrusion detection systems (WIDS).
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1mon"
              description="Basic passive scan - discover all networks"
              explanation="Listens for beacon frames from all access points. Each AP broadcasts beacons ~10 times/second containing SSID, encryption, and capabilities."
            />

            <CommandBlock
              command="sudo airodump-ng wlan1mon --band abg"
              description="Dual-band scan (2.4GHz + 5GHz)"
              explanation="Scans all frequencies. Important because many modern networks operate on 5GHz for less interference. Your Alfa supports both bands."
            />

            <CommandBlock
              command="sudo airodump-ng wlan1mon --manufacturer --wps --uptime"
              description="Extended information scan"
              explanation="--manufacturer shows device vendor from MAC OUI, --wps identifies WPS-enabled networks (potential vulnerability), --uptime shows how long APs have been running."
              output={` BSSID              PWR  Beacons  CH   MB   ENC    WPS   MANUFACTURER  UPTIME    ESSID

 AA:BB:CC:DD:EE:01  -45    234     6   54e  WPA2   2.0   Cisco          3d 4h    CorporateWiFi
 AA:BB:CC:DD:EE:02  -67     89    11  130e  WPA2   No    Ubiquiti       1d 2h    HomeNetwork
 AA:BB:CC:DD:EE:03  -78     45     1   54   OPN    No    TP-Link        0d 1h    GuestNetwork`}
            />

            <CommandBlock
              command="sudo airodump-ng wlan1mon -c 1,6,11 --band bg"
              description="Scan specific channels only"
              explanation="Channels 1, 6, and 11 are non-overlapping in 2.4GHz and most commonly used. Focusing here reduces scan time while covering most networks."
            />

            <CommandBlock
              command="sudo airodump-ng wlan1mon --essid-regex 'Corp|Office|Business'"
              description="Filter by SSID pattern"
              explanation="Regex filtering helps focus on corporate targets. Useful in dense environments with many networks."
            />
          </div>

          {/* Hidden Network Detection */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 2: Hidden Network Detection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Hidden networks don't broadcast their SSID in beacons, appearing as "&lt;length: 0&gt;" in airodump-ng. 
            They're still discoverable through client probe responses.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1mon --berlin 120"
              description="Extended passive listening"
              explanation="--berlin sets the timeout (in seconds) before removing inactive clients. Longer timeouts help discover hidden SSIDs when clients reconnect."
            />

            <CommandBlock
              command="sudo aireplay-ng -0 1 -a AA:BB:CC:DD:EE:FF wlan1mon"
              description="Deauth to reveal hidden SSID (active)"
              explanation="Sends one deauth packet to force a client to reconnect. When it reconnects, it will reveal the hidden SSID in probe requests. (Covered in detail in Module 05)"
            />

            <CommandBlock
              command="sudo tcpdump -i wlan1mon -e -s 0 'type mgt subtype probe-resp' 2>/dev/null | grep -i 'SSID'"
              description="Capture probe responses with tcpdump"
              explanation="Probe responses always contain the SSID. Watching these reveals hidden network names when clients connect."
            />
          </div>

          {/* Client Enumeration */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 3: Client Enumeration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Understanding connected clients is crucial for targeted attacks. Clients reveal valuable 
            information through their behavior.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF wlan1mon"
              description="Focus on single network's clients"
              explanation="Channel lock (-c) and BSSID filter show only clients connected to your target. Watch the STATION section for client MACs."
              output={` CH  6 ][ Elapsed: 2 mins ][ 2024-01-15 15:30

 BSSID              PWR RXQ  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID

 AA:BB:CC:DD:EE:FF  -45 100      567     1234   45   6   54e  WPA2 CCMP   PSK  TargetNetwork

 BSSID              STATION            PWR   Rate    Lost    Frames  Notes  Probes

 AA:BB:CC:DD:EE:FF  11:22:33:44:55:66  -34   54e-54      0      456         iPhone,HomeWiFi
 AA:BB:CC:DD:EE:FF  11:22:33:44:55:77  -56   54e-24      2      123         
 AA:BB:CC:DD:EE:FF  11:22:33:44:55:88  -67   24e-24      5       78         Android`}
            />

            <CommandBlock
              command="sudo tshark -i wlan1mon -Y 'wlan.fc.type_subtype == 0x04' -T fields -e wlan.sa -e wlan_mgt.ssid"
              description="Extract probe requests with tshark"
              explanation="Probe requests (subtype 0x04) reveal what networks a device is looking for. This exposes user's home networks, office networks, etc."
              output={`11:22:33:44:55:66	HomeNetwork
11:22:33:44:55:66	Starbucks WiFi
11:22:33:44:55:77	ASUS_5G
11:22:33:44:55:88	AndroidAP`}
            />

            <CommandBlock
              command="arp-scan -l -I wlan1mon 2>/dev/null || echo 'Note: Only works in managed mode on connected network'"
              description="ARP scan for connected network (managed mode)"
              explanation="When connected to a network, arp-scan discovers all devices on the local subnet with their MAC addresses and vendors."
            />
          </div>

          {/* MAC Address Analysis */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 4: MAC Address Intelligence</h3>
          <p className="text-sm text-muted-foreground mb-4">
            MAC addresses reveal device manufacturers and help identify high-value targets.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1mon --manufacturer"
              description="Show manufacturer information"
              explanation="The first 3 bytes (OUI) of a MAC address identify the manufacturer. Helps identify device types: Apple = iPhones/Macs, Intel = laptops, etc."
            />

            <CommandBlock
              command="grep -i 'AA:BB:CC' /usr/share/ieee-data/oui.txt 2>/dev/null || macchanger -l | grep -i 'AA:BB:CC'"
              description="Manual OUI lookup"
              explanation="Look up the manufacturer for any MAC address prefix. The OUI database maps prefixes to companies."
            />

            <CommandBlock
              command="curl -s 'https://api.macvendors.com/AA:BB:CC:DD:EE:FF'"
              description="Online MAC vendor lookup"
              explanation="API lookup provides manufacturer info. Useful when local database is outdated. Note: Sends MAC to external service."
            />
          </div>

          {/* Signal Strength Analysis */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Understanding Signal Strength (PWR)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">dBm Range</th>
                    <th className="text-left py-2 pr-4 text-foreground">Quality</th>
                    <th className="text-left py-2 text-foreground">Implications</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-success">-30 to -50</td>
                    <td className="py-2 pr-4">Excellent</td>
                    <td className="py-2">Very close proximity. Ideal for attacks.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">-50 to -60</td>
                    <td className="py-2 pr-4">Good</td>
                    <td className="py-2">Same room or adjacent. Reliable capture.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-warning">-60 to -70</td>
                    <td className="py-2 pr-4">Fair</td>
                    <td className="py-2">Different room. May miss some packets.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-destructive">-70 to -90</td>
                    <td className="py-2 pr-4">Weak</td>
                    <td className="py-2">Edge of range. Attacks may fail. Move closer.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Wireshark Analysis */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Phase 5: Deep Packet Analysis with Wireshark</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Wireshark provides visual packet analysis for detailed investigation.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan1mon"
              description="Capture packets for Wireshark analysis"
              explanation="Create a capture file that can be opened in Wireshark for detailed frame-by-frame analysis."
            />

            <CommandBlock
              command="wireshark capture-01.cap &"
              description="Open capture in Wireshark"
              explanation="Launch Wireshark GUI with the capture file. The & runs it in background."
            />

            <CommandBlock
              command="tshark -r capture-01.cap -Y 'eapol'"
              description="Filter EAPOL frames (handshakes)"
              explanation="EAPOL frames contain WPA handshakes. If you see 4 EAPOL packets for the same client, you have a complete handshake."
            />

            <CommandBlock
              command="tshark -r capture-01.cap -Y 'wlan.fc.type == 0' -T fields -e wlan.sa -e wlan.da -e wlan_mgt.ssid | sort | uniq -c | sort -rn"
              description="Analyze management frames"
              explanation="Counts management frame exchanges between devices. High counts indicate active clients worth targeting."
            />
          </div>

          {/* Automated Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automated Reconnaissance Script</h3>
          <ScriptBlock
            title="Comprehensive WiFi Recon"
            filename="wifi_recon.sh"
            language="bash"
            description="Full automated recon with reporting. Usage: sudo bash wifi_recon.sh wlan1mon 120"
            code={reconScript}
          />

          <div className="mt-6">
            <ScriptBlock
              title="Client Enumeration Script"
              filename="client_enum.sh"
              language="bash"
              description="Enumerate and analyze connected clients. Usage: sudo bash client_enum.sh wlan1mon 60"
              code={clientEnumScript}
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
                <span>Performed passive scan and identified networks</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Scanned both 2.4GHz and 5GHz bands</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Enumerated clients on target network</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Identified device manufacturers from MAC addresses</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Analyzed capture in Wireshark</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Generated reconnaissance report</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
