-- Fix the trigger issue by dropping it first if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Now create the trigger again
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();