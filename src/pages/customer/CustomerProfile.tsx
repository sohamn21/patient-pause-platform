
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkPatientExists } from '@/lib/clinicService';
import { PatientForm } from '@/components/clinic/PatientForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, UserPlus, UserCheck, CircleCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CustomerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [patientExists, setPatientExists] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [profileCreated, setProfileCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPatientProfile = async () => {
      if (!user) {
        setIsLoading(false);
        setIsCheckingProfile(false);
        return;
      }
      
      try {
        console.log("Checking patient profile for user:", user.id);
        setIsCheckingProfile(true);
        const exists = await checkPatientExists(user.id);
        console.log("Patient profile exists:", exists);
        setPatientExists(exists);
        setError(null);
      } catch (error) {
        console.error("Error checking patient profile:", error);
        setError("Could not retrieve your patient information. Please try again later.");
        toast({
          title: "Error",
          description: "Could not retrieve your patient information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsCheckingProfile(false);
      }
    };
    
    // Only check if user exists and we haven't made too many attempts
    // Limit to 2 attempts to prevent infinite checking
    if (user && checkAttempts < 2) {
      checkPatientProfile();
      setCheckAttempts(prev => prev + 1);
    } else {
      setIsLoading(false);
      setIsCheckingProfile(false);
    }
  }, [user, toast, checkAttempts]);
  
  const handleSuccess = () => {
    setPatientExists(true);
    setProfileCreated(true);
    toast({
      title: "Success",
      description: patientExists ? "Your profile has been updated" : "Your health profile has been created",
    });
  };

  const handleRetry = () => {
    setError(null);
    setCheckAttempts(0);
    setIsLoading(true);
    setIsCheckingProfile(true);
  };
  
  if (isLoading && checkAttempts <= 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading your information...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to access your profile
        </p>
        <Button onClick={() => navigate('/signin')}>
          Sign In
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Health Profile</h1>
          <p className="text-muted-foreground">
            There was a problem loading your profile information
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <Button onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (profileCreated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Profile Complete</h1>
          <p className="text-muted-foreground">
            Your health profile has been successfully created
          </p>
        </div>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex flex-col items-center">
            <CircleCheck className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Created Successfully</h2>
            <p className="text-center text-muted-foreground mb-6">
              You can now book appointments and manage your healthcare
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 w-full sm:justify-center">
              <Button onClick={() => navigate('/customer/book')}>
                Book an Appointment
              </Button>
              <Button variant="outline" onClick={() => {
                setProfileCreated(false);
              }}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Health Profile</h1>
        <p className="text-muted-foreground">
          {patientExists 
            ? "Update your health information and preferences" 
            : "Complete your health profile to book appointments more easily"}
        </p>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            {patientExists ? 
              <UserCheck className="h-5 w-5 text-green-500" /> :
              <UserPlus className="h-5 w-5 text-blue-500" />
            }
            <CardTitle>
              {patientExists ? "Update Health Information" : "Complete Health Profile"}
            </CardTitle>
          </div>
          <CardDescription>
            Your information will be shared with healthcare providers during appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCheckingProfile ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="ml-2">Checking profile status...</span>
            </div>
          ) : user.id ? (
            <PatientForm
              userId={user.id}
              onSuccess={handleSuccess}
              onCancel={() => navigate('/customer/dashboard')}
            />
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              User information is not available. Please try signing in again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;
