import ProtectedRoute from "@/components/ProtectedRoute";
import KnowledgeBase from "@/components/KnowledgeBase";
import SEOHead from "@/components/SEOHead";

const Knowledge = () => {
  const knowledgeStructuredData = {
    "@context": "https://schema.org",
    "@type": "KnowledgeBase",
    "name": "AI Knowledge Management System",
    "description": "Advanced knowledge graph and semantic search system for AI agents with vector embeddings and intelligent content discovery.",
    "featureList": [
      "Knowledge Graph Construction",
      "Vector Embeddings",
      "Semantic Search",
      "Content Indexing",
      "Knowledge Discovery"
    ]
  };

  return (
    <ProtectedRoute>
      <SEOHead 
        title="Knowledge Management"
        description="Advanced knowledge graph and semantic search system with vector embeddings for intelligent content discovery and AI-powered knowledge management."
        keywords="knowledge graphs, vector embeddings, semantic search, knowledge management, content indexing, information retrieval"
        aiCapabilities="knowledge graph construction, vector embeddings, semantic search, content indexing, knowledge discovery, intelligent retrieval"
        useCases="knowledge management, content discovery, semantic search, information organization, intelligent documentation"
        structuredData={knowledgeStructuredData}
      />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <KnowledgeBase />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Knowledge;