
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
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
      const availability = {
        ...defaultAvailability,
        ...(practitioner.availability || {})
      };
      
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
          
          <div>
            <h3 className="text-sm font-medium mb-2">Availability</h3>
            <Accordion type="multiple" className="border rounded-md">
              {DAYS_OF_WEEK.map((day) => (
                <AccordionItem value={day} key={day}>
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-3">
                      <FormField
                        control={form.control}
                        name={`availability.${day}.isAvailable`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">
                              {day}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`availability.${day}.start`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                disabled={!form.watch(`availability.${day}.isAvailable`)}
                              >
                                {TIME_SLOTS.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`availability.${day}.end`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                disabled={!form.watch(`availability.${day}.isAvailable`)}
                              >
                                {TIME_SLOTS.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
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
