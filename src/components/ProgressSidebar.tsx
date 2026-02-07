import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressSidebarProps {
  steps: Step[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
}

export const ProgressSidebar = ({ steps, currentStep, onStepClick }: ProgressSidebarProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
        Progress
      </h3>
      <div className="space-y-1">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left",
              step.status === "current" && "bg-primary/10",
              step.status !== "current" && "hover:bg-secondary/50"
            )}
          >
            <div className="flex-shrink-0">
              {step.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : step.status === "current" ? (
                <PlayCircle className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "text-sm font-medium truncate block",
                  step.status === "completed" && "text-muted-foreground",
                  step.status === "current" && "text-primary",
                  step.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
