import { Link } from "react-router-dom";
import { topics, reviewed } from "@/data/curriculum";
import { stages } from "@/data/registry";

const LearnIndex = () => (
  <div className="min-h-screen bg-background pt-16">
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-2">Learn</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Beginner foundations, modern wireless and tool-building — verified from official sources.
        <span className="block text-xs mt-1">Content reviewed {reviewed}. This site has not hardware-tested every combination described.</span>
      </p>

      {stages.filter(stage => topics.some(t => t.stage === stage)).map(stage => (
        <div key={stage} className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">{stage}</h2>
          <div className="space-y-2">
            {topics.filter(t => t.stage === stage).map(t => (
              <Link
                key={t.id}
                to={`/learn/${t.id}`}
                className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <span className="font-medium text-foreground">{t.title}</span>
                <span className="block text-sm text-muted-foreground mt-1">{t.summary}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  </div>
);
export default LearnIndex;
