import { useNavigate } from "react-router-dom";
import { ModulesOverview } from "@/components/ModulesOverview";
import { reviewed } from "@/data/registry";

const PlaybookIndex = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-16">
      <main>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Playbook</h1>
          <p className="text-muted-foreground text-sm">All 17 lesson modules — commands, explanations and reference scripts. Content reviewed {reviewed}.</p>
        </div>
        <ModulesOverview onModuleClick={(id) => navigate(`/playbook/${id}`)} currentModule="" />
      </main>
    </div>
  );
};
export default PlaybookIndex;
