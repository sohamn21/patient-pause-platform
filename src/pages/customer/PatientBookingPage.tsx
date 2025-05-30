
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
import { Loader2 } from 'lucide-react';
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
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clinicNotFound, setClinicNotFound] = useState(false);
  
  useEffect(() => {
    const loadBusinessData = async () => {
      if (businessId) {
        setBusinessIdVerified(businessId);

        try {
          // Fetch practitioners and services data
          const practitionersData = await getPractitioners(businessId);
          const servicesData = await getServices(businessId);
          
          // Ensure we have arrays
          const practitionerArray = Array.isArray(practitionersData) ? practitionersData : [];
          const servicesArray = Array.isArray(servicesData) ? servicesData : [];
          
          // Check if this is actually a clinic business
          if (practitionerArray.length === 0 && servicesArray.length === 0) {
            setClinicNotFound(true);
          } else {
            // Transform the data using mapper utilities
            const mappedPractitioners = practitionerArray.map(item => mapToPractitioner(item));
            const mappedServices = servicesArray.map(item => mapToService(item));
            
            setPractitioners(mappedPractitioners);
            setServices(mappedServices);
            
            if (mappedPractitioners.length === 0 || mappedServices.length === 0) {
              toast({
                title: "Limited Availability",
                description: "This clinic may have limited booking options available.",
              });
            }
          }
        } catch (error) {
          console.error("Error loading clinic data:", error);
          setClinicNotFound(true);
          toast({
            title: "Error",
            description: "Unable to load clinic information. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
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
  
  if (!businessIdVerified || clinicNotFound) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            {!businessIdVerified 
              ? "Invalid clinic information. Please scan a valid QR code or select a clinic."
              : "This business doesn't offer appointment booking services."
            }
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-center text-muted-foreground">
                {!businessIdVerified 
                  ? "Please scan a valid clinic QR code to book an appointment."
                  : "This business may be a restaurant or other type of business that doesn't offer medical appointments."
                }
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment with your preferred healthcare provider
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
