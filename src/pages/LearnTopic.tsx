import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { topicById, reviewed } from "@/data/curriculum";
import { Button } from "@/components/ui/button";
import { Workshop } from "@/components/Workshop";

const LearnTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? topicById(topicId) : undefined;
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background pt-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Topic not found</h1>
        <Link to="/learn" className="text-primary hover:underline">Back to Learn</Link>
      </div>
    );
  }

  const correct = submitted && selected === topic.check.answer;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Link to="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">All Topics</span>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl reading">
        <p className="text-xs text-muted-foreground not-prose">Stage: {topic.stage} · Reviewed {reviewed}</p>
        <h1>{topic.title}</h1>
        <p className="lead">{topic.summary}</p>

        {topic.chapters.map((ch, i) => (
          <section key={i}>
            <h2>{ch.title}</h2>
            {ch.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
            {ch.checklist && (
              <ul>
                {ch.checklist.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}

        {/* Sources */}
        <section className="not-prose mt-8 p-4 rounded-lg border border-border bg-card">
          <h3 className="font-medium text-foreground text-sm mb-2">Sources checked</h3>
          <ul className="space-y-1">
            {topic.sources.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  {new URL(url).hostname} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-2">These links were checked for relevance; they may update independently.</p>
        </section>

        {/* Check */}
        <section className="not-prose mt-8 space-y-3">
          <h3 className="font-medium text-foreground">{topic.check.question}</h3>
          <div className="space-y-2" role="radiogroup" aria-label="Knowledge check">
            {topic.check.options.map((opt, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={selected === i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                  submitted && i === topic.check.answer ? 'border-success bg-success/10' :
                  submitted && i === selected ? 'border-destructive bg-destructive/10' :
                  !submitted && i === selected ? 'border-primary bg-primary/10' :
                  'border-border bg-card hover:border-primary/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold">{String.fromCharCode(65 + i)})</span>
                  {opt}
                  {submitted && i === topic.check.answer && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
                  {submitted && i === selected && i !== topic.check.answer && <XCircle className="w-4 h-4 ml-auto text-destructive" />}
                </span>
              </button>
            ))}
          </div>
          {!submitted && selected !== null && <Button onClick={() => setSubmitted(true)}>Submit</Button>}
          {submitted && (
            <p className={`p-3 rounded-lg text-sm ${correct ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`} role="status">
              {correct ? '✓ Correct. ' : `✗ Answer is ${String.fromCharCode(65 + topic.check.answer)}. `}{topic.check.explanation}
            </p>
          )}
        </section>

        {/* Workshop for build-tools topic */}
        {topic.id === 'build-tools' && <Workshop />}
      </main>
    </div>
  );
};
export default LearnTopic;
