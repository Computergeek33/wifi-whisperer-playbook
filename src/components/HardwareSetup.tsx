import { Cpu, Wifi, Check, AlertTriangle } from "lucide-react";
import { CommandBlock } from "./CommandBlock";
import { ScriptBlock } from "./ScriptBlock";

export const HardwareSetup = () => {
  const installScript = `#!/bin/bash
# Alfa AWUS036ACH Driver Installation Script
# For Raspberry Pi 4 running Kali Linux

set -e

echo "[*] Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "[*] Installing required dependencies..."
sudo apt install -y dkms git build-essential bc libelf-dev linux-headers-$(uname -r)

echo "[*] Cloning RTL8812AU driver repository..."
cd /tmp
git clone https://github.com/aircrack-ng/rtl8812au.git
cd rtl8812au

echo "[*] Compiling and installing driver..."
sudo make dkms_install

echo "[*] Loading the driver module..."
sudo modprobe 88XXau

echo "[+] Installation complete! Verify with 'iwconfig'."
echo "[+] Your adapter should appear as wlan1 or similar."`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-mono text-primary">MODULE 01</span>
              <h2 className="text-2xl font-bold text-foreground">Hardware Setup</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Before diving into WiFi penetration testing, you need to properly set up your hardware.
            This module covers the Raspberry Pi 4 and Alfa AWUS036ACH adapter installation.
          </p>

          {/* Hardware Overview */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Cpu className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Raspberry Pi 4</h3>
                  <p className="text-sm text-muted-foreground">
                    4GB or 8GB RAM recommended. Install Kali Linux ARM image and verify each tool’s ARM support.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <Wifi className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Alfa AWUS036ACH</h3>
                  <p className="text-sm text-muted-foreground">
                    Dual-band AC1200 adapter with monitor mode and packet injection support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites Alert */}
          <div className="p-4 rounded-lg border border-warning/50 bg-warning/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Prerequisites</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Raspberry Pi 4 with Kali Linux installed</li>
                  <li>• Active internet connection via Ethernet</li>
                  <li>• Alfa AWUS036ACH connected via USB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step-by-step commands */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Step-by-Step Installation</h3>
          <div className="space-y-4 mb-8">
            <CommandBlock
              command="sudo apt update && sudo apt upgrade -y"
              description="Step 1: Update your system"
              explanation="Ensures all packages are current before installing new drivers. This does not guarantee dependency compatibility; record the kernel and matching headers and plan recovery."
            />

            <CommandBlock
              command="sudo apt install -y dkms git build-essential bc libelf-dev linux-headers-$(uname -r)"
              description="Step 2: Install build dependencies"
              explanation="DKMS manages kernel modules across updates. Build-essential provides compilers. Linux headers are required for driver compilation."
            />

            <CommandBlock
              command="git clone https://github.com/aircrack-ng/rtl8812au.git"
              description="Step 3: Clone the driver repository"
              explanation="Historical driver path: the upstream README now directs users toward mac80211 rtw88. Confirm your exact kernel/driver/device matrix before installation; neither this example nor capability output is hardware validation."
            />

            <CommandBlock
              command="cd rtl8812au && sudo make dkms_install"
              description="Step 4: Compile and install the driver"
              explanation="DKMS installation automatically rebuilds the driver when the kernel updates."
            />

            <CommandBlock
              command="sudo modprobe 88XXau"
              description="Step 5: Load the driver module"
              explanation="Loads the newly installed driver into the running kernel without requiring a reboot."
            />

            <CommandBlock
              command="iwconfig"
              description="Step 6: Verify installation"
              explanation="Check that your adapter appears (usually as wlan1). You should see it listed with wireless extensions."
              output={`wlan0     IEEE 802.11  ESSID:off/any  
          Mode:Managed  Access Point: Not-Associated   
          
wlan1     IEEE 802.11AC  ESSID:off/any  
          Mode:Managed  Frequency:2.412 GHz  
          Access Point: Not-Associated   Tx-Power=20 dBm`}
            />
          </div>

          {/* Automated Script */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Automated Installation Script</h3>
          <ScriptBlock
            title="Complete Driver Installation"
            filename="install_alfa.sh"
            language="bash"
            description="Archived installation example, disabled pending current driver/kernel validation. Use the equipment foundations lesson for the current decision process."
            code={installScript}
          />

          {/* Completion Checklist */}
          <div className="mt-8 p-5 rounded-xl border border-success/50 bg-success/10">
            <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Module Completion Checklist
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Raspberry Pi 4 running Kali Linux</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Alfa adapter driver installed and loaded</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                <span>Adapter visible in iwconfig output</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
