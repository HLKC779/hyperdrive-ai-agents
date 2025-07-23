import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      // Always clear local state regardless of error
      setUser(null);
      setSession(null);
      
      // If it's a session_not_found error, we don't need to treat it as an actual error
      // since the user is already logged out
      if (error && error.message !== "Session from session_id claim in JWT does not exist") {
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      // Clear local state even if there's an error
      setUser(null);
      setSession(null);
      return { error: err };
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
};