
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkPatientExists } from '@/lib/clinicService';
import { PatientForm } from '@/components/clinic/PatientForm';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const BookAppointmentPage = () => {
  const { businessId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPatient, setIsPatient] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appointment'>('profile');
  
  useEffect(() => {
    const checkPatientStatus = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const patientExists = await checkPatientExists(user.id);
        setIsPatient(patientExists);
        
        if (patientExists) {
          setActiveTab('appointment');
        }
      } catch (error) {
        console.error("Error checking patient status:", error);
        toast({
          title: "Error",
          description: "Could not check patient status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPatientStatus();
  }, [user, toast]);
  
  const handlePatientFormSuccess = () => {
    setIsPatient(true);
    setActiveTab('appointment');
    toast({
      title: "Profile Saved",
      description: "Your patient profile has been saved",
    });
  };
  
  const handleAppointmentSuccess = () => {
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been successfully scheduled",
    });
    navigate('/customer/appointments');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Business Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Please select a business to book an appointment with.
        </p>
        <Button onClick={() => navigate('/customer/dashboard')}>
          Return to Dashboard
        </Button>
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
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'appointment')}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="profile" disabled={!isPatient && activeTab === 'profile'}>
            Patient Information
          </TabsTrigger>
          <TabsTrigger value="appointment" disabled={!isPatient}>
            Appointment Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Please provide your personal and medical information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientForm 
                userId={user?.id || ''}
                onSuccess={handlePatientFormSuccess}
                onCancel={() => navigate('/customer/dashboard')}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointment">
          <PatientAppointmentBooking 
            businessId={businessId}
            onSuccess={handleAppointmentSuccess}
            onCancel={() => navigate('/customer/dashboard')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookAppointmentPage;
