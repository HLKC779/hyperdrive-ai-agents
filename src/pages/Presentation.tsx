import ProtectedRoute from "@/components/ProtectedRoute";
import ApplicationPresentation from "@/components/ApplicationPresentation";

const Presentation = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ApplicationPresentation />
      </div>
    </ProtectedRoute>
  );
};

export default Presentation;