
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkPatientExists } from '@/lib/clinicService';
import { PatientForm } from '@/components/clinic/PatientForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, UserPlus, UserCheck, CircleCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CustomerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [patientExists, setPatientExists] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Checking if patient exists for user ID:", user.id);
        const exists = await checkPatientExists(user.id);
        console.log("Patient exists:", exists);
        setPatientExists(exists);
      } catch (err) {
        console.error("Error checking patient profile:", err);
        toast({
          title: "Error",
          description: "Could not retrieve your patient information",
          variant: "destructive",
        });
        setError("Could not retrieve your patient information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [user, toast]);
  
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
    setIsLoading(true);
    // Re-trigger the effect
    if (user) {
      checkPatientExists(user.id)
        .then(exists => {
          setPatientExists(exists);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error on retry:", err);
          setError("Could not retrieve your patient information. Please try again later.");
          setIsLoading(false);
        });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h2 className="text-xl font-semibold mb-3">Sign In Required</h2>
        <p className="text-muted-foreground mb-4">
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
      <div className="space-y-4">
        <h1 className="text-xl font-bold">My Health Profile</h1>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your profile
        </p>
        
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button onClick={handleRetry}>
          Try Again
        </Button>
      </div>
    );
  }
  
  if (profileCreated) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Health Profile Complete</h1>
        
        <Card className="text-center p-6">
          <div className="flex flex-col items-center">
            <CircleCheck className="h-12 w-12 text-green-500 mb-3" />
            <h2 className="text-lg font-medium mb-2">Profile Created Successfully</h2>
            <p className="text-muted-foreground mb-4">
              You can now book appointments and manage your healthcare
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button onClick={() => navigate('/customer/book')}>
                Book an Appointment
              </Button>
              <Button variant="outline" onClick={() => setProfileCreated(false)}>
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My Health Profile</h1>
      <p className="text-muted-foreground mb-4">
        {patientExists 
          ? "Update your health information" 
          : "Complete your health profile to book appointments"}
      </p>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {patientExists ? 
              <UserCheck className="h-5 w-5 text-green-500" /> :
              <UserPlus className="h-5 w-5 text-primary" />
            }
            <CardTitle className="text-lg">
              {patientExists ? "Update Health Information" : "Complete Health Profile"}
            </CardTitle>
          </div>
          <CardDescription>
            Your information will be shared with healthcare providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.id && (
            <PatientForm
              userId={user.id}
              onSuccess={handleSuccess}
              onCancel={() => navigate('/customer/dashboard')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;
