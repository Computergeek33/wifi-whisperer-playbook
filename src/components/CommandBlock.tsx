import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBlockProps {
  command: string;
  description?: string;
  explanation?: string;
  output?: string;
}

export const CommandBlock = ({ command, description, explanation, output }: CommandBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:box-glow">
      {description && (
        <div className="px-4 py-3 border-b border-border bg-secondary/30">
          <p className="text-sm text-foreground font-medium">{description}</p>
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border">
          <Terminal className="w-4 h-4 text-terminal" />
          <span className="text-xs font-mono text-muted-foreground">Terminal</span>
        </div>
        
        <div className="p-4 bg-background/50">
          <div className="flex items-start justify-between gap-4">
            <code className="font-mono text-sm text-terminal break-all flex-1">
              <span className="text-muted-foreground select-none">$ </span>
              {command}
            </code>
            <button
              onClick={copyToClipboard}
              className={cn(
                "flex-shrink-0 p-2 rounded-md transition-all duration-200",
                "hover:bg-primary/20 text-muted-foreground hover:text-primary",
                copied && "bg-success/20 text-success"
              )}
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {output && (
          <div className="px-4 py-3 bg-muted/20 border-t border-border">
            <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>

      {explanation && (
        <div className="px-4 py-3 border-t border-border bg-secondary/20">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Why: </span>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
