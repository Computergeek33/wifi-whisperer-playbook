import { ChevronRight, Clock, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  number: string;
  title: string;
  description: string;
  duration: string;
  status: "locked" | "available" | "in-progress" | "completed";
  icon: React.ReactNode;
  onClick?: () => void;
}

export const ModuleCard = ({
  number,
  title,
  description,
  duration,
  status,
  icon,
  onClick,
}: ModuleCardProps) => {
  const isAccessible = status !== "locked";

  return (
    <button
      onClick={isAccessible ? onClick : undefined}
      disabled={!isAccessible}
      className={cn(
        "w-full text-left p-5 rounded-xl border transition-all duration-300 group",
        "bg-card hover:bg-secondary/50",
        status === "locked" && "opacity-60 cursor-not-allowed",
        status === "available" && "border-border hover:border-primary/50 hover:box-glow",
        status === "in-progress" && "border-primary/50 box-glow",
        status === "completed" && "border-success/50 box-glow-success"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
            status === "completed" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
          )}
        >
          {status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-primary">{number}</span>
            {status === "locked" && <Lock className="w-3 h-3 text-muted-foreground" />}
          </div>
          <h3 className="font-semibold text-foreground mb-1 truncate">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </div>
        </div>

        {isAccessible && (
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>
    </button>
  );
};
