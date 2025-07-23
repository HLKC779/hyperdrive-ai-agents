import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/components/Dashboard";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const dashboardStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Agent Dashboard",
    "description": "Central control panel for managing AI agents, monitoring performance, and configuring intelligent automation systems.",
    "applicationCategory": "DashboardApplication",
    "featureList": [
      "Agent Performance Monitoring",
      "Real-time Analytics",
      "System Health Tracking",
      "Resource Management",
      "Automated Reporting"
    ]
  };

  return (
    <ProtectedRoute>
      <SEOHead 
        title="AI Agent Dashboard"
        description="Central control panel for managing AI agents, monitoring performance, and configuring intelligent automation systems with real-time analytics."
        keywords="AI dashboard, agent monitoring, performance analytics, system management, automation control"
        aiCapabilities="real-time monitoring, performance analytics, system health tracking, resource management, automated reporting"
        useCases="agent performance monitoring, system administration, resource optimization, automated decision making"
        structuredData={dashboardStructuredData}
      />
      <Dashboard />
    </ProtectedRoute>
  );
};

export default Index;
