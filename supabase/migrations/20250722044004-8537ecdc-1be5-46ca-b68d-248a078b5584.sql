-- Phase 1: Critical Authentication Setup
-- First, ensure we have proper user profiles with security considerations

-- Update profiles table to ensure user_id is not nullable and add security fields
ALTER TABLE public.profiles 
  ALTER COLUMN user_id SET NOT NULL;

-- Add security-related fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create user_roles table for proper role management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles safely
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = check_user_id LIMIT 1;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = required_role
  );
$$;

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policies for audit_logs (only admins can view)
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Update existing RLS policies to be more secure
-- Fix the overly permissive policies

-- Update knowledge documents policies to require authentication
DROP POLICY IF EXISTS "Knowledge documents are viewable by everyone" ON public.knowledge_documents;
CREATE POLICY "Authenticated users can view active knowledge documents" 
ON public.knowledge_documents 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

-- Update knowledge chunks policies
DROP POLICY IF EXISTS "Knowledge chunks are viewable by everyone" ON public.knowledge_chunks;
CREATE POLICY "Authenticated users can view knowledge chunks for active documents" 
ON public.knowledge_chunks 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM knowledge_documents kd 
    WHERE kd.id = knowledge_chunks.document_id 
    AND kd.is_active = true
  )
);

-- Create function to update user login tracking
CREATE OR REPLACE FUNCTION public.update_user_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    last_login_at = now(),
    login_count = COALESCE(login_count, 0) + 1
  WHERE user_id = NEW.id;
  
  -- Log the login event
  INSERT INTO public.audit_logs (user_id, action, ip_address)
  VALUES (NEW.id, 'user_login', NEW.raw_app_meta_data->>'ip_address');
  
  RETURN NEW;
END;
$$;

-- Create trigger for login tracking (will be applied when auth events occur)
CREATE OR REPLACE FUNCTION public.handle_auth_user_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update login tracking when user profile is accessed after auth
  IF TG_OP = 'UPDATE' AND OLD.last_login_at IS DISTINCT FROM NEW.last_login_at THEN
    RETURN NEW;
  END IF;
  
  -- For new logins, update the tracking
  UPDATE public.profiles 
  SET 
    last_login_at = now(),
    login_count = COALESCE(login_count, 0) + 1
  WHERE user_id = auth.uid() AND last_login_at < now() - INTERVAL '1 hour';
  
  RETURN NEW;
END;
$$;

-- Update the existing new user handler to set proper defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name, email_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.email_confirmed_at IS NOT NULL), false)
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Log user creation
  INSERT INTO public.audit_logs (user_id, action, new_data)
  VALUES (NEW.id, 'user_created', to_jsonb(NEW));
  
  RETURN NEW;
END;
$$;

-- Create indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Update timestamps trigger for audit logs
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();