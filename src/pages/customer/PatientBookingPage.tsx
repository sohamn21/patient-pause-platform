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
  Calendar as CalendarIcon2, 
  User, 
  Stethoscope,
  CheckCircle
} from 'lucide-react';
import { PatientForm } from '@/components/clinic/PatientForm';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';

const appointmentFormSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  practitioner_id: z.string().min(1, "Please select a practitioner"),
  date: z.date(),
  start_time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const PatientBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('businessId');
  
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'patient-info' | 'appointment-details'>('patient-info');
  const [isPatient, setIsPatient] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      service_id: '',
      practitioner_id: '',
      date: new Date(),
      start_time: '09:00',
      notes: '',
    },
  });
  
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user || !businessId) return;
      
      setIsLoading(true);
      try {
        // Check if user is already a patient
        const patientExists = await checkPatientExists(user.id);
        setIsPatient(patientExists);
        
        if (patientExists) {
          setCurrentStep('appointment-details');
        }
        
        // Load practitioners and services
        const [practitionersData, servicesData] = await Promise.all([
          getPractitioners(businessId),
          getServices(businessId)
        ]);
        
        setPractitioners(practitionersData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Could not load booking information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [user, businessId, toast]);
  
  useEffect(() => {
    // Update selected service when service_id changes
    const serviceId = form.watch('service_id');
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [form.watch('service_id'), services]);
  
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
  
  const onSubmitAppointment = async (formData: AppointmentFormData) => {
    if (!user || !businessId) return;
    
    setIsLoading(true);
    try {
      // Create the appointment
      const appointment = await createAppointment(
        {
          ...formData,
          patient_id: user.id,
        },
        businessId
      );
      
      if (appointment) {
        setAppointmentSuccess(true);
        toast({
          title: "Appointment Booked",
          description: "Your appointment has been successfully scheduled.",
        });
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "Could not book your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && currentStep === 'patient-info') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
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
        <Button onClick={() => navigate('/signin')}>
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
        
        <Card>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            Select your preferred service, practitioner, and time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAppointment)} className="space-y-6">
              <Tabs defaultValue="service" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="service">Service</TabsTrigger>
                  <TabsTrigger value="practitioner">Practitioner</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="service" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="service_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Service</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} ({service.duration} min)
                                {service.price ? ` - $${service.price}` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the type of appointment you need
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedService && (
                    <div className="bg-accent/30 rounded-md p-4">
                      <h3 className="font-medium mb-2">{selectedService.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{selectedService.duration} minutes</span>
                      </div>
                      {selectedService.description && (
                        <p className="text-sm mt-2">{selectedService.description}</p>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="practitioner" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="practitioner_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Practitioner</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a practitioner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {practitioners.map((practitioner) => (
                              <SelectItem key={practitioner.id} value={practitioner.id}>
                                {practitioner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred healthcare provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {practitioners.find(p => p.id === form.watch('practitioner_id'))?.bio && (
                    <div className="bg-accent/30 rounded-md p-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium">
                            {practitioners.find(p => p.id === form.watch('practitioner_id'))?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {practitioners.find(p => p.id === form.watch('practitioner_id'))?.specialization}
                          </p>
                          <p className="text-sm mt-2">
                            {practitioners.find(p => p.id === form.watch('practitioner_id'))?.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="schedule" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Appointment Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || 
                                  date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appointment Time</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific concerns or information for your provider" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional - Include any information that might be helpful for your appointment
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/customer/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientBookingPage;
