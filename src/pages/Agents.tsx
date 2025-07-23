import ProtectedRoute from "@/components/ProtectedRoute";
import AgentManagement from "@/components/AgentManagement";
import SEOHead from "@/components/SEOHead";

const Agents = () => {
  const agentsStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Agent Management",
    "description": "Comprehensive AI agent lifecycle management system for creating, deploying, and monitoring intelligent automation agents.",
    "featureList": [
      "Agent Creation and Configuration",
      "Lifecycle Management",
      "Performance Monitoring",
      "Behavior Customization",
      "Multi-Agent Coordination"
    ]
  };

  return (
    <ProtectedRoute>
      <SEOHead 
        title="AI Agent Management"
        description="Create, deploy, and manage intelligent AI agents with comprehensive lifecycle management, performance monitoring, and behavior customization."
        keywords="AI agent creation, agent management, intelligent automation, agent deployment, multi-agent systems"
        aiCapabilities="agent lifecycle management, behavior customization, performance monitoring, multi-agent coordination, intelligent automation"
        useCases="agent creation, deployment automation, behavior configuration, performance optimization, system coordination"
        structuredData={agentsStructuredData}
      />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <AgentManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Agents;