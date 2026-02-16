import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Terminal, CheckCircle2, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion, type Quiz } from "./QuizQuestion";

export interface CLIStep {
  id: string;
  scenario: string;
  prompt: string;
  expectedCommands: string[];
  hint: string;
  successMessage: string;
  explanation: string;
  wrongExplanations?: Record<string, string>;
  output?: string;
  quiz?: Quiz;
}

interface CLISimulatorProps {
  title: string;
  scenarioDescription: string;
  steps: CLIStep[];
  onComplete?: () => void;
}

interface TerminalLine {
  type: "input" | "output" | "success" | "error" | "info" | "scenario";
  text: string;
}

export const CLISimulator = ({ title, scenarioDescription, steps, onComplete }: CLISimulatorProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setLines([
      { type: "info", text: `╔══════════════════════════════════════════╗` },
      { type: "info", text: `║  ${title.toUpperCase().padEnd(40)}║` },
      { type: "info", text: `╚══════════════════════════════════════════╝` },
      { type: "info", text: "" },
      { type: "scenario", text: `📋 SCENARIO: ${scenarioDescription}` },
      { type: "info", text: "" },
      { type: "info", text: `─── Step 1/${steps.length}: ${steps[0]?.scenario || ""} ───` },
      { type: "info", text: "" },
      { type: "scenario", text: `🎯 ${steps[0]?.prompt || ""}` },
      { type: "info", text: "" },
    ]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, showQuiz]);

  const normalizeCommand = (cmd: string): string => {
    return cmd.trim().replace(/\s+/g, " ").toLowerCase();
  };

  const checkCommand = (userInput: string): boolean => {
    const normalized = normalizeCommand(userInput);
    return currentStep.expectedCommands.some(
      (expected) => normalizeCommand(expected) === normalized
    );
  };

  const getWrongExplanation = (userInput: string): string | null => {
    if (!currentStep.wrongExplanations) return null;
    const normalized = normalizeCommand(userInput);
    for (const [pattern, explanation] of Object.entries(currentStep.wrongExplanations)) {
      if (normalized.includes(normalizeCommand(pattern))) {
        return explanation;
      }
    }
    return null;
  };

  const advanceStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= steps.length) {
      setCompleted(true);
      setLines((prev) => [
        ...prev,
        { type: "info", text: "" },
        { type: "success", text: "═══════════════════════════════════════════" },
        { type: "success", text: "  🏆 LAB COMPLETE! All exercises passed." },
        { type: "success", text: "═══════════════════════════════════════════" },
      ]);
      onComplete?.();
    } else {
      setCurrentStepIndex(nextIndex);
      setShowHint(false);
      setAttempts(0);
      setShowQuiz(false);
      setQuizCompleted(false);
      const nextStep = steps[nextIndex];
      setLines((prev) => [
        ...prev,
        { type: "info", text: "" },
        { type: "info", text: `─── Step ${nextIndex + 1}/${steps.length}: ${nextStep.scenario} ───` },
        { type: "info", text: "" },
        { type: "scenario", text: `🎯 ${nextStep.prompt}` },
        { type: "info", text: "" },
      ]);
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || completed || showQuiz) return;

    const newLines: TerminalLine[] = [
      { type: "input", text: `$ ${input}` },
    ];

    if (checkCommand(input)) {
      if (currentStep.output) {
        newLines.push({ type: "output", text: currentStep.output });
      }
      newLines.push({ type: "success", text: `✓ ${currentStep.successMessage}` });
      newLines.push({ type: "info", text: "" });
      newLines.push({ type: "info", text: `💡 ${currentStep.explanation}` });

      setLines((prev) => [...prev, ...newLines]);

      if (currentStep.quiz) {
        setShowQuiz(true);
      } else {
        setTimeout(() => advanceStep(), 800);
      }
    } else {
      setAttempts((a) => a + 1);
      const wrongExplanation = getWrongExplanation(input);

      if (wrongExplanation) {
        newLines.push({ type: "error", text: `✗ Incorrect: ${wrongExplanation}` });
      } else {
        newLines.push({ type: "error", text: `✗ That's not quite right. Try again.` });
      }

      if (attempts >= 1) {
        newLines.push({ type: "info", text: `💡 Hint: ${currentStep.hint}` });
      }

      if (attempts >= 2) {
        newLines.push({
          type: "info",
          text: `📖 Expected: ${currentStep.expectedCommands[0]}`,
        });
      }

      setLines((prev) => [...prev, ...newLines]);
    }

    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleQuizComplete = (correct: boolean) => {
    setQuizCompleted(true);
    if (correct) {
      setLines((prev) => [
        ...prev,
        { type: "success", text: "✓ Quiz answered correctly! Great understanding." },
      ]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "info", text: "📖 Review the explanation above and move on." },
      ]);
    }
    setTimeout(() => {
      setShowQuiz(false);
      advanceStep();
    }, 1000);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setInput("");
    setShowHint(false);
    setAttempts(0);
    setShowQuiz(false);
    setQuizCompleted(false);
    setCompleted(false);
    setLines([
      { type: "info", text: `╔══════════════════════════════════════════╗` },
      { type: "info", text: `║  ${title.toUpperCase().padEnd(40)}║` },
      { type: "info", text: `╚══════════════════════════════════════════╝` },
      { type: "info", text: "" },
      { type: "scenario", text: `📋 SCENARIO: ${scenarioDescription}` },
      { type: "info", text: "" },
      { type: "info", text: `─── Step 1/${steps.length}: ${steps[0]?.scenario || ""} ───` },
      { type: "info", text: "" },
      { type: "scenario", text: `🎯 ${steps[0]?.prompt || ""}` },
      { type: "info", text: "" },
    ]);
  };

  return (
    <div className="rounded-xl border border-primary/30 bg-card overflow-hidden box-glow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-mono font-semibold text-foreground text-sm">Interactive Lab</span>
          <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
            {completed ? "COMPLETE" : `${currentStepIndex + 1}/${steps.length}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!completed && (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs px-2 py-1 rounded bg-warning/20 text-warning hover:bg-warning/30 transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Hint
            </button>
          )}
          <button
            onClick={handleReset}
            className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((completed ? steps.length : currentStepIndex) / steps.length) * 100}%` }}
        />
      </div>

      {/* Terminal area */}
      <div
        ref={terminalRef}
        className="p-4 font-mono text-sm max-h-[500px] overflow-y-auto scrollbar-thin terminal-bg"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap",
              line.type === "input" && "text-terminal leading-relaxed",
              line.type === "output" && "text-muted-foreground leading-relaxed",
              line.type === "success" && "text-success font-medium leading-relaxed",
              line.type === "error" && "text-destructive leading-relaxed",
              line.type === "info" && "text-primary/70 leading-relaxed",
              line.type === "scenario" && "text-lg md:text-xl font-bold text-foreground text-glow leading-snug py-1"
            )}
          >
            {line.text}
          </div>
        ))}

        {/* Quiz overlay */}
        {showQuiz && currentStep.quiz && !quizCompleted && (
          <div className="mt-4">
            <QuizQuestion quiz={currentStep.quiz} onComplete={handleQuizComplete} />
          </div>
        )}

        {/* Input line */}
        {!completed && !showQuiz && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-primary select-none">
              root@kali:~#
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-terminal outline-none font-mono text-sm caret-primary"
              placeholder="Type your command..."
              autoFocus
              spellCheck={false}
            />
            <span className="w-2 h-4 bg-primary animate-typing" />
          </div>
        )}

        {/* Hint display */}
        {showHint && !completed && (
          <div className="mt-2 p-2 rounded bg-warning/10 border border-warning/30 text-warning text-xs">
            💡 {currentStep.hint}
          </div>
        )}
      </div>
    </div>
  );
};
