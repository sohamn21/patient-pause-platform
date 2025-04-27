
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { BlurCard } from '@/components/ui/blur-card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if we came from a booking page
  const fromBooking = location.search.includes('from=booking');
  
  // Get the return path if any
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/customer/dashboard';

  console.log(`SignIn: fromBooking=${fromBooking}, returnTo=${returnTo}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await signIn(email, password);
      // If login succeeds, user will be redirected by AuthContext
    } catch (err) {
      console.error('Sign in error:', err);
      toast({
        title: "Sign in failed",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestBooking = () => {
    // Navigate to the booking page or return to the previous page
    console.log("Continuing as guest, navigating to:", returnTo);
    navigate(returnTo);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
          <Clock className="w-5 h-5" />
          <span className="font-bold">Waitify</span>
        </Link>
      </div>
      
      <BlurCard className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Enter your details to continue.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          {fromBooking && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGuestBooking}
              >
                Continue as Guest
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                No account needed to book an appointment
              </p>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default SignIn;
