-- Fix security_events RLS: Drop overly permissive policy and add proper user-scoped policies
DROP POLICY IF EXISTS "Authenticated users can view security events" ON public.security_events;

CREATE POLICY "Users can view their own security events"
ON public.security_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security events"
ON public.security_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RL feedback table
CREATE TABLE IF NOT EXISTS public.rl_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_type TEXT NOT NULL,
  feedback_value JSONB NOT NULL,
  context JSONB,
  processed BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rl_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
ON public.rl_feedback FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can insert feedback"
ON public.rl_feedback FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RL agent metrics table
CREATE TABLE IF NOT EXISTS public.rl_agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  session_id TEXT,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rl_agent_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rl metrics"
ON public.rl_agent_metrics FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert rl metrics"
ON public.rl_agent_metrics FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RL system interactions table
CREATE TABLE IF NOT EXISTS public.rl_system_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  reward NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rl_system_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions"
ON public.rl_system_interactions FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can insert interactions"
ON public.rl_system_interactions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RL training sessions table
CREATE TABLE IF NOT EXISTS public.rl_training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  session_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  config JSONB,
  metrics JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rl_training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view training sessions"
ON public.rl_training_sessions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert training sessions"
ON public.rl_training_sessions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update training sessions"
ON public.rl_training_sessions FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rl_feedback_agent ON public.rl_feedback(agent_id);
CREATE INDEX IF NOT EXISTS idx_rl_feedback_session ON public.rl_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_rl_agent_metrics_agent ON public.rl_agent_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_rl_interactions_session ON public.rl_system_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_rl_training_agent ON public.rl_training_sessions(agent_id);