
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Patient, PatientFormData, Practitioner } from '@/types/clinic';
import { updatePatient, createPatientProfile, getPractitioners } from '@/lib/clinicService';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

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
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PatientFormProps {
  patient?: Patient;
  userId: string;
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
  const { profile } = useAuth();
  const { toast } = useToast();
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: patient?.profile?.first_name || profile?.first_name || '',
      last_name: patient?.profile?.last_name || profile?.last_name || '',
      phone_number: patient?.profile?.phone_number || profile?.phone_number || '',
      date_of_birth: patient?.date_of_birth ? new Date(patient.date_of_birth) : undefined,
      medical_history: patient?.medical_history || '',
      allergies: patient?.allergies || '',
      emergency_contact: patient?.emergency_contact || '',
      preferred_practitioner_id: patient?.preferred_practitioner_id || '',
      notes: patient?.notes || '',
    },
  });

  useEffect(() => {
    // Update form values if profile data becomes available
    if (profile && !form.getValues('first_name') && !form.getValues('last_name')) {
      form.setValue('first_name', profile.first_name || '');
      form.setValue('last_name', profile.last_name || '');
      form.setValue('phone_number', profile.phone_number || '');
    }
  }, [profile, form]);

  useEffect(() => {
    const loadPractitioners = async () => {
      if (!userId) return;
      
      try {
        const data = await getPractitioners(userId);
        setPractitioners(data);
      } catch (error) {
        console.error("Error loading practitioners:", error);
        // Don't show an error toast here - non-critical failure
      }
    };
    
    loadPractitioners();
  }, [userId, toast]);
  
  const onSubmit = async (formData: PatientFormData) => {
    setError(null);
    setIsLoading(true);
    
    if (!userId) {
      setError("User ID is missing. Please sign in again.");
      setIsLoading(false);
      return;
    }
    
    try {
      let success;
      
      if (patient) {
        success = await updatePatient(patient.id, formData);
      } else {
        success = await createPatientProfile(userId, formData);
      }
      
      if (success) {
        toast({
          title: patient ? "Profile Updated" : "Profile Created",
          description: patient ? "Your information has been updated" : "Your health profile has been created",
        });
        onSuccess(formData);
      } else {
        setError("Failed to save your information. Please try again.");
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  rows={2}
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
                  rows={2}
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  placeholder="Any other information your healthcare provider should know" 
                  rows={2}
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {patient ? 'Updating...' : 'Create Profile'}
              </>
            ) : (
              patient ? 'Update Profile' : 'Create Profile'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
