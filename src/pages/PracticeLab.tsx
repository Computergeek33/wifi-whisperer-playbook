import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { lessons } from "@/data/registry";
import { evidenceLabs } from "@/data/practice";
import { readProgress, saveProgress, type Progress } from "@/lib/learning";
import { ReportEditor } from "@/components/Workshop";
import { Button } from "@/components/ui/button";

const PracticeLab = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const lesson = lessons.find(l => l.id === moduleId);
  const lab = evidenceLabs.find(l => l.id === moduleId);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reportFields, setReportFields] = useState<Record<string, string>>({});
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // load saved progress
  useEffect(() => {
    if (!moduleId) return;
    const p = readProgress()[moduleId];
    if (p?.answers) {
      const qi = Number(Object.keys(p.answers).find(k => k === 'quiz'));
      if (!isNaN(qi)) { setSelected(qi); setSubmitted(true); }
    }
    if (p?.draft) {
      try { setReportFields(JSON.parse(p.draft)); setReportSubmitted(!!p.complete); } catch {}
    }
  }, [moduleId]);

  const handleQuizSubmit = useCallback(() => {
    if (selected === null || !lab || !moduleId) return;
    setSubmitted(true);
    const correct = selected === lab.answer;
    const prev = readProgress()[moduleId] || { complete: false, mastered: false, score: 0, total: 2, step: 0 };
    saveProgress(moduleId, { ...prev, step: 1, score: correct ? 1 : 0, answers: { quiz: String(selected) } });
  }, [selected, lab, moduleId]);

  const handleReportSubmit = useCallback(() => {
    if (!moduleId) return;
    setReportSubmitted(true);
    const prev = readProgress()[moduleId] || { complete: false, mastered: false, score: 0, total: 2, step: 1 };
    const quizCorrect = prev.score >= 1;
    const allFields = ['evidence', 'impact', 'remediation', 'retest'].every(k => (reportFields[k] || '').trim().length >= 30);
    saveProgress(moduleId, {
      ...prev,
      step: 2,
      complete: true,
      mastered: quizCorrect && allFields,
      total: 2,
      score: (quizCorrect ? 1 : 0) + (allFields ? 1 : 0),
      draft: JSON.stringify(reportFields),
    });
  }, [moduleId, reportFields]);

  const handleReset = useCallback(() => {
    if (!moduleId) return;
    setSelected(null); setSubmitted(false); setReportFields({}); setReportSubmitted(false);
    saveProgress(moduleId, { complete: false, mastered: false, score: 0, total: 2, step: 0 });
  }, [moduleId]);

  if (!lesson || !lab) {
    return (
      <div className="min-h-screen bg-background pt-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Lab not found</h1>
        <Link to="/practice" className="text-primary hover:underline">Back to Practice Labs</Link>
      </div>
    );
  }

  const correct = submitted && selected === lab.answer;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/practice" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">All Labs</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleReset} aria-label="Reset this lab">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <div>
          <span className="text-xs font-mono text-primary">{lesson.number}</span>
          <h1 className="text-2xl font-bold text-foreground">{lesson.title} — Practice Lab</h1>
          <p className="text-sm text-muted-foreground mt-1">Synthetic evidence interpretation. No real commands execute.</p>
        </div>

        {/* Evidence panel */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-muted/30 border-b border-border text-xs font-mono text-muted-foreground">Synthetic evidence</div>
          <pre className="p-4 font-mono text-sm code-panel whitespace-pre-wrap">{lab.evidence}</pre>
        </div>

        {/* Quiz */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">{lab.question}</p>
          <div className="space-y-2" role="radiogroup" aria-label="Answer options">
            {lab.options.map((opt, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={selected === i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                  submitted && i === lab.answer ? 'border-success bg-success/10 text-foreground' :
                  submitted && i === selected ? 'border-destructive bg-destructive/10 text-foreground' :
                  !submitted && i === selected ? 'border-primary bg-primary/10 text-foreground' :
                  'border-border bg-card text-muted-foreground hover:border-primary/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold">{String.fromCharCode(65 + i)})</span>
                  {opt}
                  {submitted && i === lab.answer && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
                  {submitted && i === selected && i !== lab.answer && <XCircle className="w-4 h-4 ml-auto text-destructive" />}
                </span>
              </button>
            ))}
          </div>
          {!submitted && selected !== null && <Button onClick={handleQuizSubmit}>Submit Answer</Button>}
          {submitted && (
            <div className={`p-3 rounded-lg text-sm ${correct ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`} role="status">
              {correct ? '✓ Correct. ' : `✗ The answer is ${String.fromCharCode(65 + lab.answer)}. `}{lab.explanation}
            </div>
          )}
        </div>

        {/* Defense and retest */}
        {submitted && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-medium text-foreground text-sm mb-1">Defensive control</h3>
              <p className="text-sm text-muted-foreground">{lab.defense}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-medium text-foreground text-sm mb-1">Retest guidance</h3>
              <p className="text-sm text-muted-foreground">{lab.retest}</p>
            </div>
          </div>
        )}

        {/* Report writing */}
        {submitted && (
          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="text-lg font-bold text-foreground">Write a finding</h2>
            <p className="text-sm text-muted-foreground">Use the evidence above to draft a structured finding. Export as Markdown when ready. Minimum 30 characters per field for completeness; accuracy requires human review.</p>
            <ReportEditor initial={reportFields} onChange={setReportFields} />
            {!reportSubmitted && <Button onClick={handleReportSubmit}>Mark Complete</Button>}
            {reportSubmitted && (
              <p className="text-sm text-success" role="status">
                Lab complete. {correct ? 'Quiz correct. ' : 'Quiz incorrect — review the explanation. '}
                {['evidence', 'impact', 'remediation', 'retest'].every(k => (reportFields[k] || '').trim().length >= 30) ? 'All fields drafted.' : 'Some fields are below minimum length.'}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
export default PracticeLab;
