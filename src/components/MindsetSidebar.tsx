import { Brain, Wrench, AlertTriangle, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { moduleMindsets, type ModuleMindset } from "@/data/moduleMindsets";
import { cn } from "@/lib/utils";

interface MindsetSidebarProps {
  moduleId: string;
}

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  accentColor = "text-primary",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-secondary/50 hover:bg-secondary transition-colors text-left"
      >
        <Icon className={cn("w-4 h-4 flex-shrink-0", accentColor)} />
        <span className="text-xs font-semibold text-foreground flex-1">{title}</span>
        {open ? (
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-3 py-2.5 bg-card/50">{children}</div>}
    </div>
  );
};

export const MindsetSidebar = ({ moduleId }: MindsetSidebarProps) => {
  const data = moduleMindsets[moduleId];
  if (!data) return null;

  return (
    <div className="space-y-3 sticky top-32">
      {/* Mindset */}
      <CollapsibleSection title="ATTACKER MINDSET" icon={Brain} defaultOpen={true} accentColor="text-accent">
        <p className="text-xs text-muted-foreground leading-relaxed">{data.mindset}</p>
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Think like this:</p>
          {data.thinkLike.map((q, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-accent text-[10px] mt-0.5">▸</span>
              <p className="text-[11px] text-foreground/80 leading-snug">{q}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Tools */}
      <CollapsibleSection title="KEY TOOLS" icon={Wrench} defaultOpen={true} accentColor="text-primary">
        <div className="space-y-2">
          {data.keyTools.map((tool, i) => (
            <div key={i} className="flex items-start gap-2">
              <code className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono flex-shrink-0 mt-0.5">
                {tool.name}
              </code>
              <span className="text-[11px] text-muted-foreground leading-snug">{tool.purpose}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Common Mistakes */}
      <CollapsibleSection title="COMMON MISTAKES" icon={AlertTriangle} accentColor="text-warning">
        <ul className="space-y-1.5">
          {data.commonMistakes.map((m, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-warning text-[10px] mt-0.5">✗</span>
              <span className="text-[11px] text-muted-foreground leading-snug">{m}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Pro Tips */}
      <CollapsibleSection title="PRO TIPS" icon={Sparkles} accentColor="text-success">
        <ul className="space-y-1.5">
          {data.proTips.map((t, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-success text-[10px] mt-0.5">★</span>
              <span className="text-[11px] text-muted-foreground leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  );
};
