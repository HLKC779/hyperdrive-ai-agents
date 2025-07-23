import ProtectedRoute from "@/components/ProtectedRoute";
import ToolIntegration from "@/components/ToolIntegration";
import BrightnessControl from "@/components/BrightnessControl";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Tools = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Go Back Button */}
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tools & Integrations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your tools, integrations, and customize your interface preferences
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Brightness Control - Featured in sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Interface Settings</h2>
                <BrightnessControl />
              </div>
            </div>

            {/* Main Tool Integration */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Tool Integrations</h2>
                <div className="card-enhanced">
                  <ToolIntegration />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Tools;