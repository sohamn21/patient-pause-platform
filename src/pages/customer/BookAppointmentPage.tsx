
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getBusinessById, getPractitioners, getServices, createPractitioner, createService } from '@/lib/clinicService';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Practitioner, Service } from '@/types/clinic';
import { mapToPractitioner, mapToService } from '@/lib/dataMappers';

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
  const [businessExists, setBusinessExists] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [useDefaultData, setUseDefaultData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Function to seed data for development purposes
  const seedDemoData = async (businessId: string) => {
    if (!businessId) return;
    
    setIsSeeding(true);
    try {
      console.log("Seeding demo data for business ID:", businessId);
      
      // Create sample practitioners
      const pract1 = await createPractitioner({
        name: 'Dr. Jane Smith',
        specialization: 'General Practitioner',
        bio: 'Experienced doctor with over 10 years of practice.',
        availability: {
          "Monday": { isAvailable: true, start: "09:00", end: "17:00" },
          "Wednesday": { isAvailable: true, start: "09:00", end: "17:00" },
          "Friday": { isAvailable: true, start: "09:00", end: "17:00" },
        }
      }, businessId);
      
      const pract2 = await createPractitioner({
        name: 'Dr. John Doe',
        specialization: 'Family Medicine',
        bio: 'Specializes in family healthcare and preventive medicine.',
        availability: {
          "Tuesday": { isAvailable: true, start: "10:00", end: "18:00" },
          "Thursday": { isAvailable: true, start: "10:00", end: "18:00" },
        }
      }, businessId);
      
      // Create sample services
      const service1 = await createService({
        name: 'General Consultation',
        description: 'Standard medical consultation for general health concerns.',
        duration: 30,
        price: 75
      }, businessId);
      
      const service2 = await createService({
        name: 'Extended Consultation',
        description: 'Comprehensive medical consultation for complex issues.',
        duration: 60,
        price: 125
      }, businessId);
      
      // Update state with seeded data
      const seededPractitioners = [pract1, pract2].filter(Boolean) as Practitioner[];
      const seededServices = [service1, service2].filter(Boolean) as Service[];
      
      if (seededPractitioners.length > 0) {
        setPractitioners(seededPractitioners);
        console.log("Seeded practitioners:", seededPractitioners);
      }
      
      if (seededServices.length > 0) {
        setServices(seededServices);
        console.log("Seeded services:", seededServices);
      }
      
      if (seededPractitioners.length > 0 && seededServices.length > 0) {
        setUseDefaultData(false);
        setDebugInfo(`Created ${seededPractitioners.length} practitioners and ${seededServices.length} services for business ID: ${businessId}`);
        
        // Show success toast
        toast({
          title: "Demo Data Created",
          description: "Sample practitioners and services have been created for this clinic.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to seed demo data:", error);
      setDataError(`Failed to create demo data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsSeeding(false);
    }
  };
  
  useEffect(() => {
    console.log("BookAppointmentPage - businessId from path:", businessId);
    console.log("BookAppointmentPage - businessId from query:", businessIdFromQuery);
    console.log("BookAppointmentPage - final businessId:", finalBusinessId);
    
    const checkBusinessStatus = async () => {
      if (!finalBusinessId) {
        setIsLoading(false);
        setDataError("No business ID provided");
        setDebugInfo("Missing business ID parameter");
        return;
      }
      
      try {
        // Check if the business exists and is a clinic
        const business = await getBusinessById(finalBusinessId);
        console.log("Business data:", business);
        
        if (!business || business?.business_type !== 'clinic') {
          console.log("Business does not exist or is not a clinic");
          setBusinessExists(false);
          setIsLoading(false);
          setDebugInfo(`Business ID ${finalBusinessId} is not a clinic or doesn't exist`);
          toast({
            title: "Invalid Clinic",
            description: "The selected business is not a healthcare provider.",
            variant: "destructive",
          });
          return;
        }
        
        setBusinessExists(true);
        setBusinessName(business.business_name || 'Healthcare Provider');
        
        // Fetch practitioners and services for this clinic
        try {
          console.log(`Attempting to fetch practitioners and services for business ID: ${finalBusinessId}`);
          
          const practitionersData = await getPractitioners(finalBusinessId);
          const servicesData = await getServices(finalBusinessId);
          
          console.log("Practitioners data loaded:", practitionersData);
          console.log("Services data loaded:", servicesData);
          
          // Always ensure we have arrays, not null or undefined
          const practitionerArray = Array.isArray(practitionersData) ? practitionersData : [];
          const servicesArray = Array.isArray(servicesData) ? servicesData : [];
          
          setDebugInfo(`Found ${practitionerArray.length} practitioners and ${servicesArray.length} services`);
          
          // Only use default data if both practitioners and services are empty
          if (practitionerArray.length === 0 && servicesArray.length === 0) {
            console.log("Warning: No practitioners or services found, using default data");
            setUseDefaultData(true);
            setDebugInfo(`No data found in database. Using default data. Business ID: ${finalBusinessId}`);
            
            // Assign the business ID to the default data
            const defaultPractitionersWithBusinessId = defaultPractitioners.map(practitioner => ({
              ...practitioner,
              business_id: finalBusinessId
            }));
            
            const defaultServicesWithBusinessId = defaultServices.map(service => ({
              ...service,
              business_id: finalBusinessId
            }));
            
            setPractitioners(defaultPractitionersWithBusinessId);
            setServices(defaultServicesWithBusinessId);
            
            toast({
              title: "Using Demo Data",
              description: "This clinic is using demo data for booking. Please set up practitioners and services in the admin panel.",
            });
            
            // Try creating some sample data in the database, but only in development mode
            if (import.meta.env.DEV) {
              seedDemoData(finalBusinessId);
            }
          } else {
            console.log(`Found real data: ${practitionerArray.length} practitioners and ${servicesArray.length} services`);
            setPractitioners(practitionerArray);
            setServices(servicesArray);
            setUseDefaultData(false);
            
            // If only one of practitioners or services is missing, show warning
            if (practitionerArray.length === 0 || servicesArray.length === 0) {
              console.log("Warning: Limited practitioners or services found");
              toast({
                title: "Limited Booking Options",
                description: "This clinic has limited booking options available.",
              });
            }
          }
        } catch (error) {
          console.error("Error loading practitioners or services:", error);
          setDataError(`Error loading clinic data: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setDebugInfo(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Use default data if there was an error fetching real data
          console.log("Error loading clinic data, using default data");
          setUseDefaultData(true);
          
          // Assign the business ID to the default data
          const defaultPractitionersWithBusinessId = defaultPractitioners.map(practitioner => ({
            ...practitioner,
            business_id: finalBusinessId
          }));
          
          const defaultServicesWithBusinessId = defaultServices.map(service => ({
            ...service,
            business_id: finalBusinessId
          }));
          
          setPractitioners(defaultPractitionersWithBusinessId);
          setServices(defaultServicesWithBusinessId);
          
          toast({
            title: "Using Demo Data",
            description: "Unable to load clinic data. Using demo data for booking instead.",
          });
        }
      } catch (error) {
        console.error("Error checking business status:", error);
        setDataError(`Error checking business: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setDebugInfo(`Business Check Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        toast({
          title: "Error",
          description: "Could not verify clinic information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBusinessStatus();
  }, [toast, businessId, businessIdFromQuery, finalBusinessId]);
  
  // Debug logs to check state before rendering
  useEffect(() => {
    console.log("Current practitioners state:", practitioners);
    console.log("Current services state:", services);
  }, [practitioners, services]);
  
  const handleAppointmentSuccess = () => {
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been successfully scheduled",
    });
    navigate('/customer/appointments');
  };
  
  const handleSeedDemoData = async () => {
    if (!finalBusinessId) return;
    
    const success = await seedDemoData(finalBusinessId);
    
    if (success) {
      // Refresh the page to reload data
      window.location.reload();
    }
  };
  
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
  
  if (!finalBusinessId || !businessExists) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Healthcare Provider Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The selected healthcare provider does not exist or is not available for booking.
        </p>
        {dataError && (
          <p className="text-sm text-destructive mb-4">{dataError}</p>
        )}
        {debugInfo && (
          <div className="text-xs text-muted-foreground mb-4 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{debugInfo}</span>
          </div>
        )}
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  // Debug output to check data
  console.log("About to render with practitioners:", practitioners.length, "and services:", services.length);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment with {businessName}
          {useDefaultData && " (Demo Mode)"}
        </p>
        {dataError && (
          <p className="text-xs text-destructive mt-1">{dataError}</p>
        )}
        {debugInfo && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{debugInfo}</span>
          </div>
        )}
      </div>
      
      {/* Debug & Development Tools - Only visible in development */}
      {import.meta.env.DEV && useDefaultData && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Development Tools</CardTitle>
            <CardDescription className="text-yellow-700">
              These options are only available in development mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={handleSeedDemoData} 
              disabled={isSeeding}
              className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Data...
                </>
              ) : (
                'Create Real Demo Data in Database'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            Enter your information and select your preferred time
            {useDefaultData && " - Using demo practitioners and services"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <PatientAppointmentBooking 
            businessId={finalBusinessId || ''}
            onSuccess={handleAppointmentSuccess}
            onCancel={() => navigate('/')}
            practitioners={practitioners}
            services={services}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointmentPage;
