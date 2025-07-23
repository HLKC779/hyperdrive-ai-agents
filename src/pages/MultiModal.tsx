import ProtectedRoute from "@/components/ProtectedRoute";
import MultiModalProcessing from "@/components/MultiModalProcessing";

const MultiModal = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <MultiModalProcessing />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MultiModal;