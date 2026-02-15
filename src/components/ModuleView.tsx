import { ArrowLeft, BookOpen, Terminal, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { CLISimulator } from "./CLISimulator";
import { moduleExercises } from "@/data/interactiveExercises";
import { cn } from "@/lib/utils";

interface ModuleViewProps {
  moduleId: string;
  moduleContent: React.ReactNode;
  onBack: () => void;
}

export const ModuleView = ({ moduleId, moduleContent, onBack }: ModuleViewProps) => {
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const exercise = moduleExercises[moduleId];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Top bar */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">All Modules</span>
          </button>

          {exercise && (
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setActiveTab("learn")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "learn"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="w-4 h-4" />
                Learn
              </button>
              <button
                onClick={() => setActiveTab("practice")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "practice"
                    ? "bg-accent/20 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="w-4 h-4" />
                Interactive Lab
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === "learn" ? (
        <div>{moduleContent}</div>
      ) : exercise ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">{exercise.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete the exercises below. Type real commands as you would in a live engagement. 
                Get it wrong? You'll learn why. Get it right? Prove you understand with a knowledge check.
              </p>
            </div>
            <CLISimulator
              title={exercise.title}
              scenarioDescription={exercise.scenarioDescription}
              steps={exercise.steps}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
