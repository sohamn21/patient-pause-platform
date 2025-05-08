
import React from 'react';
import { Practitioner, PractitionerFormData } from '@/types/clinic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AvailabilitySection from './AvailabilitySection';

// Constants for the component
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const practitionerFormSchema = z.object({
  name: z.string().min(1, "Practitioner name is required"),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  availability: z.record(z.string(), z.object({
    isAvailable: z.boolean().default(false),
    start: z.string().optional(),
    end: z.string().optional(),
  })).optional(),
});

interface PractitionerFormProps {
  practitioner?: Practitioner | null;
  onSubmit: (data: PractitionerFormData) => Promise<void>;
  onCancel: () => void;
}

const PractitionerForm = ({ practitioner, onSubmit, onCancel }: PractitionerFormProps) => {
  const form = useForm<PractitionerFormData>({
    resolver: zodResolver(practitionerFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      bio: '',
      availability: DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = { isAvailable: false, start: '09:00', end: '17:00' };
        return acc;
      }, {} as Record<string, { isAvailable: boolean; start: string; end: string }>),
    },
  });
  
  // Initialize form with practitioner data when editing
  React.useEffect(() => {
    if (practitioner) {
      // Initialize form with default availability structure
      const defaultAvailability = DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = { isAvailable: false, start: '09:00', end: '17:00' };
        return acc;
      }, {} as Record<string, { isAvailable: boolean; start: string; end: string }>);
      
      // Merge with existing practitioner availability if any
      let availability: Record<string, { isAvailable: boolean; start: string; end: string }> = { ...defaultAvailability };
      
      // If practitioner has availability as a string (JSON), parse it
      if (practitioner.availability && typeof practitioner.availability === 'string') {
        try {
          const parsedAvailability = JSON.parse(practitioner.availability);
          // Merge the parsed availability with defaults
          Object.keys(parsedAvailability).forEach(day => {
            if (defaultAvailability[day]) {
              availability[day] = {
                ...defaultAvailability[day],
                ...parsedAvailability[day]
              };
            }
          });
        } catch (error) {
          console.error("Error parsing practitioner availability:", error);
        }
      } else if (practitioner.availability && typeof practitioner.availability === 'object') {
        // If it's already an object, merge with defaults
        const availabilityObj = practitioner.availability as unknown as Record<string, { isAvailable: boolean; start: string; end: string }>;
        Object.keys(availabilityObj).forEach(day => {
          if (defaultAvailability[day]) {
            availability[day] = {
              ...defaultAvailability[day],
              ...(availabilityObj[day] || {})
            };
          }
        });
      }
      
      form.reset({
        name: practitioner.name,
        specialization: practitioner.specialization || '',
        bio: practitioner.bio || '',
        availability,
      });
    } else {
      // Reset form to defaults for new practitioner
      form.reset({
        name: '',
        specialization: '',
        bio: '',
        availability: DAYS_OF_WEEK.reduce((acc, day) => {
          acc[day] = { isAvailable: false, start: '09:00', end: '17:00' };
          return acc;
        }, {} as Record<string, { isAvailable: boolean; start: string; end: string }>),
      });
    }
  }, [practitioner, form]);
  
  const handleSubmit = async (data: PractitionerFormData) => {
    try {
      // Filter out days where isAvailable is false
      const filteredAvailability: Record<string, { isAvailable: boolean; start: string; end: string }> = {};
      
      // Only include days that are marked as available
      if (data.availability) {
        Object.entries(data.availability).forEach(([day, value]) => {
          if (value && value.isAvailable) {
            filteredAvailability[day] = {
              isAvailable: true,
              start: value.start || "09:00",
              end: value.end || "17:00"
            };
          }
        });
      }
      
      // Create a new data object with the filtered availability
      const formData: PractitionerFormData = {
        name: data.name,
        specialization: data.specialization,
        bio: data.bio,
        availability: Object.keys(filteredAvailability).length > 0 
          ? filteredAvailability 
          : undefined,
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Error in form submit:", error);
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {practitioner ? `Edit ${practitioner.name}` : 'Add New Practitioner'}
        </DialogTitle>
        <DialogDescription>
          {practitioner 
            ? "Update the practitioner's details and availability"
            : "Add details about the new practitioner"}
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pediatrics, Cardiology" {...field} />
                </FormControl>
                <FormDescription>
                  Optional - leave blank for general practitioners
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of the practitioner's experience and expertise" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Patients will see this information when booking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <AvailabilitySection form={form} />
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {practitioner ? 'Update Practitioner' : 'Add Practitioner'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default PractitionerForm;
