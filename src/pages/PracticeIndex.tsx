import { Link } from "react-router-dom";
import { lessons, reviewed } from "@/data/registry";
import { readProgress, type Progress } from "@/lib/learning";
import { useEffect, useState } from "react";

const PracticeIndex = () => {
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  useEffect(() => {
    const load = () => setProgress(readProgress());
    load();
    window.addEventListener('learning-progress', load);
    return () => window.removeEventListener('learning-progress', load);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Practice Labs</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Synthetic evidence interpretation and report-writing exercises for every module. No real commands execute. Progress is stored in this browser only.
          <span className="block text-xs mt-1">Content reviewed {reviewed}.</span>
        </p>

        <div className="space-y-3">
          {lessons.map((lesson) => {
            const p = progress[lesson.id];
            return (
              <Link
                key={lesson.id}
                to={`/practice/${lesson.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div>
                  <span className="text-xs font-mono text-primary mr-2">{lesson.number}</span>
                  <span className="font-medium text-foreground">{lesson.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {p?.mastered ? '✓ Complete · 3/3 checks' : p?.complete ? '✓ Complete · review checks' : p?.step ? `Step ${p.step}` : 'Start'}
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};
export default PracticeIndex;
