import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import authHero from "@/assets/auth-hero.jpg";
import authOrb from "@/assets/auth-orb.jpg";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("already registered") || error.message.includes("already been registered")) {
          errorMessage = "This email is already registered. Please try signing in instead.";
        }
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden auth-hero-bg">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${authHero})` }}
      ></div>
      
      {/* Magical floating orbs */}
      <div className="floating-orb w-32 h-32 top-1/4 left-1/4 opacity-60"></div>
      <div className="floating-orb w-24 h-24 top-3/4 right-1/3 opacity-40"></div>
      <div className="floating-orb w-16 h-16 top-1/2 right-1/4 opacity-30"></div>
      
      {/* Magical particles */}
      <div className="magic-particles top-1/3 left-1/2"></div>
      <div className="magic-particles top-2/3 left-1/3"></div>
      <div className="magic-particles top-1/4 right-1/3"></div>
      <div className="magic-particles top-3/4 right-1/2"></div>
      <div className="magic-particles top-1/2 left-1/5"></div>
      
      <Card className="auth-card-enhanced w-full max-w-md relative z-10 animate-scale-in">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 relative">
            <div 
              className="w-full h-full rounded-full bg-cover bg-center shadow-glow opacity-90"
              style={{ backgroundImage: `url(${authOrb})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-primary rounded-full opacity-40"></div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              ✨ Welcome to the Future
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg font-medium">
              Enter the magical realm of intelligent automation
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-effect p-1 rounded-xl">
              <TabsTrigger 
                value="signin" 
                className="transition-all duration-500 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow data-[state=active]:scale-105"
              >
                🔮 Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="transition-all duration-500 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow data-[state=active]:scale-105"
              >
                ✨ Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-6 mt-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="input-enhanced h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="input-enhanced h-12 text-base"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="button-gradient w-full h-12 text-base font-medium rounded-xl relative overflow-hidden group" 
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? (
                    <div className="flex items-center space-x-2 relative z-10">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>✨ Entering the realm...</span>
                    </div>
                  ) : (
                    <span className="relative z-10">🔮 Enter the Magic</span>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-6 mt-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="Enter your display name"
                    className="input-enhanced h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="input-enhanced h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password (min. 6 characters)"
                    minLength={6}
                    className="input-enhanced h-12 text-base"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="button-gradient w-full h-12 text-base font-medium rounded-xl relative overflow-hidden group" 
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? (
                    <div className="flex items-center space-x-2 relative z-10">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>✨ Weaving your story...</span>
                    </div>
                  ) : (
                    <span className="relative z-10">🌟 Begin Your Journey</span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;