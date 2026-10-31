import { Radar, AlertTriangle, Info, MapPin, Database, Satellite, Monitor } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const AdvancedRecon = () => {
  const gpsdScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# GPSD Setup & Wardriving Script
# Integrates GPS with wireless scanning tools
# Usage: sudo bash gpsd_wardrive.sh <interface> [duration_minutes]

set -e

INTERFACE=\${1:-wlan1mon}
DURATION=\${2:-30}
OUTPUT_DIR="./wardrive_\$(date +%Y%m%d_%H%M%S)"

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

print_status() { echo -e "\${CYAN}[*]\${NC} \$1"; }
print_success() { echo -e "\${GREEN}[+]\${NC} \$1"; }
print_warning() { echo -e "\${YELLOW}[!]\${NC} \$1"; }
print_error() { echo -e "\${RED}[-]\${NC} \$1"; }

mkdir -p "\$OUTPUT_DIR"

echo "=========================================="
echo "     GPSD Wardriving Setup"
echo "=========================================="
echo ""

# Step 1: Install GPSD
print_status "Installing GPSD and dependencies..."
sudo apt install -y gpsd gpsd-clients

# Step 2: Detect GPS device
GPS_DEV=""
for dev in /dev/ttyUSB0 /dev/ttyACM0 /dev/ttyS0; do
    if [ -e "\$dev" ]; then
        GPS_DEV="\$dev"
        break
    fi
done

if [ -z "\$GPS_DEV" ]; then
    print_error "No GPS device found!"
    print_status "Connect a USB GPS receiver and try again"
    print_status "Common devices: BU-353S4, VK-162, U-blox 7"
    exit 1
fi

print_success "GPS device found: \$GPS_DEV"

# Step 3: Configure and start GPSD
print_status "Stopping existing GPSD instances..."
sudo systemctl stop gpsd gpsd.socket 2>/dev/null || true
sudo killall gpsd 2>/dev/null || true

print_status "Starting GPSD on \$GPS_DEV..."
sudo gpsd \$GPS_DEV -F /var/run/gpsd.sock

# Step 4: Verify GPS fix
print_status "Waiting for GPS fix (this may take 30-60 seconds outdoors)..."
for i in {1..30}; do
    FIX=\$(gpspipe -w -n 5 2>/dev/null | grep -c '"class":"TPV"' || echo "0")
    if [ "\$FIX" -gt 0 ]; then
        print_success "GPS fix acquired!"
        cgps -s &
        CGPS_PID=\$!
        sleep 3
        kill \$CGPS_PID 2>/dev/null || true
        break
    fi
    echo -ne "\\r\${CYAN}[*]\${NC} Waiting for satellites... (\$i/30)  "
    sleep 2
done

# Step 5: Start airodump-ng with GPS logging
print_status "Starting GPS-enabled airodump-ng scan..."
print_status "Duration: \$DURATION minutes"
print_status "Output: \$OUTPUT_DIR/"

timeout \$((DURATION * 60)) airodump-ng \$INTERFACE \\
    --gpsd \\
    --write "\$OUTPUT_DIR/wardrive" \\
    --output-format csv,kismet,netxml \\
    --band abg 2>/dev/null || true

print_success "Wardrive complete!"
print_status "Files saved to \$OUTPUT_DIR/"
print_status "Import CSV to WiGLE.net for visualization"`;

  const kismetScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# Kismet Installation & Configuration Script
# Professional wireless IDS/scanner with WebUI
# Usage: sudo bash setup_kismet.sh <interface>

set -e

INTERFACE=\${1:-wlan1}

echo "=========================================="
echo "     Kismet Setup & Configuration"
echo "=========================================="
echo ""

# Install Kismet
echo "[*] Adding Kismet repository..."
wget -O - https://www.kismetwireless.net/repos/kismet-release.gpg.key | \\
    sudo gpg --dearmor -o /usr/share/keyrings/kismet-archive-keyring.gpg 2>/dev/null

echo "deb [signed-by=/usr/share/keyrings/kismet-archive-keyring.gpg] \\
https://www.kismetwireless.net/repos/apt/release/kali kali main" | \\
    sudo tee /etc/apt/sources.list.d/kismet.list

sudo apt update
sudo apt install -y kismet

# Add user to kismet group
sudo usermod -aG kismet \$USER

# Configure Kismet
echo "[*] Creating Kismet configuration..."
mkdir -p ~/.kismet

cat > ~/.kismet/kismet_site.conf << EOF
# Kismet Site Configuration
# Override default settings here

# Data sources
source=\$INTERFACE:type=linuxwifi

# Enable GPS if available
gps=gpsd:host=localhost,port=2947

# Logging
log_prefix=./kismet_logs
log_types=kismet,pcapng

# WebUI settings
httpd_port=2501
httpd_bind_address=0.0.0.0

# Alerting
alert=ADVERT_SSID_CHANGE
alert=BCASTDISCON
alert=DEAUTHFLOOD
alert=CRYPTCHANGE
EOF

echo "[+] Configuration saved to ~/.kismet/kismet_site.conf"
echo ""
echo "[*] Starting Kismet..."
echo "[+] WebUI available at: http://localhost:2501"
echo "[!] Default credentials: Set on first login"
echo ""

kismet`;

  const sparrowScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# Sparrow-WiFi Installation Script
# GPS-enabled WiFi spectrum analyzer
# Usage: sudo bash setup_sparrow.sh

set -e

echo "=========================================="
echo "     Sparrow-WiFi Setup"
echo "=========================================="
echo ""

# Install dependencies
echo "[*] Installing dependencies..."
sudo apt install -y python3-pip python3-pyqt5 python3-pyqt5.qtchart \\
    gpsd gpsd-clients iw wireless-tools aircrack-ng

# Clone Sparrow-WiFi
echo "[*] Cloning Sparrow-WiFi repository..."
cd /opt
sudo git clone https://github.com/ghostop14/sparrow-wifi.git 2>/dev/null || \\
    echo "[*] Repository already exists"
cd sparrow-wifi

# Install Python dependencies
echo "[*] Installing Python packages..."
sudo pip3 install gps3 dronekit manuf python-dateutil numpy

echo ""
echo "[+] Sparrow-WiFi installed!"
echo "[*] Run with: cd /opt/sparrow-wifi && sudo python3 sparrow-wifi.py"
echo ""
echo "[*] Features:"
echo "  - Real-time signal strength visualization"
echo "  - GPS mapping of access points"
echo "  - Drone integration for aerial scanning"
echo "  - Channel utilization analysis"
echo "  - Export to KML for Google Earth"`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Radar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 09</span>
              <h2 className="text-2xl font-bold text-foreground">Advanced Reconnaissance Tools</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Beyond basic airodump-ng scanning, professional WiFi assessments use specialized tools for 
            GPS-tagged wardriving, spectrum analysis, OSINT, and visual network mapping. This module 
            covers GPSD, Kismet, Sparrow-WiFi, WiFi_DB, LinSSID, and WiGLE.
          </p>

          {/* GPSD Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              GPSD — GPS Daemon for Geolocation
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is GPSD?</strong> A daemon that interfaces with GPS receivers, 
                providing location data to any application. Essential for wardriving — mapping networks to physical locations.
              </p>
              <p>
                <strong className="text-foreground">Why It Matters:</strong> Geolocation data in your pentest report proves 
                which physical locations are vulnerable. It also helps identify rogue APs by correlating signal strength with position.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">GPSD Installation & Setup</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y gpsd gpsd-clients"
              description="Step 1: Install GPSD and client utilities"
              explanation="gpsd is the daemon; gpsd-clients includes cgps (terminal GPS viewer), xgps (graphical), and gpspipe (raw NMEA output)."
            />
            <CommandBlock
              command="ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null"
              description="Step 2: Find your GPS device"
              explanation="USB GPS receivers appear as /dev/ttyUSB0 or /dev/ttyACM0. Common devices: GlobalSat BU-353S4, VK-162, U-blox 7."
              output={`/dev/ttyUSB0`}
            />
            <CommandBlock
              command="sudo systemctl stop gpsd gpsd.socket && sudo gpsd /dev/ttyUSB0 -F /var/run/gpsd.sock"
              description="Step 3: Start GPSD"
              explanation="Stop any existing instances first, then start GPSD pointed at your GPS device. The -F flag specifies the control socket."
            />
            <CommandBlock
              command="cgps -s"
              description="Step 4: Verify GPS fix"
              explanation="cgps displays real-time GPS data in terminal. Wait for 'Status: 3D Fix'. Takes 30-60 seconds with clear sky view. Press 'q' to quit."
              output={`┌───────────────────────────────────────────┐
│    Time:       2024-01-15T14:30:45.000Z   │
│    Latitude:    40.7128 N                  │
│    Longitude:  -74.0060 W                  │
│    Altitude:   10.5 m                      │
│    Speed:      0.0 km/h                    │
│    Status:     3D Fix                      │
│    Sats Used:  8                           │
└───────────────────────────────────────────┘`}
            />
            <CommandBlock
              command="gpspipe -w -n 10 | grep TPV"
              description="Step 5: Raw GPS JSON output"
              explanation="gpspipe outputs raw JSON from GPSD. TPV (Time-Position-Velocity) objects contain lat/lon. Useful for scripting."
              output={`{"class":"TPV","time":"2024-01-15T14:30:45.000Z","lat":40.7128,"lon":-74.0060,"alt":10.5}`}
            />
            <CommandBlock
              command="sudo airodump-ng wlan1mon --gpsd --write wardrive --output-format csv,kismet,netxml"
              description="Step 6: Wardriving with airodump-ng + GPS"
              explanation="The --gpsd flag tells airodump-ng to tag each discovered network with GPS coordinates. The CSV output includes lat/lon columns."
            />
          </div>

          {/* Kismet Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-accent" />
              Kismet — Wireless Network Detector & Sniffer
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Kismet?</strong> A passive wireless network detector, sniffer, 
                wardriving tool, and wireless IDS. It works with WiFi, Bluetooth, SDR, and more via a modern WebUI.
              </p>
              <p>
                <strong className="text-foreground">Advantages over airodump-ng:</strong> Web-based interface, persistent 
                database (KismetDB/SQLite), alerting for suspicious activity (deauth floods, SSID changes), GPS integration, 
                Bluetooth scanning, and plugin support.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Kismet WebUI Setup</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y kismet"
              description="Step 1: Install Kismet"
              explanation="Installs from Kali repos. For latest version, add Kismet's official repository."
            />
            <CommandBlock
              command="sudo usermod -aG kismet $USER"
              description="Step 2: Add user to kismet group"
              explanation="Allows running Kismet without root. You must log out and back in for this to take effect."
            />
            <CommandBlock
              command="kismet -c wlan1"
              description="Step 3: Start Kismet with your adapter"
              explanation="-c specifies the capture source. Kismet automatically puts the interface into monitor mode. WebUI starts on port 2501."
              output={`INFO: Starting Kismet...
INFO: Starting web server on port 2501
INFO: Set login: admin / [auto-generated password]
INFO: Data source wlan1 (linuxwifi) opened successfully`}
            />
            <CommandBlock
              command="firefox http://localhost:2501 &"
              description="Step 4: Open Kismet WebUI"
              explanation="Access the WebUI in your browser. Set your admin password on first login. The dashboard shows real-time network discovery."
            />
            <CommandBlock
              command="kismet -c wlan1 --override gps=gpsd:host=localhost,port=2947"
              description="Step 5: Kismet with GPS integration"
              explanation="Enables GPS tracking through GPSD. Networks are tagged with coordinates and can be exported as KML for Google Earth."
            />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">KismetDB Tools — Analyzing Kismet Databases</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="ls -la ~/.kismet/logs/*.kismet"
              description="Find Kismet database files"
              explanation="Kismet saves all data to SQLite databases (.kismet files). Each session creates a new file."
            />
            <CommandBlock
              command="kismetdb_to_pcap --in Kismet-*.kismet --out all_packets.pcapng"
              description="Export packets from KismetDB"
              explanation="Extracts all captured packets from the Kismet database into a standard pcapng file for Wireshark analysis."
            />
            <CommandBlock
              command="kismetdb_to_wiglecsv --in Kismet-*.kismet --out wigle_upload.csv"
              description="Export to WiGLE CSV format"
              explanation="Converts KismetDB data to WiGLE-compatible CSV for uploading to WiGLE.net for network mapping."
            />
            <CommandBlock
              command="kismetdb_dump_devices --in Kismet-*.kismet --out devices.json"
              description="Export all discovered devices as JSON"
              explanation="Dumps every device (APs, clients, Bluetooth) with full metadata. Great for automated analysis and reporting."
            />
            <CommandBlock
              command={`sqlite3 Kismet-*.kismet "SELECT devmac, type, CAST(device AS TEXT) FROM devices WHERE type='Wi-Fi AP' LIMIT 10;"`}
              description="Direct SQL queries on KismetDB"
              explanation="KismetDB is SQLite — query directly for custom analysis. Device details are stored as JSON blobs."
            />
          </div>

          {/* Sparrow-WiFi */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Satellite className="w-5 h-5 text-success" />
              Sparrow-WiFi — Spectrum Analyzer
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Sparrow-WiFi?</strong> A graphical WiFi spectrum analyzer 
                with GPS, drone integration, and real-time signal visualization. Shows channel utilization, signal strength 
                over time, and AP density.
              </p>
              <p>
                <strong className="text-foreground">Use Cases:</strong> Identify channel congestion, locate rogue APs by 
                signal triangulation, visualize 2.4/5GHz spectrum usage, export data for Google Earth KML mapping.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y python3-pip python3-pyqt5 python3-pyqt5.qtchart && sudo pip3 install gps3 manuf"
              description="Install Sparrow-WiFi dependencies"
              explanation="Requires PyQt5 for the GUI, gps3 for GPS integration, and manuf for MAC OUI lookups."
            />
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/ghostop14/sparrow-wifi.git && cd sparrow-wifi && sudo python3 sparrow-wifi.py"
              description="Install and launch Sparrow-WiFi"
              explanation="Clone from GitHub and run directly. The GUI shows real-time spectrum analysis with channel graphs."
            />
            <CommandBlock
              command="sudo python3 /opt/sparrow-wifi/sparrow-wifi.py --interface wlan1mon --gps"
              description="Launch with GPS enabled"
              explanation="Enables GPS tracking for all discovered networks. Create heatmaps showing signal strength across physical space."
            />
          </div>

          {/* WiFi_DB */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-warning" />
              WiFi_DB — Wireless Network Database
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is WiFi_DB?</strong> A tool that imports scan data from 
                airodump-ng, Kismet, and other tools into a searchable SQLite database with a web interface. Centralizes 
                all wireless recon data.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/nicpenning/wifi_db.git && cd wifi_db && pip3 install -r requirements.txt"
              description="Install WiFi_DB"
              explanation="Clone and install dependencies. WiFi_DB provides a web dashboard for all your wardriving data."
            />
            <CommandBlock
              command="python3 /opt/wifi_db/wifi_db.py --import-kismet Kismet-*.kismet"
              description="Import Kismet data"
              explanation="Imports all networks and clients from KismetDB files into WiFi_DB's unified database."
            />
            <CommandBlock
              command="python3 /opt/wifi_db/wifi_db.py --import-csv wardrive-01.csv"
              description="Import airodump-ng CSV data"
              explanation="Imports airodump-ng CSV scan results. Merges with existing data to build comprehensive network inventory."
            />
            <CommandBlock
              command="python3 /opt/wifi_db/wifi_db.py --web --port 8080"
              description="Start WiFi_DB web interface"
              explanation="Launches web dashboard at http://localhost:8080. Search, filter, and export network data."
            />
          </div>

          {/* LinSSID */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">LinSSID — Graphical WiFi Scanner</h3>
          <p className="text-sm text-muted-foreground mb-4">
            LinSSID provides a real-time graphical view of nearby WiFi networks, similar to inSSIDer for Windows.
          </p>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y linssid"
              description="Install LinSSID"
              explanation="Available in most Linux repos. Provides graphical signal strength charts and channel overlap visualization."
            />
            <CommandBlock
              command="sudo linssid"
              description="Launch LinSSID"
              explanation="Must run as root for wireless scanning. Shows real-time signal strength graphs, channel usage, encryption types, and more."
            />
          </div>

          {/* WiGLE */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-destructive" />
              WiGLE — Wireless Geographic Logging Engine (OSINT)
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is WiGLE?</strong> The world's largest database of wireless 
                networks. Contains over 1 billion WiFi networks mapped by wardriving contributors. Available at wigle.net.
              </p>
              <p>
                <strong className="text-foreground">OSINT Value:</strong> Look up target networks by SSID or BSSID 
                to find their physical location WITHOUT being on-site. Identify network naming patterns, discover 
                branch offices, and map corporate WiFi footprints.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="pip3 install wiggle"
              description="Install WiGLE Python client"
              explanation="The unofficial Python client lets you query WiGLE's API from the command line."
            />
            <CommandBlock
              command={`curl -s "https://api.wigle.net/api/v2/network/search?ssid=TargetCorp" -H "Authorization: Basic $(echo -n 'API_NAME:API_TOKEN' | base64)"`}
              description="Search WiGLE API by SSID"
              explanation="Query WiGLE's API for any SSID. Returns GPS coordinates, encryption type, first/last seen dates. Requires free API key from wigle.net."
              output={`{
  "results": [
    {
      "ssid": "TargetCorp",
      "netid": "AA:BB:CC:DD:EE:FF",
      "trilat": 40.7128,
      "trilong": -74.0060,
      "encryption": "wpa2",
      "lasttime": "2024-01-15T14:30:00.000Z"
    }
  ]
}`}
            />
            <CommandBlock
              command={`curl -s "https://api.wigle.net/api/v2/network/search?netid=AA:BB:CC:DD:EE:FF" -H "Authorization: Basic $(echo -n 'API_NAME:API_TOKEN' | base64)"`}
              description="Search WiGLE by BSSID (MAC address)"
              explanation="Look up exact AP location by MAC. Useful for finding physical location of a specific access point."
            />
            <CommandBlock
              command="kismetdb_to_wiglecsv --in Kismet-*.kismet --out upload_to_wigle.csv"
              description="Upload your wardriving data to WiGLE"
              explanation="Convert your scan data to WiGLE format and upload to contribute to the database. Earns WiGLE points."
            />
          </div>

          {/* Automation Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Automation Scripts</h3>
          <div className="space-y-6 mb-8">
            <ScriptBlock
              title="GPSD Wardriving Automation"
              filename="gpsd_wardrive.sh"
              language="bash"
              description="Automated wardriving with GPS integration — scans all bands, tags with coordinates, generates reports"
              code={gpsdScript}
            />
            <ScriptBlock
              title="Kismet Setup & Configuration"
              filename="setup_kismet.sh"
              language="bash"
              description="Installs Kismet, configures WebUI, GPS integration, and alerting"
              code={kismetScript}
            />
            <ScriptBlock
              title="Sparrow-WiFi Installation"
              filename="setup_sparrow.sh"
              language="bash"
              description="Installs Sparrow-WiFi spectrum analyzer with all dependencies"
              code={sparrowScript}
            />
          </div>

          {/* Completion Checklist */}
          <div className="mt-8 p-5 rounded-xl border border-success/50 bg-success/10">
            <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Module Completion Checklist
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "GPSD installed and receiving satellite fix",
                "Airodump-ng wardriving with GPS tagging working",
                "Kismet WebUI accessible and scanning",
                "KismetDB export tools working (pcap, WiGLE CSV, JSON)",
                "Sparrow-WiFi spectrum analyzer running",
                "WiFi_DB importing scan data successfully",
                "LinSSID showing graphical channel analysis",
                "WiGLE API queried for target OSINT"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
