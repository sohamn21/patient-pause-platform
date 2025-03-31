
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  getPractitioners, 
  getServices, 
  createAppointment,
  checkPatientExists,
} from '@/lib/clinicService';
import { Practitioner, Service, AppointmentFormData } from '@/types/clinic';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const appointmentFormSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  practitioner_id: z.string().min(1, "Please select a practitioner"),
  date: z.date(),
  start_time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

// Generate time slots at 30-minute intervals
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

interface PatientAppointmentBookingProps {
  businessId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PatientAppointmentBooking = ({ businessId, onSuccess, onCancel }: PatientAppointmentBookingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPatient, setIsPatient] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
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
        
        if (!patientExists) {
          toast({
            title: "Profile Required",
            description: "You need to complete your patient profile before booking an appointment.",
            variant: "destructive",
          });
          
          if (onCancel) {
            onCancel();
          } else {
            navigate('/customer/profile');
          }
          return;
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
  }, [user, businessId, toast, navigate, onCancel]);
  
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
        toast({
          title: "Appointment Booked",
          description: "Your appointment has been successfully scheduled.",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/customer/appointments');
        }
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
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
                onClick={onCancel}
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
  );
};

export default PatientAppointmentBooking;
