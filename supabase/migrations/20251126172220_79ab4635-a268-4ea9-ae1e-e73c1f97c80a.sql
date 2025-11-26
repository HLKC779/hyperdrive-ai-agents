-- Create agent_metrics table for storing real-time metrics
CREATE TABLE IF NOT EXISTS public.agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'idle', 'busy', 'error')),
  performance DECIMAL NOT NULL CHECK (performance >= 0 AND performance <= 100),
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  avg_response_time DECIMAL NOT NULL,
  memory_usage DECIMAL NOT NULL CHECK (memory_usage >= 0 AND memory_usage <= 100),
  cpu_usage DECIMAL CHECK (cpu_usage >= 0 AND cpu_usage <= 100),
  error_count INTEGER NOT NULL DEFAULT 0,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view agent metrics"
ON public.agent_metrics FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert agent metrics"
ON public.agent_metrics FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update agent metrics"
ON public.agent_metrics FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create agent_alerts table for tracking alerts
CREATE TABLE IF NOT EXISTS public.agent_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('performance', 'error', 'memory', 'timeout', 'offline')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agent_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view agent alerts"
ON public.agent_alerts FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert agent alerts"
ON public.agent_alerts FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update agent alerts"
ON public.agent_alerts FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_agent_metrics_agent_id ON public.agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_created_at ON public.agent_metrics(created_at DESC);
CREATE INDEX idx_agent_alerts_agent_id ON public.agent_alerts(agent_id);
CREATE INDEX idx_agent_alerts_resolved ON public.agent_alerts(resolved);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_alerts;

-- Set replica identity for realtime updates
ALTER TABLE public.agent_metrics REPLICA IDENTITY FULL;
ALTER TABLE public.agent_alerts REPLICA IDENTITY FULL;

-- Create trigger for updated_at
CREATE TRIGGER update_agent_metrics_updated_at
BEFORE UPDATE ON public.agent_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();