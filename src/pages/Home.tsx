import { Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { WiFiStory } from "@/components/WiFiStory";
import { stages } from "@/data/registry";
import { topics } from "@/data/curriculum";
import { ChevronRight } from "lucide-react";

const Home = () => (
  <div className="min-h-screen bg-background pt-16">
    <main>
      <Hero onGetStarted={() => {}} />
      <WiFiStory />

      {/* Guided journey */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Start Here — guided path</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">Follow these stages from foundations through authorized assessment, defense, modern wireless and building your own tools.</p>
          <ol className="space-y-3">
            {stages.map((stage, i) => {
              const matching = topics.filter(t => t.stage === stage);
              return (
                <li key={stage} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-primary/10 text-primary rounded px-2 py-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-medium text-foreground">{stage}</span>
                  </div>
                  {matching.length > 0 && (
                    <ul className="ml-9 mt-2 space-y-1">
                      {matching.map(t => (
                        <li key={t.id}>
                          <Link to={`/learn/${t.id}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            {t.title} <ChevronRight className="w-3 h-3" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {matching.length === 0 && (
                    <p className="ml-9 mt-1 text-xs text-muted-foreground">
                      {stage === 'Supervised AI' ? <Link to="/ai" className="text-primary hover:underline">AI-Assisted Testing section</Link> : <Link to="/playbook" className="text-primary hover:underline">See playbook modules</Link>}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>

    <footer className="py-8 border-t border-border bg-card">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          WiFi Penetration Testing Playbook — 2027 edition — For authorized security testing only.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Unauthorized access to computer systems is illegal. Always obtain proper authorization. Content reviewed {new Date().toISOString().slice(0, 10)}.
        </p>
      </div>
    </footer>
  </div>
);

export default Home;
