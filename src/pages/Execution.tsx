import ProtectedRoute from "@/components/ProtectedRoute";
import ExecutionEngine from "@/components/ExecutionEngine";

const Execution = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ExecutionEngine />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Execution;