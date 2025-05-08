import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getBusinessById, getPractitioners, getServices } from '@/lib/clinicService';
import PatientAppointmentBooking from '@/components/clinic/PatientAppointmentBooking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Practitioner, Service } from '@/types/clinic';

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
  
  useEffect(() => {
    console.log("BookAppointmentPage - businessId from path:", businessId);
    console.log("BookAppointmentPage - businessId from query:", businessIdFromQuery);
    console.log("BookAppointmentPage - final businessId:", finalBusinessId);
    
    const checkBusinessStatus = async () => {
      if (!finalBusinessId) {
        setIsLoading(false);
        setDataError("No business ID provided");
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
          const practitionersData = await getPractitioners(finalBusinessId);
          const servicesData = await getServices(finalBusinessId);
          
          console.log("Practitioners data loaded:", practitionersData);
          console.log("Services data loaded:", servicesData);
          
          // Always ensure we have arrays, not null or undefined
          const practitionerArray = Array.isArray(practitionersData) ? practitionersData : [];
          const servicesArray = Array.isArray(servicesData) ? servicesData : [];
          
          // Only use default data if both practitioners and services are empty
          if (practitionerArray.length === 0 && servicesArray.length === 0) {
            console.log("Warning: No practitioners or services found, using default data");
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
              description: "This clinic is using demo data for booking. Please set up practitioners and services in the admin panel.",
            });
          } else {
            console.log(`Found real data: ${practitionerArray.length} practitioners and ${servicesArray.length} services`);
            
            // Transform each practitioner to ensure it matches the Practitioner type
            const mappedPractitioners = practitionerArray.map(item => {
              // Create a properly typed practitioner object with all required fields
              const practitioner: Practitioner = {
                id: item.id || '',
                business_id: item.business_id || '',
                name: item.name || '',
                specialization: item.specialization as string | null || null,
                bio: item.bio as string | null || null,
                availability: item.availability as any || null,
                created_at: item.created_at || new Date().toISOString(),
                updated_at: item.updated_at as string || new Date().toISOString(),
              };
              
              return practitioner;
            });
            
            // Transform each service to ensure it matches the Service type
            const mappedServices = servicesArray.map(item => {
              // Initialize with all required fields that must exist
              const service: Service = {
                id: item.id || '',
                business_id: item.business_id || '',
                name: item.name || '',
                description: item.description as string | null || null,
                duration: typeof item.duration === 'number' ? item.duration : 30,
                price: typeof item.price === 'number' ? item.price : null,
                created_at: item.created_at || new Date().toISOString(),
                updated_at: item.updated_at as string || new Date().toISOString(),
              };
              
              return service;
            });
            
            setPractitioners(mappedPractitioners);
            setServices(mappedServices);
            setUseDefaultData(false);
            
            // If only one of practitioners or services is missing, show warning
            if (mappedPractitioners.length === 0 || mappedServices.length === 0) {
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
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  // Debug output to check data
  console.log("Rendering with practitioners:", practitioners.length, "and services:", services.length);
  
  // With our default data implementation, we should now always have something to show
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
      </div>
      
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
            businessId={finalBusinessId}
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
