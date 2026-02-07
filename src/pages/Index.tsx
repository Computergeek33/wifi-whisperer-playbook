import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ModulesOverview } from "@/components/ModulesOverview";
import { HardwareSetup } from "@/components/HardwareSetup";
import { MonitorMode, NetworkDiscovery, WPACracking, DeauthAttacks, EvilTwin, WPSAttacks } from "@/components/modules";
import { ReportingSection } from "@/components/ReportingSection";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [currentModule, setCurrentModule] = useState("hardware-setup");

  const modulesRef = useRef<HTMLDivElement>(null);
  const hardwareRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const discoveryRef = useRef<HTMLDivElement>(null);
  const wpaRef = useRef<HTMLDivElement>(null);
  const deauthRef = useRef<HTMLDivElement>(null);
  const evilTwinRef = useRef<HTMLDivElement>(null);
  const wpsRef = useRef<HTMLDivElement>(null);
  const reportingRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    
    const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    switch (section) {
      case "home":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "modules":
        scrollToRef(modulesRef);
        break;
      case "hardware":
        scrollToRef(hardwareRef);
        break;
      case "reporting":
        scrollToRef(reportingRef);
        break;
    }
  };

  const handleModuleClick = (moduleId: string) => {
    setCurrentModule(moduleId);
    
    const moduleRefs: Record<string, React.RefObject<HTMLDivElement>> = {
      "hardware-setup": hardwareRef,
      "monitor-mode": monitorRef,
      "network-discovery": discoveryRef,
      "wpa-cracking": wpaRef,
      "deauth-attacks": deauthRef,
      "evil-twin": evilTwinRef,
      "wps-attacks": wpsRef,
      "reporting": reportingRef,
    };

    moduleRefs[moduleId]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    hardwareRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentSection={currentSection} onNavigate={handleNavigate} />
      
      <main>
        <Hero onGetStarted={handleGetStarted} />
        
        <div ref={modulesRef}>
          <ModulesOverview 
            onModuleClick={handleModuleClick} 
            currentModule={currentModule}
          />
        </div>
        
        <div ref={hardwareRef}>
          <HardwareSetup />
        </div>

        <div ref={monitorRef}>
          <MonitorMode />
        </div>

        <div ref={discoveryRef}>
          <NetworkDiscovery />
        </div>

        <div ref={wpaRef}>
          <WPACracking />
        </div>

        <div ref={deauthRef}>
          <DeauthAttacks />
        </div>

        <div ref={evilTwinRef}>
          <EvilTwin />
        </div>

        <div ref={wpsRef}>
          <WPSAttacks />
        </div>
        
        <div ref={reportingRef}>
          <ReportingSection />
        </div>
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
