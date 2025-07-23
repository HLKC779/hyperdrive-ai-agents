import ProtectedRoute from "@/components/ProtectedRoute";
import AgentManagement from "@/components/AgentManagement";

const Agents = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <AgentManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Agents;