import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Quiz {
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface QuizQuestionProps {
  quiz: Quiz;
  onComplete: (correct: boolean) => void;
}

export const QuizQuestion = ({ quiz, onComplete }: QuizQuestionProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (label: string) => {
    if (submitted) return;
    setSelected(label);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    setTimeout(() => onComplete(selected === quiz.correctAnswer), 2000);
  };

  return (
    <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
      <div className="flex items-start gap-2 mb-3">
        <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground font-medium">{quiz.question}</p>
      </div>

      <div className="space-y-2 mb-3">
        {quiz.options.map((option) => {
          const isCorrect = submitted && option.label === quiz.correctAnswer;
          const isWrong = submitted && option.label === selected && option.label !== quiz.correctAnswer;

          return (
            <button
              key={option.label}
              onClick={() => handleSelect(option.label)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md border text-sm font-mono transition-all",
                !submitted && selected === option.label && "border-accent bg-accent/20 text-foreground",
                !submitted && selected !== option.label && "border-border bg-secondary/30 text-muted-foreground hover:border-accent/50 hover:bg-accent/10",
                isCorrect && "border-success bg-success/20 text-success",
                isWrong && "border-destructive bg-destructive/20 text-destructive"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <span className="font-bold text-xs">{option.label})</span>
                {option.text}
                {isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                {isWrong && <XCircle className="w-4 h-4 ml-auto" />}
              </span>
            </button>
          );
        })}
      </div>

      {!submitted && selected && (
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 rounded bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/80 transition-colors"
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <div className={cn(
          "mt-2 p-2 rounded text-xs",
          selected === quiz.correctAnswer ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {selected === quiz.correctAnswer ? "✓ Correct! " : `✗ Wrong. The answer is ${quiz.correctAnswer}. `}
          {quiz.explanation}
        </div>
      )}
    </div>
  );
};
