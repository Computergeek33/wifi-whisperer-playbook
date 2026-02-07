import { 
  Cpu, 
  Radio, 
  Search, 
  Key, 
  Zap, 
  Shield, 
  FileText,
  Network 
} from "lucide-react";
import { ModuleCard } from "./ModuleCard";

interface ModulesOverviewProps {
  onModuleClick: (moduleId: string) => void;
  currentModule: string;
}

export const ModulesOverview = ({ onModuleClick, currentModule }: ModulesOverviewProps) => {
  const modules = [
    {
      id: "hardware-setup",
      number: "01",
      title: "Hardware Setup",
      description: "Install and configure Raspberry Pi 4 with Alfa AWUS036ACH adapter",
      duration: "30 min",
      status: "in-progress" as const,
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      id: "monitor-mode",
      number: "02",
      title: "Monitor Mode & Packet Capture",
      description: "Enable monitor mode and capture wireless traffic with aircrack-ng",
      duration: "45 min",
      status: "available" as const,
      icon: <Radio className="w-6 h-6" />,
    },
    {
      id: "network-discovery",
      number: "03",
      title: "Network Discovery & Reconnaissance",
      description: "Scan for access points, identify clients, and map network topology",
      duration: "1 hr",
      status: "available" as const,
      icon: <Search className="w-6 h-6" />,
    },
    {
      id: "wpa-cracking",
      number: "04",
      title: "WPA/WPA2 Handshake Capture",
      description: "Capture 4-way handshakes and perform dictionary attacks",
      duration: "1.5 hr",
      status: "available" as const,
      icon: <Key className="w-6 h-6" />,
    },
    {
      id: "deauth-attacks",
      number: "05",
      title: "Deauthentication Attacks",
      description: "Force client disconnection to capture handshakes",
      duration: "45 min",
      status: "available" as const,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: "evil-twin",
      number: "06",
      title: "Evil Twin & Rogue AP",
      description: "Create fake access points for MITM attacks",
      duration: "2 hr",
      status: "locked" as const,
      icon: <Network className="w-6 h-6" />,
    },
    {
      id: "wps-attacks",
      number: "07",
      title: "WPS Vulnerabilities",
      description: "Exploit WPS PIN vulnerabilities with Reaver and Bully",
      duration: "1 hr",
      status: "locked" as const,
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: "reporting",
      number: "08",
      title: "Professional Reporting",
      description: "Generate comprehensive penetration test reports",
      duration: "1 hr",
      status: "available" as const,
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Learning Modules</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Progress through each module to master WiFi penetration testing. 
            Each module includes commands, explanations, and automated scripts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              {...module}
              onClick={() => onModuleClick(module.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
