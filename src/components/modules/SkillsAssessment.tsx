import { Trophy, CheckCircle2, Target, Clock, AlertTriangle, FileText } from "lucide-react";

export const SkillsAssessment = () => {
  const scenarios = [
    {
      title: "Scenario 1: Corporate Office Assessment",
      difficulty: "Medium",
      duration: "4 hours",
      description: "You've been hired to assess a corporate office's WiFi security. The client has WPA2-Enterprise and a guest network (WPA2-PSK). Identify all networks, assess their security, and attempt to gain access.",
      objectives: [
        "Perform full reconnaissance with airodump-ng and Kismet",
        "Identify all SSIDs, BSSIDs, channels, encryption types, and clients",
        "Attempt PMKID capture on the PSK guest network",
        "Capture WPA2 handshake via targeted deauthentication",
        "Crack the PSK using hashcat with rockyou.txt",
        "Set up EAPHammer evil twin against the Enterprise network",
        "Capture MSCHAPv2 hashes and crack with hashcat",
        "Test the router admin panel for default credentials",
        "Generate a professional pentest report with all findings"
      ],
      tools: ["airodump-ng", "Kismet", "hcxdumptool", "aireplay-ng", "hashcat", "EAPHammer", "nmap"]
    },
    {
      title: "Scenario 2: Hotel/Public WiFi Assessment",
      difficulty: "Hard",
      description: "Assess a hotel's WiFi infrastructure including a captive portal guest network, staff WPA2 network, and IoT device network. Demonstrate the risks of public WiFi.",
      duration: "6 hours",
      objectives: [
        "Map all wireless networks using Sparrow-WiFi or Kismet",
        "Bypass the captive portal on the guest network",
        "Create an evil twin using Wifipumpkin3 with custom captive portal",
        "Perform MITM attacks with Bettercap on the guest network",
        "Attempt WPS attacks on the staff network",
        "Identify and fingerprint IoT devices on the network",
        "Perform DHCP starvation attack (controlled test)",
        "Extract WiFi credentials from a test laptop",
        "Scan router firmware for known CVEs",
        "Document all findings with risk ratings"
      ],
      tools: ["Sparrow-WiFi", "Wifipumpkin3", "Bettercap", "reaver", "yersinia", "nmap", "RouterSploit"]
    },
    {
      title: "Scenario 3: Red Team WiFi Engagement",
      difficulty: "Expert",
      description: "Full red team engagement targeting a company's wireless infrastructure. Combine WiFi attacks with OSINT, social engineering, and post-exploitation. No prior network knowledge given.",
      duration: "8 hours",
      objectives: [
        "OSINT: Use WiGLE to locate target's WiFi networks before arriving",
        "Wardrive the perimeter with GPS-tagged scanning",
        "Identify all networks and determine highest-value targets",
        "Deploy multiple attack vectors simultaneously",
        "Attempt WPA3-SAE brute force with Wacker",
        "Use automated frameworks (Wifite2) for rapid initial assessment",
        "Set up persistent evil twin with Airgeddon",
        "Perform enterprise credential capture with EAPHammer",
        "Use Bettercap for post-access MITM and credential harvesting",
        "Pivot from WiFi access to internal network exploitation",
        "Extract WiFi passwords from compromised workstations",
        "Create comprehensive red team report with attack chain"
      ],
      tools: ["WiGLE", "Kismet+GPS", "Wacker", "Wifite2", "Airgeddon", "EAPHammer", "Bettercap", "RouterSploit"]
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-xs font-mono text-accent">MODULE 16</span>
              <h2 className="text-2xl font-bold text-foreground">Skills Assessment</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            Put everything you've learned into practice. These assessment scenarios simulate real-world 
            WiFi penetration testing engagements. Complete each scenario using the tools and techniques 
            from all previous modules. Document your findings as a professional report.
          </p>

          {/* Prerequisites */}
          <div className="p-4 rounded-lg border border-warning/50 bg-warning/10 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Before Starting</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete ALL previous modules (01-15)</li>
                  <li>• Set up a lab environment (do NOT test on unauthorized networks)</li>
                  <li>• Have all tools installed and tested</li>
                  <li>• Prepare report template from Module 08</li>
                  <li>• Recommended: Two wireless adapters for simultaneous operations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Assessment Scenarios */}
          <div className="space-y-8">
            {scenarios.map((scenario, index) => (
              <div key={index} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-5 border-b border-border bg-secondary/30">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        scenario.difficulty === "Medium" ? "bg-warning/20 text-warning" :
                        scenario.difficulty === "Hard" ? "bg-accent/20 text-accent" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {scenario.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {scenario.duration}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Objectives
                  </h4>
                  <ul className="space-y-2 mb-4">
                    {scenario.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 rounded border border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Required Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scenario.tools.map((tool, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grading Criteria */}
          <div className="mt-8 p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Self-Assessment Grading Criteria
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-primary">Area</th>
                    <th className="text-left py-2 pr-4 text-foreground">Passing</th>
                    <th className="text-left py-2 text-foreground">Excellent</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium text-foreground">Recon</td>
                    <td className="py-2 pr-4">All networks identified</td>
                    <td className="py-2">Full client/vendor mapping + GPS</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium text-foreground">Exploitation</td>
                    <td className="py-2 pr-4">1+ network compromised</td>
                    <td className="py-2">Multiple vectors, all networks tested</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium text-foreground">Post-Exploitation</td>
                    <td className="py-2 pr-4">Access demonstrated</td>
                    <td className="py-2">Lateral movement + credential extraction</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium text-foreground">Reporting</td>
                    <td className="py-2 pr-4">Findings documented</td>
                    <td className="py-2">Executive summary + remediation + evidence</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-foreground">Tool Usage</td>
                    <td className="py-2 pr-4">3+ tools used correctly</td>
                    <td className="py-2">Appropriate tool for each task</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Note */}
          <div className="mt-8 p-5 rounded-xl border border-success/50 bg-success/10">
            <h4 className="font-semibold text-success mb-2">🎓 Congratulations!</h4>
            <p className="text-sm text-muted-foreground">
              If you've completed all 16 modules and the skills assessment scenarios, you now have 
              professional-level WiFi penetration testing skills. Continue practicing in lab environments, 
              stay updated on new tools and techniques, and always operate ethically and legally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
