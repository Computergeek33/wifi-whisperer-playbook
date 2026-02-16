export interface ModuleMindset {
  mindset: string;
  thinkLike: string[];
  keyTools: { name: string; purpose: string }[];
  commonMistakes: string[];
  proTips: string[];
}

export const moduleMindsets: Record<string, ModuleMindset> = {
  "hardware-setup": {
    mindset: "You're building your weapon. Every pentester's kit starts with reliable, battle-tested hardware. A misconfigured adapter means failed captures, missed handshakes, and a wasted engagement. Treat this like a surgeon prepping instruments — precision matters.",
    thinkLike: [
      "Does my adapter support monitor mode AND packet injection?",
      "Are my drivers compiled against the EXACT kernel version running?",
      "Will DKMS keep my driver alive after kernel updates?",
      "Am I using the community-patched driver, not the stock one?",
    ],
    keyTools: [
      { name: "apt / apt-get", purpose: "Package management — update, install dependencies" },
      { name: "git clone", purpose: "Pull driver source from aircrack-ng fork" },
      { name: "make dkms_install", purpose: "Compile and register driver with DKMS" },
      { name: "modprobe", purpose: "Load kernel module with dependency resolution" },
      { name: "iwconfig", purpose: "Verify wireless interface detection and mode" },
    ],
    commonMistakes: [
      "Forgetting to update before installing — causes header mismatch",
      "Using Realtek's stock driver instead of aircrack-ng fork",
      "Hardcoding kernel version instead of $(uname -r)",
      "Using insmod instead of modprobe (no dependency handling)",
    ],
    proTips: [
      "Always keep a backup adapter — hardware fails at the worst time",
      "Test packet injection immediately: aireplay-ng --test wlan1",
      "Label your adapters if you carry multiple",
    ],
  },
  "monitor-mode": {
    mindset: "You're switching from a passive observer to an all-seeing eye. In Managed mode, your adapter only hears traffic meant for it. In Monitor mode, you hear EVERYTHING — every beacon, every probe, every handshake. This is where reconnaissance begins.",
    thinkLike: [
      "Which interface is my external adapter vs the built-in WiFi?",
      "Have I killed ALL interfering processes, not just NetworkManager?",
      "Am I on Ethernet before killing WiFi services?",
      "Did I VERIFY monitor mode is active, or just assume?",
    ],
    keyTools: [
      { name: "iwconfig", purpose: "Check interface mode and identify adapters" },
      { name: "airmon-ng check kill", purpose: "Kill ALL interfering processes" },
      { name: "ip link set down/up", purpose: "Toggle interface state for mode change" },
      { name: "iw dev set type monitor", purpose: "Enable RFMON monitor mode" },
      { name: "airodump-ng", purpose: "Channel-hopping network scanner" },
    ],
    commonMistakes: [
      "Forgetting to kill interfering processes — causes random mode resets",
      "Using wlan0 instead of wlan1 — kills your own connection",
      "Not verifying mode change with iwconfig after setting it",
      "Skipping the interface down step before mode change",
    ],
    proTips: [
      "Always SSH via Ethernet when doing wireless pentesting",
      "Use tmux/screen so you don't lose sessions if something breaks",
      "Channel lock with -c flag when you know your target's channel",
    ],
  },
  "network-discovery": {
    mindset: "You're a cartographer mapping enemy territory. Before any attack, you need to know EXACTLY what's out there — every AP, every client, every hidden network. The more you know about the target environment, the more surgical your attacks can be.",
    thinkLike: [
      "What encryption is each network using? (OPN, WEP, WPA, WPA2, WPA3)",
      "How many clients are connected? Active vs idle?",
      "Are there hidden SSIDs I'm missing?",
      "Which channels are most congested?",
      "What's the signal strength — am I close enough?",
    ],
    keyTools: [
      { name: "airodump-ng", purpose: "Primary scanner — APs, clients, channels, encryption" },
      { name: "wash", purpose: "Detect WPS-enabled networks" },
      { name: "tshark", purpose: "Packet-level analysis and filtering" },
      { name: "macchanger", purpose: "Spoof MAC for anonymity" },
      { name: "wireshark", purpose: "Deep packet inspection and protocol analysis" },
    ],
    commonMistakes: [
      "Rushing into attacks without mapping the full environment",
      "Ignoring client probe requests — they reveal preferred networks",
      "Not noting signal strength — weak signals = unreliable attacks",
      "Forgetting to check for WPS alongside WPA2",
    ],
    proTips: [
      "Save airodump-ng output with -w flag — you'll need it later",
      "Probe requests reveal networks clients have connected to before",
      "Hidden SSIDs are revealed when a client connects — be patient",
    ],
  },
  "wpa-cracking": {
    mindset: "This is the heart of WiFi pentesting. You're not 'hacking' the encryption — you're capturing the 4-way handshake and racing to find the password offline. Speed depends on your wordlist quality and GPU power. A weak password falls in seconds; a strong one may never fall.",
    thinkLike: [
      "Do I have a COMPLETE 4-way handshake (all 4 EAPOL frames)?",
      "Is my wordlist tailored to the target? (company name, location, patterns)",
      "Should I use hashcat (GPU) or aircrack-ng (CPU)?",
      "Have I tried PMKID attack first? It doesn't need a client.",
    ],
    keyTools: [
      { name: "airodump-ng -c --bssid -w", purpose: "Targeted capture on specific AP" },
      { name: "aireplay-ng -0", purpose: "Deauth to force handshake re-exchange" },
      { name: "aircrack-ng", purpose: "CPU-based dictionary attack" },
      { name: "hashcat -m 22000", purpose: "GPU-accelerated cracking" },
      { name: "hcxpcapngtool", purpose: "Convert capture to hashcat format" },
    ],
    commonMistakes: [
      "Attacking without a complete handshake — partial captures won't crack",
      "Using generic wordlists instead of targeted ones",
      "Running CPU cracking when GPU would be 100x faster",
      "Not trying PMKID first — it works without ANY client",
    ],
    proTips: [
      "Custom wordlists > generic ones. Use CeWL on company website",
      "PMKID attack (hashcat -m 22000) needs zero clients connected",
      "Always verify handshake with aircrack-ng before spending GPU time",
    ],
  },
  "deauth-attacks": {
    mindset: "Deauthentication is your Swiss Army knife — it forces clients to reconnect, giving you handshakes, disrupting connections, and enabling evil twin attacks. But it's loud. IDS systems detect mass deauth instantly. Be surgical, not reckless.",
    thinkLike: [
      "Do I need broadcast deauth or targeted single-client?",
      "How many deauth frames is enough? (Less is stealthier)",
      "Is there a WIDS/WIPS that will detect and alert on deauth floods?",
      "Am I on the correct channel for the target AP?",
    ],
    keyTools: [
      { name: "aireplay-ng -0", purpose: "Send deauthentication frames" },
      { name: "mdk4 d", purpose: "Advanced deauth with MAC spoofing" },
      { name: "airodump-ng", purpose: "Monitor for handshake capture during deauth" },
    ],
    commonMistakes: [
      "Sending too many deauth frames — triggers IDS alerts",
      "Not being on the target's channel — deauth frames go unheard",
      "Using broadcast deauth when only one client is needed",
      "Forgetting to run airodump-ng in parallel to capture handshake",
    ],
    proTips: [
      "3-5 targeted deauths are usually enough — don't flood",
      "Run deauth and capture in separate terminals simultaneously",
      "Some clients are stubborn — try deauthing different clients",
    ],
  },
  "evil-twin": {
    mindset: "You're becoming the network. An evil twin is social engineering meets technical execution — you create a perfect copy of a trusted network and wait for victims to connect. The captive portal is your phishing page. Every detail matters: same SSID, same security appearance.",
    thinkLike: [
      "Does my rogue AP SSID exactly match the target?",
      "Am I deauthing the real AP to force clients to me?",
      "Is my captive portal convincing enough?",
      "Am I capturing credentials securely?",
    ],
    keyTools: [
      { name: "hostapd", purpose: "Create the rogue access point" },
      { name: "dnsmasq", purpose: "DHCP and DNS for the rogue network" },
      { name: "iptables", purpose: "Traffic routing and captive portal redirect" },
      { name: "aireplay-ng -0", purpose: "Deauth real AP to push clients to twin" },
    ],
    commonMistakes: [
      "SSID mismatch — one character off and clients won't auto-connect",
      "Forgetting IP forwarding — clients connect but can't reach portal",
      "Captive portal looks fake — users get suspicious",
      "Not deauthing the real AP — clients prefer stronger signal",
    ],
    proTips: [
      "Clone the target's actual login page for maximum credibility",
      "Higher TX power wins — position your rogue AP closer to targets",
      "Log everything — you need proof for the report",
    ],
  },
  "wps-attacks": {
    mindset: "WPS is a convenience feature that became a security nightmare. The 8-digit PIN has a design flaw that reduces the keyspace from 100 million to ~11,000 combinations. If WPS is enabled, it's often the fastest path to the network password.",
    thinkLike: [
      "Is WPS actually enabled on the target?",
      "Is it locked after failed attempts? (Rate limiting)",
      "Should I try Pixie Dust first? (Instant if vulnerable)",
      "Is the AP using a known default PIN?",
    ],
    keyTools: [
      { name: "wash", purpose: "Discover WPS-enabled networks" },
      { name: "reaver", purpose: "WPS PIN brute force" },
      { name: "bully", purpose: "Alternative WPS brute force" },
      { name: "reaver -K / bully -d", purpose: "Pixie Dust offline attack" },
    ],
    commonMistakes: [
      "Brute-forcing without checking for Pixie Dust first",
      "Not checking if WPS is locked/rate-limited",
      "Using wrong interface or not being in monitor mode",
      "Ignoring wash output — it shows WPS lock status",
    ],
    proTips: [
      "Always try Pixie Dust first — instant result if vulnerable",
      "If rate-limited, try -d 60 flag for longer delays between attempts",
      "Some routers unlock WPS after a timeout — be patient",
    ],
  },
  "advanced-recon": {
    mindset: "Advanced recon is intelligence gathering at scale. You're no longer scanning a single building — you're mapping entire cities, correlating GPS data, and cross-referencing with OSINT databases. This is how nation-state actors and red teams operate.",
    thinkLike: [
      "Can I correlate WiFi data with physical locations?",
      "What does WiGLE reveal about the target's network history?",
      "Am I capturing enough metadata for the report?",
      "Which tool gives me the best persistent monitoring?",
    ],
    keyTools: [
      { name: "gpsd", purpose: "GPS daemon for wardriving coordinates" },
      { name: "kismet", purpose: "Wireless IDS and persistent network database" },
      { name: "sparrow-wifi", purpose: "GUI-based WiFi analysis with GPS" },
      { name: "wigle.net", purpose: "Global WiFi OSINT database" },
      { name: "linssid", purpose: "Real-time signal strength visualization" },
    ],
    commonMistakes: [
      "Not calibrating GPS before starting wardriving",
      "Ignoring Kismet alerts — they reveal hidden networks and anomalies",
      "Not saving data persistently — you lose hours of scanning",
    ],
    proTips: [
      "WiGLE can reveal if a target network was seen at other locations",
      "Kismet's REST API enables automated monitoring scripts",
      "Combine GPS data with Google Earth for stunning report visuals",
    ],
  },
  "online-bruteforce": {
    mindset: "Unlike offline cracking, online brute force hits a live authentication server. It's slow, noisy, and rate-limited — but it's the only option against WPA-Enterprise and WPA3-SAE. Success depends on smart username/password selection.",
    thinkLike: [
      "What authentication protocol is the target using?",
      "Do I have a valid username list?",
      "Will account lockout trigger and alert the SOC?",
      "Is timing-based evasion necessary?",
    ],
    keyTools: [
      { name: "air-hammer", purpose: "WPA-Enterprise online brute force" },
      { name: "wacker", purpose: "WPA3-SAE online dictionary attack" },
      { name: "wifibf", purpose: "Managed-mode WiFi brute force" },
    ],
    commonMistakes: [
      "Not checking for account lockout policies first",
      "Using huge wordlists — online attacks are slow",
      "Forgetting that WPA3-SAE has anti-brute-force protections",
    ],
    proTips: [
      "Target common usernames: admin, helpdesk, IT, service accounts",
      "Time attacks during business hours when auth failures blend in",
      "WPA3's SAE is resistant but not immune to smart dictionary attacks",
    ],
  },
  "automated-frameworks": {
    mindset: "Frameworks automate the grind, but you must understand what they're doing under the hood. A tool that runs 10 attacks automatically is powerful — but if you can't explain each step in your report, you're not a pentester, you're a button-pusher.",
    thinkLike: [
      "What attacks is this framework running and in what order?",
      "Can I reproduce each finding manually if challenged?",
      "Am I logging everything for the report?",
      "Is automation appropriate here, or should I be surgical?",
    ],
    keyTools: [
      { name: "wifite2", purpose: "Automated wireless audit tool" },
      { name: "fern", purpose: "GUI-based WiFi cracker" },
      { name: "h4rpy", purpose: "Automated evil twin framework" },
    ],
    commonMistakes: [
      "Running automated attacks without understanding the output",
      "Not saving logs — framework output IS your evidence",
      "Trusting automation blindly — false positives happen",
    ],
    proTips: [
      "Run frameworks first for quick wins, then go manual for depth",
      "Always verify automated findings with manual techniques",
      "Use --kill flag in wifite2 to handle interfering processes",
    ],
  },
  "advanced-evil-twin": {
    mindset: "Enterprise evil twins target the crown jewels — corporate credentials. WPA-Enterprise (802.1X) uses RADIUS authentication, and by spoofing the auth server, you can harvest domain credentials. This is the difference between getting a WiFi password and getting Active Directory access.",
    thinkLike: [
      "What EAP method is the enterprise using? (PEAP, EAP-TLS, EAP-TTLS)",
      "Do clients validate the RADIUS server certificate?",
      "Can I capture MSCHAPv2 hashes and crack them offline?",
      "Is my captive portal customized for the target organization?",
    ],
    keyTools: [
      { name: "eaphammer", purpose: "WPA-Enterprise evil twin with RADIUS" },
      { name: "wifipumpkin3", purpose: "Modular rogue AP framework" },
      { name: "airgeddon", purpose: "Multi-attack wireless audit framework" },
      { name: "wirespy", purpose: "Automated evil twin with traffic sniffing" },
    ],
    commonMistakes: [
      "Not matching the enterprise SSID and EAP type exactly",
      "Forgetting that EAP-TLS uses certificates — harder to twin",
      "Not having a plan for captured credentials — test them!",
    ],
    proTips: [
      "PEAP/MSCHAPv2 is the most common and most vulnerable EAP type",
      "Captured NTLMv1 hashes from MSCHAPv2 can be cracked on crack.sh",
      "Test certificate validation — many clients skip it",
    ],
  },
  "advanced-cracking": {
    mindset: "Advanced cracking is about efficiency. Precomputing PMKs, leveraging GPU clusters, and using specialized tools can turn days of cracking into minutes. Know when to use each tool and how to chain them together.",
    thinkLike: [
      "Should I precompute PMKs for known target SSIDs?",
      "Is GPU cracking available, or am I stuck on CPU?",
      "Can PMKID attack bypass the need for a handshake?",
      "Have I tried rule-based attacks, not just dictionaries?",
    ],
    keyTools: [
      { name: "aircrack-ng", purpose: "CPU-based WPA cracking" },
      { name: "cowpatty", purpose: "Precomputed PMK table attacks" },
      { name: "pyrit", purpose: "GPU-accelerated PMK computation" },
      { name: "pmkidcracker", purpose: "PMKID-specific hash cracker" },
      { name: "airolib-ng", purpose: "PMK precomputation database" },
    ],
    commonMistakes: [
      "Not using precomputed tables when targeting known SSIDs",
      "Ignoring rule-based attacks — they find complex passwords dictionaries miss",
      "Running CPU cracking when GPU is available",
    ],
    proTips: [
      "Build SSID-specific PMK databases for common enterprise names",
      "hashcat rules like best64 and dive multiply your wordlist effectiveness",
      "PMKID works without clients — always try it first",
    ],
  },
  "mitm-attacks": {
    mindset: "You're inserting yourself between the victim and the network. Every packet flows through you. MITM is where WiFi pentesting meets network pentesting — you can sniff credentials, inject content, and redirect traffic. But you must be on the same network first.",
    thinkLike: [
      "Am I actually on the target network?",
      "ARP spoofing or DHCP starvation — which gets me position faster?",
      "What protocols can I intercept? (HTTP, DNS, FTP, SMTP)",
      "Is HSTS going to block my SSL strip attempts?",
    ],
    keyTools: [
      { name: "bettercap", purpose: "Modern MITM framework with scripting" },
      { name: "ettercap", purpose: "Classic ARP spoofing and sniffing" },
      { name: "yersinia", purpose: "Layer 2 attacks including DHCP starvation" },
      { name: "mitmproxy", purpose: "Interactive HTTPS proxy" },
    ],
    commonMistakes: [
      "Forgetting to enable IP forwarding — breaks victim's connectivity",
      "Not accounting for HSTS — modern browsers resist downgrade attacks",
      "ARP spoofing too aggressively — crashes the network",
    ],
    proTips: [
      "Bettercap caplets automate complex MITM chains",
      "DNS spoofing is often more reliable than ARP spoofing",
      "Capture pcaps during MITM for post-engagement analysis",
    ],
  },
  "post-exploitation": {
    mindset: "You're in the network — now what? Post-exploitation is about maximizing impact. Extract stored WiFi passwords, pivot to other systems, identify firmware vulnerabilities in routers. This is where you prove the business impact of the WiFi vulnerability.",
    thinkLike: [
      "What other networks can I reach from here?",
      "Are there stored WiFi profiles with passwords on this machine?",
      "Is the router firmware vulnerable to known CVEs?",
      "Can I pivot from WiFi access to internal network access?",
    ],
    keyTools: [
      { name: "routersploit", purpose: "Router exploitation framework" },
      { name: "binwalk", purpose: "Firmware extraction and analysis" },
      { name: "netsh wlan", purpose: "Extract WiFi profiles on Windows" },
      { name: "nmcli", purpose: "Extract saved credentials on Linux" },
      { name: "nmap", purpose: "Internal network scanning from WiFi foothold" },
    ],
    commonMistakes: [
      "Stopping at WiFi access — the real value is internal pivot",
      "Not checking router admin panels for default credentials",
      "Ignoring firmware — it often contains hardcoded keys",
    ],
    proTips: [
      "Windows stores WiFi passwords in plaintext: netsh wlan show profile key=clear",
      "Router firmware often has hardcoded SSH keys and backdoors",
      "Document your pivot path — it tells the story in your report",
    ],
  },
  "skills-assessment": {
    mindset: "This is your final exam — no hints, no hand-holding. You're simulating a real engagement from start to finish. Think like a consultant: systematic, thorough, and documenting everything. Your deliverable isn't just access — it's a professional report.",
    thinkLike: [
      "What's my methodology? (Recon → Attack → Post-Exploit → Report)",
      "Am I documenting every step with timestamps and screenshots?",
      "Have I considered ALL attack vectors, not just the obvious one?",
      "Is my report clear enough for a non-technical executive?",
    ],
    keyTools: [
      { name: "All previous tools", purpose: "Full toolkit application" },
      { name: "Report template", purpose: "Professional documentation" },
      { name: "Screenshot tool", purpose: "Evidence capture" },
    ],
    commonMistakes: [
      "Jumping into attacks without proper reconnaissance",
      "Not documenting findings as you go — reconstruction is painful",
      "Missing easy wins while chasing complex attacks",
      "Writing a report that only technical people can understand",
    ],
    proTips: [
      "Start with passive recon — it's silent and reveals a lot",
      "Try the easy attacks first: default creds, WPS, open networks",
      "Your report sells the next engagement — make it excellent",
    ],
  },
};