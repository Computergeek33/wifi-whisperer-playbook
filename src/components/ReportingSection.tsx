import { FileText, Copy, Download } from "lucide-react";
import { ReportTemplate } from "./ReportTemplate";
import { Button } from "./ui/button";

export const ReportingSection = () => {
  const executiveSummary = `# WiFi Penetration Test Report
## Executive Summary

**Client:** [Client Name]
**Assessment Date:** [Date Range]
**Assessor:** [Your Name/Team]
**Classification:** Confidential

### Scope
This assessment covered wireless network security testing of the following:
- SSID(s): [List SSIDs]
- Location(s): [Physical locations tested]
- Test Type: [Internal/External/Both]

### Key Findings Summary
| Risk Level | Count | Remediation Priority |
|------------|-------|---------------------|
| Critical   |   0   | Immediate           |
| High       |   0   | Within 7 days       |
| Medium     |   0   | Within 30 days      |
| Low        |   0   | Within 90 days      |

### Overall Risk Rating: [CRITICAL/HIGH/MEDIUM/LOW]

---`;

  const findingTemplate = `## Finding: [FINDING TITLE]

**Risk Rating:** [Critical/High/Medium/Low]
**CVSS Score:** [0.0 - 10.0]
**Affected Asset:** [SSID/Network Name]

### Description
[Detailed description of the vulnerability discovered]

### Evidence
\`\`\`
[Include command output, screenshots reference, or captured data]
\`\`\`

### Impact
[Explain the potential business impact if exploited]

### Recommendation
1. [Primary remediation step]
2. [Secondary remediation step]
3. [Verification step]

### References
- [CVE/CWE reference if applicable]
- [Vendor documentation]
- [Industry standard reference]

---`;

  const technicalDetails = `## Technical Testing Methodology

### 1. Reconnaissance Phase
**Objective:** Identify all wireless networks in scope

**Tools Used:**
- airodump-ng
- Kismet
- Wireshark

**Commands Executed:**
\`\`\`bash
# Enable monitor mode
sudo airmon-ng start wlan1

# Scan for networks
sudo airodump-ng wlan1mon

# Target specific network
sudo airodump-ng -c [CHANNEL] --bssid [BSSID] -w capture wlan1mon
\`\`\`

**Networks Identified:**
| BSSID | SSID | Channel | Encryption | Clients |
|-------|------|---------|------------|---------|
| [MAC] | [Name] | [CH] | [WPA2/WPA3] | [Count] |

### 2. Vulnerability Assessment Phase
[Continue with detailed methodology...]

### 3. Exploitation Phase
[Document successful exploitation attempts...]

### 4. Post-Exploitation
[Document any lateral movement or privilege escalation...]

---`;

  const recommendations = `## Recommendations & Remediation

### Immediate Actions (Critical/High Findings)
1. [ ] [Specific action item]
2. [ ] [Specific action item]

### Short-Term Actions (Within 30 days)
1. [ ] Implement WPA3 where supported
2. [ ] Review and rotate pre-shared keys
3. [ ] Enable 802.1X authentication for enterprise networks
4. [ ] Disable WPS on all access points

### Long-Term Security Improvements
1. [ ] Implement wireless intrusion detection/prevention system (WIDS/WIPS)
2. [ ] Establish regular wireless security assessments (quarterly)
3. [ ] Create guest network segregation
4. [ ] Implement certificate-based authentication

### Security Best Practices
- Use unique, complex passwords (minimum 20 characters)
- Implement network segmentation
- Enable MAC filtering as defense-in-depth (not primary control)
- Regular firmware updates for all access points
- Monitor for rogue access points

---

## Appendix A: Tool Versions
| Tool | Version | Purpose |
|------|---------|---------|
| aircrack-ng | [version] | Packet capture & cracking |
| Wireshark | [version] | Protocol analysis |
| hashcat | [version] | Password cracking |

## Appendix B: Raw Scan Output
[Attach or reference supporting documentation]`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-xs font-mono text-accent">MODULE 08</span>
              <h2 className="text-2xl font-bold text-foreground">Professional Reporting</h2>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            A professional penetration test report is as important as the testing itself. 
            Use these templates to create comprehensive, client-ready documentation.
          </p>

          <div className="space-y-6">
            <ReportTemplate
              title="Executive Summary Template"
              template={executiveSummary}
            />

            <ReportTemplate
              title="Finding Template"
              template={findingTemplate}
            />

            <ReportTemplate
              title="Technical Methodology"
              template={technicalDetails}
            />

            <ReportTemplate
              title="Recommendations Section"
              template={recommendations}
            />
          </div>

          <div className="mt-8 p-5 rounded-xl border border-primary/50 bg-primary/10">
            <h4 className="font-semibold text-primary mb-2">Pro Tip: Report Automation</h4>
            <p className="text-sm text-muted-foreground">
              Copy these templates into your workflow. As you complete each module, 
              fill in the relevant sections with your actual findings. The structured 
              format ensures you don't miss critical details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
