
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  getPractitioners, 
  getServices,
  getBusinessById
} from '@/lib/clinicService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';
import { Practitioner, Service } from '@/types/clinic';
import { Loader2, AlertCircle } from 'lucide-react';
import { mapToPractitioner, mapToService } from '@/lib/dataMappers';

const PatientBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('businessId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [businessIdVerified, setBusinessIdVerified] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const loadBusinessData = async () => {
      if (!businessId) {
        console.log("No businessId provided");
        setErrorMessage("No clinic selected. Please scan a valid QR code.");
        setHasError(true);
        setIsLoading(false);
        return;
      }

      console.log("Loading business data for businessId:", businessId);
      setBusinessIdVerified(businessId);
      setIsLoading(true);
      setHasError(false);

      try {
        // First verify this is a valid clinic business
        const business = await getBusinessById(businessId);
        console.log("Business data:", business);
        
        if (!business || business?.business_type !== 'clinic') {
          console.log("Business does not exist or is not a clinic");
          setErrorMessage(`Business ID ${businessId} is not a clinic or doesn't exist`);
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        setBusinessName(business.business_name || 'Healthcare Provider');

        // Fetch practitioners and services data in parallel
        console.log("Fetching practitioners and services...");
        const [practitionersData, servicesData] = await Promise.all([
          getPractitioners(businessId),
          getServices(businessId)
        ]);
        
        console.log("Raw practitioners data:", practitionersData);
        console.log("Raw services data:", servicesData);
        
        // Ensure we have arrays and map the data
        const practitionerArray = Array.isArray(practitionersData) ? practitionersData : [];
        const servicesArray = Array.isArray(servicesData) ? servicesData : [];
        
        console.log("Processed arrays - practitioners:", practitionerArray.length, "services:", servicesArray.length);
        
        // Transform the data using mapper utilities
        const mappedPractitioners = practitionerArray.map(item => mapToPractitioner(item));
        const mappedServices = servicesArray.map(item => mapToService(item));
        
        console.log("Mapped practitioners:", mappedPractitioners);
        console.log("Mapped services:", mappedServices);
        
        setPractitioners(mappedPractitioners);
        setServices(mappedServices);
        
        // Check if this clinic has any data set up
        if (mappedPractitioners.length === 0 && mappedServices.length === 0) {
          console.log("No practitioners or services found for this clinic");
          setErrorMessage(`No practitioners or services found for clinic ${businessId}`);
          setHasError(true);
        } else if (mappedPractitioners.length === 0 || mappedServices.length === 0) {
          toast({
            title: "Limited Availability",
            description: "This clinic may have limited booking options available.",
          });
        }
      } catch (error) {
        console.error("Error loading clinic data:", error);
        setErrorMessage(`Error loading clinic data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setHasError(true);
        toast({
          title: "Error",
          description: "Unable to load clinic information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBusinessData();
  }, [businessId, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading clinic information...</p>
        </div>
      </div>
    );
  }
  
  if (hasError || !businessIdVerified) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            {errorMessage || "Invalid clinic information. Please scan a valid QR code or select a clinic."}
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                {errorMessage || "Please scan a valid clinic QR code to book an appointment."}
              </p>
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
  
  // Debug information to help troubleshoot
  console.log("About to render booking component with:");
  console.log("- businessId:", businessIdVerified);
  console.log("- practitioners:", practitioners.length);
  console.log("- services:", services.length);
  console.log("- user:", user ? 'logged in' : 'guest');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment with {businessName}
          {!user && " - No account needed to book"}
        </p>
      </div>
      
      <PatientAppointmentBooking 
        businessId={businessIdVerified || ''}
        onSuccess={() => setAppointmentSuccess(true)}
        onCancel={() => navigate('/')}
        practitioners={practitioners}
        services={services}
      />
    </div>
  );
};

export default PatientBookingPage;
