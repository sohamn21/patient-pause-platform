
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkPatientExists, getBusinessById } from '@/lib/clinicService';
import { PatientForm } from '@/components/clinic/PatientForm';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const BookAppointmentPage = () => {
  const { businessId } = useParams();
  const [searchParams] = useSearchParams();
  const businessIdFromQuery = searchParams.get('businessId');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use businessId from path params or query params
  const finalBusinessId = businessId || businessIdFromQuery;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPatient, setIsPatient] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appointment'>('profile');
  const [businessExists, setBusinessExists] = useState(false);
  
  useEffect(() => {
    console.log("BookAppointmentPage - businessId from path:", businessId);
    console.log("BookAppointmentPage - businessId from query:", businessIdFromQuery);
    console.log("BookAppointmentPage - final businessId:", finalBusinessId);
    
    const checkBusinessAndPatientStatus = async () => {
      if (!finalBusinessId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // First check if the business exists and is a clinic
        const business = await getBusinessById(finalBusinessId);
        console.log("Business data:", business);
        
        if (!business || business?.business_type !== 'clinic') {
          console.log("Business does not exist or is not a clinic");
          setBusinessExists(false);
          setIsLoading(false);
          toast({
            title: "Invalid Clinic",
            description: "The selected business is not a healthcare provider.",
            variant: "destructive",
          });
          return;
        }
        
        setBusinessExists(true);
        
        // Then check patient status if user is logged in
        if (user) {
          console.log("Checking patient status for user:", user.id);
          const patientExists = await checkPatientExists(user.id);
          console.log("Patient exists:", patientExists);
          
          setIsPatient(patientExists);
          
          if (patientExists) {
            setActiveTab('appointment');
          }
        }
      } catch (error) {
        console.error("Error checking business or patient status:", error);
        toast({
          title: "Error",
          description: "Could not verify clinic information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Small delay to ensure auth is fully loaded
    const timer = setTimeout(() => {
      checkBusinessAndPatientStatus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, toast, businessId, businessIdFromQuery, finalBusinessId]);
  
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
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading your information...</p>
        </div>
      </div>
    );
  }
  
  if (!finalBusinessId || !businessExists) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Healthcare Provider Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The selected healthcare provider does not exist or is not available for booking.
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
      
      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30 pb-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'appointment')}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="profile" disabled={!isPatient && activeTab === 'profile'}>
                Patient Information
              </TabsTrigger>
              <TabsTrigger value="appointment" disabled={!isPatient}>
                Appointment Details
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="pt-6">
          <TabsContent value="profile">
            {user && (
              <PatientForm 
                userId={user.id}
                onSuccess={handlePatientFormSuccess}
                onCancel={() => navigate('/customer/dashboard')}
              />
            )}
          </TabsContent>
          
          <TabsContent value="appointment">
            <PatientAppointmentBooking 
              businessId={finalBusinessId}
              onSuccess={handleAppointmentSuccess}
              onCancel={() => navigate('/customer/dashboard')}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointmentPage;
