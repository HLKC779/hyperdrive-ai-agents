import { useCallback } from 'react';
import { useRLSystem } from './useRLSystem';

export const useInteractionTracking = () => {
  const { recordInteraction, recordMetric } = useRLSystem();

  // Track button clicks
  const trackButtonClick = useCallback(async (elementId: string, context?: any) => {
    await recordInteraction({
      interactionType: 'button_click',
      targetElement: elementId,
      interactionData: {
        timestamp: new Date().toISOString(),
        elementType: 'button',
        ...context
      },
      systemState: {
        currentPage: window.location.pathname,
        userAgent: navigator.userAgent
      }
    });
  }, [recordInteraction]);

  // Track input submissions
  const trackInputSubmission = useCallback(async (formId: string, inputData: any) => {
    await recordInteraction({
      interactionType: 'input_submission',
      targetElement: formId,
      interactionData: {
        timestamp: new Date().toISOString(),
        dataLength: JSON.stringify(inputData).length,
        fieldCount: Object.keys(inputData).length
      },
      systemState: {
        currentPage: window.location.pathname
      }
    });
  }, [recordInteraction]);

  // Track navigation
  const trackNavigation = useCallback(async (fromPath: string, toPath: string) => {
    await recordInteraction({
      interactionType: 'navigation',
      interactionData: {
        fromPath,
        toPath,
        timestamp: new Date().toISOString()
      },
      systemState: {
        previousPage: fromPath,
        currentPage: toPath
      }
    });
  }, [recordInteraction]);

  // Track task completion
  const trackTaskCompletion = useCallback(async (taskId: string, success: boolean, timeSpent: number) => {
    await recordInteraction({
      interactionType: 'task_completion',
      targetElement: taskId,
      interactionData: {
        success,
        timeSpent,
        timestamp: new Date().toISOString()
      },
      outcome: {
        completed: success,
        efficiency: timeSpent < 30000 ? 'high' : timeSpent < 60000 ? 'medium' : 'low'
      }
    });

    // Also record as a metric
    await recordMetric({
      agentId: 'task-completion-agent',
      metricType: 'episode_completion',
      metricValue: success ? 1 : 0,
      metadata: { taskId, timeSpent }
    });
  }, [recordInteraction, recordMetric]);

  // Track errors
  const trackError = useCallback(async (errorType: string, errorMessage: string, context?: any) => {
    await recordInteraction({
      interactionType: 'error_encounter',
      interactionData: {
        errorType,
        errorMessage,
        context,
        timestamp: new Date().toISOString()
      },
      systemState: {
        currentPage: window.location.pathname,
        userAgent: navigator.userAgent
      }
    });
  }, [recordInteraction]);

  // Track preference changes
  const trackPreferenceChange = useCallback(async (preferenceType: string, oldValue: any, newValue: any) => {
    await recordInteraction({
      interactionType: 'preference_change',
      interactionData: {
        preferenceType,
        oldValue,
        newValue,
        timestamp: new Date().toISOString()
      }
    });
  }, [recordInteraction]);

  return {
    trackButtonClick,
    trackInputSubmission,
    trackNavigation,
    trackTaskCompletion,
    trackError,
    trackPreferenceChange
  };
};