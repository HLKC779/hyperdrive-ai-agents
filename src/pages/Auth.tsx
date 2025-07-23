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
import appCover from '@/assets/app-cover.jpg';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-background"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <Card className="card-enhanced w-full max-w-md relative z-10 animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 overflow-hidden rounded-lg shadow-glow">
            <img 
              src={appCover} 
              alt="App Cover" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger 
                value="signin" 
                className="transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft"
              >
                Sign Up
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
                  className="button-gradient w-full h-12 text-base font-medium rounded-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
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
                  className="button-gradient w-full h-12 text-base font-medium rounded-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
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