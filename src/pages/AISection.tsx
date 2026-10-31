import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, AlertTriangle, Shield } from "lucide-react";
import { AISandbox } from "@/components/AISandbox";
import { sources, reviewed } from "@/data/registry";

const paths = [
  {
    title: "Path 1 — Local model (offline-capable)",
    summary: "Run a small language model on your own machine for evidence summarization and report drafting. Offline operation depends on local weights and configuration.",
    detail: [
      "Install Ollama or a comparable local-inference server. Check OS support, disk space, RAM and the model license first. Models run on your CPU/GPU; larger models need more memory. A Pi 4 is resource-constrained and is not a guarantee of acceptable performance.",
      "Start with an instruction-following model under 8B parameters. Feed synthetic evidence and ask for structured summaries.",
      "The local model does not run WiFi tools, access your adapter, or execute commands. It generates text from a prompt. All output requires human review.",
      "Privacy depends on the model, its configuration and any telemetry. Local does not automatically mean private; inspect the software's own network behavior.",
      "Exercise: feed the certificate-rejection log from the workshop and ask for a structured finding. Compare the model's output with your manual report. Identify any invented evidence, missing caveats, or incorrect severity.",
    ],
    sources: [sources.local],
  },
  {
    title: "Path 2 — Hosted API (cloud, metered)",
    summary: "Use a commercial API for evidence analysis. Requires provider access, any applicable billing arrangement and careful data handling.",
    detail: [
      "Create an API key through the provider's platform. Never embed the key in browser-facing code, a public repository, or a chat message. Store it in a server-side environment variable or a secrets manager.",
      "API calls transmit your prompt to the provider. Review the provider's data-use and retention policy before sending engagement evidence. Redact credentials, personal data and client-identifying detail.",
      "Costs depend on token volume. Set spending limits before experimenting. No price is assumed here: check current provider pricing, budget caps and usage before calling. This site makes no API calls.",
      "The API returns text predictions, not verified security findings. Cross-check every claim against your evidence and tool output.",
      "Exercise: send the synthetic WPS lock-state evidence to an API endpoint and ask whether the network is exploitable. Evaluate whether the response distinguishes observation from inference and names its uncertainty.",
    ],
    sources: [sources.openai, sources.keys, sources.privacy],
  },
  {
    title: "Path 3 — ChatGPT-assisted evidence interpretation",
    summary: "Use a conversational model to discuss synthetic evidence. Understand the boundaries of trust, hallucination and scope.",
    detail: [
      "ChatGPT and similar assistants are separate products from the API. Consumer-tier conversations may be used for training unless you opt out; check the provider's current data-controls page.",
      "Do not paste real engagement credentials, client names or captured traffic into a consumer chat. Use synthetic or redacted evidence only.",
      "The model can help structure a report, suggest remediation language or explain a protocol. A model alone does not run tools; some assistant products expose optional tools. No hardware or network access is granted by this site.",
      "Hallucination challenge: ask the model to interpret a deliberately incomplete evidence set. Does it invent missing observations, cite nonexistent advisories or claim certainty it cannot have? Record each invented claim.",
      "A model output is not an independent verification. If you use it in a report, attribute it as model-assisted and retain human accountability for every factual claim.",
    ],
    sources: [sources.privacy, sources.openai],
  },
];

const AISection = () => (
  <div className="min-h-screen bg-background pt-16">
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Home</span>
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">AI-Assisted Testing</h1>
      <p className="text-muted-foreground text-sm mb-4">
        Three educational paths for using language models with wireless security evidence. No live model integration runs on this site.
        <span className="block text-xs mt-1">Reviewed {reviewed}. No subscription or API purchase is required to read these paths.</span>
      </p>

      <div className="p-4 rounded-lg border border-warning/50 bg-warning/10 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Safety boundaries</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>A language model is not a tool runner. It does not access your adapter, network or files unless you build an explicit integration.</li>
              <li>Never embed API keys in browser code or public repositories.</li>
              <li>If you teach an execution architecture, isolate it: allowlisted actions only, explicit human approval for anything disruptive, bounded duration, full logging, stop button and reliable cleanup.</li>
              <li>No autonomous scanning, credential harvesting or exploitation of external networks.</li>
              <li>Model output is not evidence. Verify every factual claim independently.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {paths.map((path, i) => (
          <section key={i} className="border-t border-border pt-6">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h2 className="text-lg font-bold text-foreground">{path.title}</h2>
              <p className="text-sm text-muted-foreground">{path.summary}</p>
            </div>
            <div className="p-5 space-y-3">
              {path.detail.map((p, j) => (
                <p key={j} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
              ))}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Sources checked</p>
                <div className="flex flex-wrap gap-3">
                  {path.sources.map((url, j) => (
                    <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      {new URL(url).hostname} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <AISandbox />

      {/* Execution architecture teaching */}
      <section className="mt-12 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">If you build an execution layer</h2>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>An isolated lab runner that connects a model to authorized tools must enforce:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>An explicit allowlist of permitted tool names and scoped arguments — no arbitrary shell.</li>
            <li>Human approval before any disruptive action (deauth, brute force, firmware probe).</li>
            <li>A maximum duration and automatic stop after the window closes.</li>
            <li>Full structured logging of every tool invocation and result.</li>
            <li>A stop button that halts all running actions and triggers cleanup.</li>
            <li>Reliable state restoration: saved interface/service/firewall state before the run, restored after.</li>
          </ol>
          <p>A local runner must also validate the target allowlist, reject stale approvals, log input/output hashes and retain a saved baseline. On stop or timeout it must terminate child processes, restore saved values rather than arbitrary defaults, and independently compare the resulting state. If restoration fails, block further actions and escalate to the lab owner. This site does not provide or host such an execution layer. The description above is a teaching reference for teams who build their own under appropriate authorization and oversight.</p>
        </div>
      </section>
    </main>
  </div>
);
export default AISection;
