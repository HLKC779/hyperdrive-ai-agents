import React, { useEffect } from 'react';
import { useAgentSystem } from '@/hooks/useAgentSystem';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
}

export default function IntelligentErrorHandler({ children }: Props) {
  const { analyzeAndFixError, startContinuousMonitoring, isActive } = useAgentSystem();

  useEffect(() => {
    if (!isActive) return;

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.log('🚨 Global error caught:', event.error);
      analyzeAndFixError(event.error, { 
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno 
      });
    };

    // Unhandled promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.log('🚨 Unhandled promise rejection:', event.reason);
      analyzeAndFixError(event.reason, { 
        type: 'promise_rejection',
        stack: event.reason?.stack 
      });
    };

    // Network error handler
    const handleNetworkError = (event: any) => {
      if (event.target?.status >= 400) {
        analyzeAndFixError(
          { message: `Network error: ${event.target.status}` },
          { 
            type: 'network_error',
            url: event.target?.url,
            status: event.target?.status 
          }
        );
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    // Start continuous monitoring
    const cleanup = startContinuousMonitoring();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      cleanup?.();
    };
  }, [analyzeAndFixError, startContinuousMonitoring, isActive]);

  return <>{children}</>;
}