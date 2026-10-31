import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const PlaybookIndex = lazy(() => import("./pages/PlaybookIndex"));
const PlaybookLesson = lazy(() => import("./pages/PlaybookLesson"));
const PracticeIndex = lazy(() => import("./pages/PracticeIndex"));
const PracticeLab = lazy(() => import("./pages/PracticeLab"));
const LearnIndex = lazy(() => import("./pages/LearnIndex"));
const LearnTopic = lazy(() => import("./pages/LearnTopic"));
const AISection = lazy(() => import("./pages/AISection"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-muted-foreground">Loading…</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playbook" element={<PlaybookIndex />} />
            <Route path="/playbook/:moduleId" element={<PlaybookLesson />} />
            <Route path="/practice" element={<PracticeIndex />} />
            <Route path="/practice/:moduleId" element={<PracticeLab />} />
            <Route path="/learn" element={<LearnIndex />} />
            <Route path="/learn/:topicId" element={<LearnTopic />} />
            <Route path="/ai" element={<AISection />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
