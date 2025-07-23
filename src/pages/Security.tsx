import ProtectedRoute from "@/components/ProtectedRoute";
import SecurityGovernance from "@/components/SecurityGovernance";

const Security = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <SecurityGovernance />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Security;