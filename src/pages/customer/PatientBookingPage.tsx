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
import { Loader2, AlertCircle } from 'lucide-react';

// Default practitioners and services to use when none are found
const defaultPractitioners: Practitioner[] = [
  {
    id: 'default-practitioner-1',
    business_id: '',
    name: 'Dr. Jane Smith',
    specialization: 'General Practitioner',
    bio: 'Experienced doctor with over 10 years of practice.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    availability: null
  },
  {
    id: 'default-practitioner-2',
    business_id: '',
    name: 'Dr. John Doe',
    specialization: 'Family Medicine',
    bio: 'Specializes in family healthcare and preventive medicine.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    availability: null
  }
];

const defaultServices: Service[] = [
  {
    id: 'default-service-1',
    business_id: '',
    name: 'General Consultation',
    description: 'Standard medical consultation for general health concerns.',
    duration: 30,
    price: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'default-service-2',
    business_id: '',
    name: 'Extended Consultation',
    description: 'Comprehensive medical consultation for complex issues.',
    duration: 60,
    price: 125,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

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
  const [useDefaultData, setUseDefaultData] = useState(false);
  
  useEffect(() => {
    const loadBusinessData = async () => {
      if (businessId) {
        console.log("Business ID received:", businessId);
        setBusinessIdVerified(businessId);

        try {
          // Fetch practitioners and services data
          console.log("Fetching practitioners and services for business ID:", businessId);
          
          // Make API calls to fetch practitioners and services
          const practitionersData = await getPractitioners(businessId);
          console.log("Practitioners data received:", practitionersData);
          
          const servicesData = await getServices(businessId);
          console.log("Services data received:", servicesData);
          
          // Ensure we have arrays, not null or undefined
          const practitionerArray = Array.isArray(practitionersData) ? practitionersData : [];
          const servicesArray = Array.isArray(servicesData) ? servicesData : [];
          
          // Debug info for troubleshooting
          const debugMessage = `Found ${practitionerArray.length} practitioners and ${servicesArray.length} services for business ID: ${businessId}`;
          setDebugInfo(debugMessage);
          
          // Only use default data if both practitioners and services are empty
          if (practitionerArray.length === 0 && servicesArray.length === 0) {
            console.log("No practitioners or services found, using default data");
            setUseDefaultData(true);
            
            // Assign the business ID to the default data
            const defaultPractitionersWithBusinessId = defaultPractitioners.map(practitioner => ({
              ...practitioner,
              business_id: businessId
            }));
            
            const defaultServicesWithBusinessId = defaultServices.map(service => ({
              ...service,
              business_id: businessId
            }));
            
            setPractitioners(defaultPractitionersWithBusinessId);
            setServices(defaultServicesWithBusinessId);
            
            toast({
              title: "Using Demo Data",
              description: "This clinic has not set up practitioners or services. Using demo data for booking.",
            });
          } else {
            // Use the actual data from the database
            console.log(`Using real data: ${practitionerArray.length} practitioners and ${servicesArray.length} services`);
            setPractitioners(practitionerArray);
            setServices(servicesArray);
            setHasDataError(false);
            setUseDefaultData(false);
            
            // If only one of practitioners or services is missing, show warning
            if (practitionerArray.length === 0 || servicesArray.length === 0) {
              console.log("Warning: Limited practitioners or services found");
              toast({
                title: "Limited Availability",
                description: "This clinic may have limited booking options available.",
              });
            }
          }
        } catch (error) {
          console.error("Error loading clinic data:", error);
          setHasDataError(true);
          setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Use default data if there was an error fetching real data
          console.log("Error loading clinic data, using default data");
          setUseDefaultData(true);
          
          // Assign the business ID to the default data
          const defaultPractitionersWithBusinessId = defaultPractitioners.map(practitioner => ({
            ...practitioner,
            business_id: businessId
          }));
          
          const defaultServicesWithBusinessId = defaultServices.map(service => ({
            ...service,
            business_id: businessId
          }));
          
          setPractitioners(defaultPractitionersWithBusinessId);
          setServices(defaultServicesWithBusinessId);
          
          toast({
            title: "Using Demo Data",
            description: "Unable to load clinic data. Using demo data for booking instead.",
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
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
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
  
  // Debug output to check data
  console.log("Rendering with practitioners:", practitioners.length, "and services:", services.length);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment with your preferred healthcare provider
          {!user && " - No account needed to book"}
          {useDefaultData && " (Demo Mode)"}
        </p>
        {debugInfo && (
          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{debugInfo}</span>
          </div>
        )}
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
