import ToolIntegration from "@/components/ToolIntegration";
import BrightnessControl from "@/components/BrightnessControl";

const Tools = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
  );
};

export default Tools;