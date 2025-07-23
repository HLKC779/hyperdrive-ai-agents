import ProtectedRoute from "@/components/ProtectedRoute";
import SystemMonitoring from "@/components/SystemMonitoring";

const Monitoring = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <SystemMonitoring />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Monitoring;