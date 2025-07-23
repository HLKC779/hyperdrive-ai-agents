-- Fix security policies with proper columns
-- Update RL metrics policy to be more restrictive without referencing non-existent user_id
DROP POLICY IF EXISTS "Users can view all metrics" ON public.rl_agent_metrics;
CREATE POLICY "Authenticated users can view metrics" 
ON public.rl_agent_metrics 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update RL feedback policy to be more restrictive  
DROP POLICY IF EXISTS "Users can view all feedback" ON public.rl_feedback;
CREATE POLICY "Users can view their own feedback" 
ON public.rl_feedback 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Update RL training sessions policy to be more restrictive
DROP POLICY IF EXISTS "Users can view all training sessions" ON public.rl_training_sessions;
CREATE POLICY "Authenticated users can view training sessions" 
ON public.rl_training_sessions 
FOR SELECT 
USING (auth.role() = 'authenticated');