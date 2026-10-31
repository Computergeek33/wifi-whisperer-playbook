import {
  Cpu, Radio, Search, Key, Zap, Shield, FileText, Network,
  Radar, Hammer, Bot, Skull, Lock, ArrowLeftRight, Server, Trophy, Map
} from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import { lessons } from "@/data/registry";

const icons: Record<string, React.ReactNode> = {
  "hardware-setup": <Cpu className="w-6 h-6" />,
  "monitor-mode": <Radio className="w-6 h-6" />,
  "network-discovery": <Search className="w-6 h-6" />,
  "wpa-cracking": <Key className="w-6 h-6" />,
  "deauth-attacks": <Zap className="w-6 h-6" />,
  "evil-twin": <Network className="w-6 h-6" />,
  "wps-attacks": <Shield className="w-6 h-6" />,
  "reporting": <FileText className="w-6 h-6" />,
  "advanced-recon": <Radar className="w-6 h-6" />,
  "online-bruteforce": <Hammer className="w-6 h-6" />,
  "automated-frameworks": <Bot className="w-6 h-6" />,
  "advanced-evil-twin": <Skull className="w-6 h-6" />,
  "advanced-cracking": <Lock className="w-6 h-6" />,
  "mitm-attacks": <ArrowLeftRight className="w-6 h-6" />,
  "post-exploitation": <Server className="w-6 h-6" />,
  "skills-assessment": <Trophy className="w-6 h-6" />,
  "full-engagement": <Map className="w-6 h-6" />,
};

interface ModulesOverviewProps {
  onModuleClick: (moduleId: string) => void;
  currentModule: string;
}

export const ModulesOverview = ({ onModuleClick, currentModule }: ModulesOverviewProps) => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Learning Modules</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {lessons.length} modules covering tools and techniques for professional WiFi penetration testing.
            Each module includes step-by-step commands with explanations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {lessons.map((lesson) => (
            <ModuleCard
              key={lesson.id}
              id={lesson.id}
              number={lesson.number}
              title={lesson.title}
              description={lesson.description}
              duration=""
              status={"available" as const}
              icon={icons[lesson.id] || <Shield className="w-6 h-6" />}
              onClick={() => onModuleClick(lesson.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
