import ProtectedRoute from "@/components/ProtectedRoute";
import ReinforcementLearning from "@/components/ReinforcementLearning";

const ReinforcementLearningPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ReinforcementLearning />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReinforcementLearningPage;