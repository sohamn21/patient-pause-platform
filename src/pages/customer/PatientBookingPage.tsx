import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  getPractitioners, 
  getServices, 
  createAppointment, 
  checkPatientExists,
  createPatientProfile 
} from '@/lib/clinicService';
import { 
  Practitioner, 
  Service, 
  PatientFormData, 
  AppointmentFormData 
} from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Clock, 
  User, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { PatientForm } from '@/components/clinic/PatientForm';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';

const PatientBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('businessId');
  const appointmentId = searchParams.get('appointmentId');
  const joinMode = searchParams.get('join') === 'true';
  
  const [currentStep, setCurrentStep] = useState<'patient-info' | 'appointment-details'>('patient-info');
  const [isPatient, setIsPatient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [businessIdVerified, setBusinessIdVerified] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPatientProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if user is already a patient
        const patientExists = await checkPatientExists(user.id);
        setIsPatient(patientExists);
        
        if (patientExists) {
          setCurrentStep('appointment-details');
        }
      } catch (error) {
        console.error("Error checking patient profile:", error);
        toast({
          title: "Error",
          description: "Could not verify your patient information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Verify businessId is valid (just basic validation for now)
    if (businessId) {
      setBusinessIdVerified(businessId);
      checkPatientProfile();
    } else {
      toast({
        title: "Missing Information",
        description: "No clinic selected. Please scan a valid QR code.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [user, businessId, toast]);
  
  const handlePatientFormSuccess = async (patientData: PatientFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book an appointment",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    setIsLoading(true);
    try {
      if (!isPatient) {
        // Create patient profile if one doesn't exist
        await createPatientProfile(user.id, patientData);
        setIsPatient(true);
      }
      
      // Move to appointment booking step
      setCurrentStep('appointment-details');
      toast({
        title: "Profile Saved",
        description: "Your information has been saved. You can now book an appointment.",
      });
    } catch (error) {
      console.error("Error saving patient information:", error);
      toast({
        title: "Error",
        description: "Failed to save your information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading your information...</p>
        </div>
      </div>
    );
  }
  
  if (!businessIdVerified) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Invalid clinic information. Please scan a valid QR code or select a clinic.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Button onClick={() => navigate('/customer/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to book an appointment.
        </p>
        <Button onClick={() => navigate('/signin', { 
          state: { redirectTo: `/customer/book?businessId=${businessIdVerified}` } 
        })}>
          Sign In
        </Button>
      </div>
    );
  }
  
  if (appointmentSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Appointment Scheduled</h2>
          <p className="text-center text-muted-foreground mb-6">
            Your appointment has been successfully booked. You'll receive a confirmation shortly.
          </p>
          <div className="flex flex-col space-y-2 w-full">
            <Button onClick={() => navigate('/customer/appointments')}>
              View My Appointments
            </Button>
            <Button variant="outline" onClick={() => navigate('/customer/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (currentStep === 'patient-info') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Please provide your information before booking
          </p>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              This information will be shared with your healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientForm 
              userId={user.id}
              onSuccess={handlePatientFormSuccess}
              onCancel={() => navigate(-1)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment with your preferred healthcare provider
        </p>
      </div>
      
      <PatientAppointmentBooking 
        businessId={businessIdVerified}
        onSuccess={() => setAppointmentSuccess(true)}
        onCancel={() => navigate('/customer/dashboard')}
      />
    </div>
  );
};

export default PatientBookingPage;
