import ProtectedRoute from "@/components/ProtectedRoute";
import ReasoningEngine from "@/components/ReasoningEngine";

const Reasoning = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ReasoningEngine />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Reasoning;