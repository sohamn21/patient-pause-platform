
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlowButton } from '@/components/ui/glow-button';
import { Clock, Building, User } from 'lucide-react';
import { BlurCard } from '@/components/ui/blur-card';

const SignUp = () => {
  const navigate = useNavigate();

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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">
              Choose how you want to use Waitify
            </p>
          </div>
          
          <div className="space-y-4">
            <GlowButton
              className="w-full h-auto py-6 justify-start"
              onClick={() => navigate('/signup/business')}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Business Owner</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Manage waitlists, appointments, and customers for your business
                  </p>
                </div>
              </div>
            </GlowButton>
            
            <Button
              variant="outline"
              className="w-full h-auto py-6 justify-start"
              onClick={() => navigate('/signup/user')}
            >
              <div className="flex items-start gap-4">
                <div className="bg-muted p-2 rounded-full">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Customer</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Join waitlists, book appointments, and manage reservations
                  </p>
                </div>
              </div>
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default SignUp;
