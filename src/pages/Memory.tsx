import ProtectedRoute from "@/components/ProtectedRoute";
import MemorySystem from "@/components/MemorySystem";

const Memory = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <MemorySystem />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Memory;