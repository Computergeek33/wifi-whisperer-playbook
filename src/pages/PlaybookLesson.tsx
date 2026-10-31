import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Terminal } from "lucide-react";
import { useState } from "react";
import { lessons } from "@/data/registry";
import { CLISimulator } from "@/components/CLISimulator";
import { MindsetSidebar } from "@/components/MindsetSidebar";
import { moduleExercises } from "@/data/interactiveExercises";
import { cn } from "@/lib/utils";
import {
  MonitorMode, NetworkDiscovery, WPACracking, DeauthAttacks, EvilTwin, WPSAttacks,
  AdvancedRecon, OnlineBruteForce, AutomatedFrameworks, AdvancedEvilTwin,
  AdvancedCracking, MITMAttacks, PostExploitation, SkillsAssessment, FullEngagement
} from "@/components/modules";
import { HardwareSetup } from "@/components/HardwareSetup";
import { ReportingSection } from "@/components/ReportingSection";

const components: Record<string, React.ReactNode> = {
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

const PlaybookLesson = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const lesson = lessons.find(l => l.id === moduleId);
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const exercise = moduleId ? moduleExercises[moduleId] : undefined;

  if (!lesson || !moduleId) {
    return (
      <div className="min-h-screen bg-background pt-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Module not found</h1>
        <Link to="/playbook" className="text-primary hover:underline">Back to Playbook</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <Link to="/playbook" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">All Modules</span>
          </Link>

          {exercise && (
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setActiveTab("learn")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "learn" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="w-4 h-4" />
                Learn
              </button>
              <button
                onClick={() => setActiveTab("practice")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "practice" ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="w-4 h-4" />
                Simulated Lab
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "learn" ? (
        <div>{components[moduleId]}</div>
      ) : exercise ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">{exercise.title}</h2>
              <p className="text-sm text-muted-foreground">
                Simulated command exercises with predetermined feedback. This is not a real terminal — it matches typed text against stored answers and displays canned output. Use this to rehearse, not to prove hardware proficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              <aside>
                <MindsetSidebar moduleId={moduleId} />
              </aside>
              <div className="min-w-0">
                <CLISimulator
                  title={exercise.title}
                  scenarioDescription={exercise.scenarioDescription}
                  steps={exercise.steps}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default PlaybookLesson;
