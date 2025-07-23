import ProtectedRoute from "@/components/ProtectedRoute";
import KnowledgeBase from "@/components/KnowledgeBase";

const Knowledge = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <KnowledgeBase />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Knowledge;