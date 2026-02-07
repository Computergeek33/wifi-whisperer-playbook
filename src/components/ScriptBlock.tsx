import { useState } from "react";
import { Check, Copy, Code, Play } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ScriptBlockProps {
  title: string;
  filename: string;
  language: string;
  code: string;
  description?: string;
}

export const ScriptBlock = ({ title, filename, language, code, description }: ScriptBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden group hover:border-accent/50 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 bg-accent/10 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Code className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-foreground">{title}</h4>
            <span className="text-xs text-muted-foreground font-mono">{filename}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground font-mono">
            {language}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {description && (
        <div className="px-4 py-2 bg-secondary/20 border-b border-border">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      <div className="relative">
        <pre className="p-4 font-mono text-sm overflow-x-auto max-h-96 scrollbar-thin">
          <code className="text-foreground/90">{code}</code>
        </pre>
        <div className="absolute top-2 left-2 flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
      </div>
    </div>
  );
};
