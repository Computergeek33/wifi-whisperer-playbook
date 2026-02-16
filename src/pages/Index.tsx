import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { WiFiStory } from "@/components/WiFiStory";
import { ModulesOverview } from "@/components/ModulesOverview";
import { ModuleView } from "@/components/ModuleView";
import { HardwareSetup } from "@/components/HardwareSetup";
import { 
  MonitorMode, NetworkDiscovery, WPACracking, DeauthAttacks, EvilTwin, WPSAttacks,
  AdvancedRecon, OnlineBruteForce, AutomatedFrameworks, AdvancedEvilTwin,
  AdvancedCracking, MITMAttacks, PostExploitation, SkillsAssessment, FullEngagement
} from "@/components/modules";
import { ReportingSection } from "@/components/ReportingSection";

const moduleComponents: Record<string, React.ReactNode> = {
  "hardware-setup": <HardwareSetup />,
  "monitor-mode": <MonitorMode />,
  "network-discovery": <NetworkDiscovery />,
  "wpa-cracking": <WPACracking />,
  "deauth-attacks": <DeauthAttacks />,
  "evil-twin": <EvilTwin />,
  "wps-attacks": <WPSAttacks />,
  "reporting": <ReportingSection />,
  "advanced-recon": <AdvancedRecon />,
  "online-bruteforce": <OnlineBruteForce />,
  "automated-frameworks": <AutomatedFrameworks />,
  "advanced-evil-twin": <AdvancedEvilTwin />,
  "advanced-cracking": <AdvancedCracking />,
  "mitm-attacks": <MITMAttacks />,
  "post-exploitation": <PostExploitation />,
  "skills-assessment": <SkillsAssessment />,
  "full-engagement": <FullEngagement />,
};

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleNavigate = (section: string) => {
    if (section === "home") {
      setActiveModule(null);
      setCurrentSection("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "modules") {
      setActiveModule(null);
      setCurrentSection("modules");
    }
  };

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    window.scrollTo({ top: 0 });
  };

  const handleGetStarted = () => {
    setCurrentSection("modules");
    setActiveModule(null);
  };

  // Module is open — show ModuleView
  if (activeModule) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentSection="modules" onNavigate={handleNavigate} />
        <ModuleView
          moduleId={activeModule}
          moduleContent={moduleComponents[activeModule]}
          onBack={() => {
            setActiveModule(null);
            setCurrentSection("modules");
          }}
        />
      </div>
    );
  }

  // Home / Modules overview
  return (
    <div className="min-h-screen bg-background">
      <Navigation currentSection={currentSection} onNavigate={handleNavigate} />
      
      <main>
        {currentSection === "home" && (
          <>
            <Hero onGetStarted={handleGetStarted} />
            <WiFiStory />
          </>
        )}
        
        <ModulesOverview onModuleClick={handleModuleClick} currentModule="" />
      </main>

      <footer className="py-8 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            WiFi Penetration Testing Playbook — For authorized security testing only.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Unauthorized access to computer systems is illegal. Always obtain proper authorization.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
