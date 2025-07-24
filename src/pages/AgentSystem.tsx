import React from 'react';
import AutomatedAgentSystem from '@/components/AutomatedAgentSystem';
import SEOHead from '@/components/SEOHead';

export default function AgentSystem() {
  return (
    <>
      <SEOHead 
        title="Agent System | AI Platform"
        description="Automated AI agent system for testing, debugging, and maintenance"
      />
      <AutomatedAgentSystem />
    </>
  );
}