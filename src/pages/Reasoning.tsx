import ProtectedRoute from "@/components/ProtectedRoute";
import ReasoningEngine from "@/components/ReasoningEngine";
import SEOHead from "@/components/SEOHead";

const Reasoning = () => {
  const reasoningStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Reasoning Engine",
    "description": "Advanced logical reasoning and decision-making system with symbolic reasoning, neural inference, and causal analysis capabilities.",
    "featureList": [
      "Symbolic Reasoning",
      "Neural Inference",
      "Causal Analysis",
      "Decision Trees",
      "Logic Programming"
    ]
  };

  return (
    <ProtectedRoute>
      <SEOHead 
        title="AI Reasoning Engine"
        description="Advanced logical reasoning and decision-making system with symbolic reasoning, neural inference, and causal analysis for intelligent problem solving."
        keywords="AI reasoning, symbolic reasoning, neural inference, causal analysis, decision making, logic programming"
        aiCapabilities="symbolic reasoning, neural inference, causal analysis, decision trees, logic programming, intelligent problem solving"
        useCases="automated decision making, logical inference, problem solving, causal reasoning, rule-based systems"
        structuredData={reasoningStructuredData}
      />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ReasoningEngine />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Reasoning;