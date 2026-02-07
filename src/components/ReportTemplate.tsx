import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { Button } from "./ui/button";

interface ReportTemplateProps {
  title: string;
  template: string;
}

export const ReportTemplate = ({ title, template }: ReportTemplateProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <Button
          variant="terminal"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Template
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 font-mono text-sm text-muted-foreground whitespace-pre-wrap overflow-x-auto max-h-96 scrollbar-thin">
        {template}
      </pre>
    </div>
  );
};
