
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  createAppointment,
} from '@/lib/clinicService';
import { Practitioner, Service, AppointmentFormData } from '@/types/clinic';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Card, CardContent } from '@/components/ui/card';

const appointmentFormSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  practitioner_id: z.string().min(1, "Please select a practitioner"),
  date: z.date(),
  start_time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  guest_name: z.string().min(1, "Please enter your name").optional().or(z.literal('')),
  guest_email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  guest_phone: z.string().optional().or(z.literal('')),
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

interface PatientAppointmentBookingProps {
  businessId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  practitioners?: Practitioner[];
  services?: Service[];
}

const PatientAppointmentBooking = ({ 
  businessId, 
  onSuccess, 
  onCancel,
  practitioners: initialPractitioners = [],
  services: initialServices = [] 
}: PatientAppointmentBookingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [practitioners, setPractitioners] = useState<Practitioner[]>(initialPractitioners);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeStep, setActiveStep] = useState<'service' | 'practitioner' | 'schedule' | 'contact'>('service');

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      service_id: '',
      practitioner_id: '',
      date: new Date(),
      start_time: '09:00',
      notes: '',
      guest_name: '',
      guest_email: '',
      guest_phone: '',
    },
  });
  
  useEffect(() => {
    const serviceId = form.watch('service_id');
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [form.watch('service_id'), services]);
  
  const onSubmitAppointment = async (formData: AppointmentFormData) => {
    setIsLoading(true);
    try {
      // Always require guest information if user isn't logged in
      if (!user && (!formData.guest_name || !formData.guest_email)) {
        toast({
          title: "Missing Information",
          description: "Please provide your name and email to book an appointment",
          variant: "destructive",
        });
        setIsLoading(false);
        setActiveStep('contact');
        return;
      }

      const appointment = await createAppointment(
        {
          ...formData,
          patient_id: user?.id,
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
  
  const nextStep = () => {
    if (activeStep === 'service') {
      if (!form.getValues('service_id')) {
        form.setError('service_id', { message: 'Please select a service' });
        return;
      }
      setActiveStep('practitioner');
    } else if (activeStep === 'practitioner') {
      if (!form.getValues('practitioner_id')) {
        form.setError('practitioner_id', { message: 'Please select a practitioner' });
        return;
      }
      setActiveStep('schedule');
    } else if (activeStep === 'schedule') {
      if (!user) {
        setActiveStep('contact');
      } else {
        form.handleSubmit(onSubmitAppointment)();
      }
    }
  };
  
  const prevStep = () => {
    if (activeStep === 'practitioner') {
      setActiveStep('service');
    } else if (activeStep === 'schedule') {
      setActiveStep('practitioner');
    } else if (activeStep === 'contact') {
      setActiveStep('schedule');
    }
  };
  
  if (isLoading && !services.length && !practitioners.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading clinic information...</p>
        </div>
      </div>
    );
  }
  
  if (loadError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-muted-foreground">{loadError}</p>
            <Button variant="secondary" onClick={onCancel || (() => navigate('/'))}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (services.length === 0 || practitioners.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-muted-foreground">
              {services.length === 0 && practitioners.length === 0 
                ? "No services or practitioners available."
                : services.length === 0 
                ? "No services have been set up for this clinic." 
                : "No practitioners are available at this clinic."}
            </p>
            <Button variant="secondary" onClick={onCancel || (() => navigate('/'))}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAppointment)} className="space-y-6">
        {activeStep === 'service' && (
          <div className="space-y-4">
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
                      {services.length === 0 ? (
                        <SelectItem value="no-services" disabled>No services available</SelectItem>
                      ) : (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({service.duration} min)
                            {service.price ? ` - $${service.price}` : ''}
                          </SelectItem>
                        ))
                      )}
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
          </div>
        )}
        
        {activeStep === 'practitioner' && (
          <div className="space-y-4">
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
                      {practitioners.length === 0 ? (
                        <SelectItem value="no-practitioners" disabled>No practitioners available</SelectItem>
                      ) : (
                        practitioners.map((practitioner) => (
                          <SelectItem key={practitioner.id} value={practitioner.id}>
                            {practitioner.name}
                          </SelectItem>
                        ))
                      )}
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
          </div>
        )}
        
        {activeStep === 'schedule' && (
          <div className="space-y-4">
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
          </div>
        )}
        
        {activeStep === 'contact' && (
          <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
            <h3 className="font-medium">Your Contact Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="guest_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guest_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guest_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              <p>Your contact information is used only to confirm your appointment.</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between space-x-2 pt-4">
          <div>
            {activeStep !== 'service' && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {activeStep !== 'contact' ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PatientAppointmentBooking;
