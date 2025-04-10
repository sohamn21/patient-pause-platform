
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Patient, PatientFormData, Practitioner } from '@/types/clinic';
import { updatePatient, createPatientProfile, getPractitioners } from '@/lib/clinicService';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PatientFormProps {
  patient?: Patient;
  userId?: string;
  onSuccess: (data?: PatientFormData) => void;
  onCancel: () => void;
}

const patientFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().optional(),
  date_of_birth: z.date().optional(),
  medical_history: z.string().optional(),
  allergies: z.string().optional(),
  emergency_contact: z.string().optional(),
  preferred_practitioner_id: z.string().optional(),
  notes: z.string().optional(),
});

export const PatientForm = ({ patient, userId, onSuccess, onCancel }: PatientFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: patient?.profile?.first_name || '',
      last_name: patient?.profile?.last_name || '',
      phone_number: patient?.profile?.phone_number || '',
      date_of_birth: patient?.date_of_birth ? new Date(patient.date_of_birth) : undefined,
      medical_history: patient?.medical_history || '',
      allergies: patient?.allergies || '',
      emergency_contact: patient?.emergency_contact || '',
      preferred_practitioner_id: patient?.preferred_practitioner_id || '',
      notes: patient?.notes || '',
    },
  });

  useEffect(() => {
    const loadPractitioners = async () => {
      if (!user) return;
      
      try {
        console.log("Loading practitioners for business:", user.id);
        const data = await getPractitioners(user.id);
        console.log("Practitioners loaded:", data);
        setPractitioners(data as Practitioner[]);
      } catch (error) {
        console.error("Error loading practitioners:", error);
        toast({
          title: "Error",
          description: "Could not load practitioners list",
          variant: "destructive",
        });
      }
    };
    
    loadPractitioners();
  }, [user, toast]);
  
  const onSubmit = async (formData: PatientFormData) => {
    setIsLoading(true);
    console.log("Form submitted with data:", formData);
    
    try {
      let success = false;
      
      if (patient) {
        console.log("Updating existing patient:", patient.id);
        success = await updatePatient(patient.id, formData);
      } else {
        // Use the userId prop if provided, otherwise generate a new random UUID
        const targetUserId = userId || (user?.id as string);
        console.log("Creating new patient with business ID:", targetUserId);
        
        if (!targetUserId) {
          throw new Error("No user ID available for creating patient");
        }
        
        success = await createPatientProfile(targetUserId, formData);
      }
      
      if (success) {
        console.log("Patient saved successfully");
        toast({
          title: patient ? "Patient Updated" : "Patient Created",
          description: patient ? "Patient information has been updated" : "New patient has been added",
        });
        onSuccess(formData);
      } else {
        console.error("Failed to save patient");
        toast({
          title: "Error",
          description: "Failed to save patient information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Used for appointment reminders
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
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
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Patient's date of birth
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List any allergies or sensitivities" 
                  rows={3}
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="medical_history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical History</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Relevant medical history" 
                  rows={3}
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergency_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Name and phone number" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Who to contact in case of emergency
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preferred_practitioner_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Practitioner</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a practitioner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No preference</SelectItem>
                    {practitioners.map((practitioner) => (
                      <SelectItem key={practitioner.id} value={practitioner.id}>
                        {practitioner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Patient's preferred healthcare provider
                </FormDescription>
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
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any other relevant information" 
                  rows={3}
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : patient ? 'Update Patient' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
