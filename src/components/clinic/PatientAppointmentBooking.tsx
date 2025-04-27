import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  createAppointment,
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
import { Input } from '../ui/input';

const appointmentFormSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  practitioner_id: z.string().min(1, "Please select a practitioner"),
  date: z.date(),
  start_time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  guest_name: z.string().optional(),
  guest_email: z.string().email("Please enter a valid email").optional(),
  guest_phone: z.string().optional(),
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
      if (!user && (!formData.guest_email || !formData.guest_name)) {
        toast({
          title: "Missing Information",
          description: "Please provide your name and email to book an appointment",
          variant: "destructive",
        });
        setIsLoading(false);
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
        <CardHeader>
          <CardTitle>Error Loading Clinic</CardTitle>
          <CardDescription>
            We encountered a problem loading the clinic information
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        <CardHeader>
          <CardTitle>Clinic Not Ready</CardTitle>
          <CardDescription>
            This clinic isn't fully set up yet
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            {!user && (
              <div className="space-y-4 mb-6 p-4 bg-accent/30 rounded-lg">
                <h3 className="font-medium">Guest Information</h3>
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
                            required={!user}
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
                            required={!user}
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
                        <FormLabel>Phone Number (Optional)</FormLabel>
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
                  <p>Want to manage your appointments? 
                    <Button 
                      variant="link" 
                      className="px-2 h-auto" 
                      onClick={() => navigate('/signin')}
                    >
                      Sign in
                    </Button>
                  </p>
                </div>
              </div>
            )}

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
              <Button type="submit" disabled={isLoading || services.length === 0 || practitioners.length === 0}>
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
