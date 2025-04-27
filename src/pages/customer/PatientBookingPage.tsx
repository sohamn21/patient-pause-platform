
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  getPractitioners, 
  getServices
} from '@/lib/clinicService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';
import { Practitioner, Service } from '@/types/clinic';

const PatientBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('businessId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [businessIdVerified, setBusinessIdVerified] = useState<string | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [hasDataError, setHasDataError] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  
  useEffect(() => {
    const loadBusinessData = async () => {
      if (businessId) {
        console.log("Business ID received:", businessId);
        setBusinessIdVerified(businessId);

        try {
          // Fetch practitioners and services data
          console.log("Fetching practitioners and services for business ID:", businessId);
          
          // Debug: Let's check the API calls directly
          const practitionersData = await getPractitioners(businessId);
          console.log("Practitioners data received:", practitionersData);
          
          const servicesData = await getServices(businessId);
          console.log("Services data received:", servicesData);
          
          // Set state with the retrieved data
          setPractitioners(Array.isArray(practitionersData) ? practitionersData : []);
          setServices(Array.isArray(servicesData) ? servicesData : []);
          
          // Debug info for troubleshooting
          const debugMessage = `Found ${Array.isArray(practitionersData) ? practitionersData.length : 0} practitioners and ${Array.isArray(servicesData) ? servicesData.length : 0} services`;
          setDebugInfo(debugMessage);
          
          // Check if data was found - more permissive check now
          if ((!Array.isArray(practitionersData) || practitionersData.length === 0) && 
              (!Array.isArray(servicesData) || servicesData.length === 0)) {
            console.log("No practitioners or services found");
            setHasDataError(true);
            toast({
              title: "Clinic Setup Incomplete",
              description: "This clinic hasn't fully set up services or practitioners yet.",
              variant: "destructive",
            });
          } else {
            console.log("Found at least some practitioners or services");
            setHasDataError(false);
          }
        } catch (error) {
          console.error("Error loading clinic data:", error);
          setHasDataError(true);
          setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          toast({
            title: "Data Loading Error",
            description: "Could not load clinic information. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No business ID in URL parameters");
        setDebugInfo("Missing business ID");
        toast({
          title: "Missing Information",
          description: "No clinic selected. Please scan a valid QR code.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadBusinessData();
  }, [businessId, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading clinic information...</p>
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
          <p className="text-xs text-muted-foreground mt-2">{debugInfo}</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (hasDataError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clinic Not Ready</h1>
          <p className="text-muted-foreground">
            This clinic isn't fully set up yet. Please try again later or contact the clinic directly.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Debug info: {debugInfo}
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (appointmentSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Appointment Scheduled</h2>
          <p className="text-center text-muted-foreground mb-6">
            Your appointment has been successfully booked. {user ? "You'll receive a confirmation shortly." : "Please check your email for confirmation details."}
          </p>
          <div className="flex flex-col space-y-2 w-full">
            {user ? (
              <Button onClick={() => navigate('/customer/appointments')}>
                View My Appointments
              </Button>
            ) : (
              <Button onClick={() => navigate('/signin')}>
                Sign In to Manage Appointments
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/')}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment with your preferred healthcare provider
          {!user && " - No account needed to book"}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {debugInfo}
        </p>
      </div>
      
      <PatientAppointmentBooking 
        businessId={businessIdVerified}
        onSuccess={() => setAppointmentSuccess(true)}
        onCancel={() => navigate('/')}
        practitioners={practitioners}
        services={services}
      />
    </div>
  );
};

export default PatientBookingPage;
