import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getPractitioners, 
  createPractitioner, 
  updatePractitioner,
  deletePractitioner 
} from '@/lib/clinicService';
import { Practitioner, PractitionerFormData } from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  PlusCircle, 
  Edit, 
  Trash, 
  User, 
  Clock, 
  X 
} from 'lucide-react';
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
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

const PractitionersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [practitionerToDelete, setPractitionerToDelete] = useState<Practitioner | null>(null);
  
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
  
  useEffect(() => {
    const fetchPractitioners = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const practitionersData = await getPractitioners(user.id);
        
        // Map data to ensure it conforms to the Practitioner type
        const mappedPractitioners = Array.isArray(practitionersData) 
          ? practitionersData.map(item => ({
              id: item.id || '',
              business_id: item.business_id || '',
              name: item.name || '',
              specialization: item.specialization || null,
              bio: item.bio || null,
              availability: item.availability || null,
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
            })) as Practitioner[]
          : [];
        
        setPractitioners(mappedPractitioners);
      } catch (error) {
        console.error("Error fetching practitioners:", error);
        toast({
          title: "Error",
          description: "Failed to load practitioners",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPractitioners();
  }, [user, toast]);
  
  useEffect(() => {
    // Set form values when editing
    if (editingPractitioner) {
      // Initialize form with default availability structure
      const defaultAvailability = DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = { isAvailable: false, start: '09:00', end: '17:00' };
        return acc;
      }, {} as Record<string, { isAvailable: boolean; start: string; end: string }>);
      
      // Merge with existing practitioner availability if any
      const availability = {
        ...defaultAvailability,
        ...(editingPractitioner.availability || {})
      };
      
      form.reset({
        name: editingPractitioner.name,
        specialization: editingPractitioner.specialization || '',
        bio: editingPractitioner.bio || '',
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
  }, [editingPractitioner, form]);
  
  const openNewPractitionerDialog = () => {
    setEditingPractitioner(null);
    setIsDialogOpen(true);
  };
  
  const openEditPractitionerDialog = (practitioner: Practitioner) => {
    setEditingPractitioner(practitioner);
    setIsDialogOpen(true);
  };
  
  const confirmDeletePractitioner = (practitioner: Practitioner) => {
    setPractitionerToDelete(practitioner);
    setDeleteDialogOpen(true);
  };
  
  const handleDeletePractitioner = async () => {
    if (!practitionerToDelete) return;
    
    const success = await deletePractitioner(practitionerToDelete.id);
    if (success) {
      setPractitioners(practitioners.filter(p => p.id !== practitionerToDelete.id));
      toast({
        title: "Practitioner Deleted",
        description: `${practitionerToDelete.name} has been removed.`,
      });
    }
    
    setDeleteDialogOpen(false);
    setPractitionerToDelete(null);
  };
  
  const onSubmit = async (data: PractitionerFormData) => {
    if (!user) return;
    
    try {
      // Filter out days where isAvailable is false
      const filteredAvailability = Object.fromEntries(
        Object.entries(data.availability || {})
          .filter(([_, value]) => value.isAvailable)
      );
      
      const formData = {
        ...data,
        availability: Object.keys(filteredAvailability).length > 0 
          ? filteredAvailability 
          : null,
      };
      
      if (editingPractitioner) {
        // Update existing practitioner
        const updated = await updatePractitioner(editingPractitioner.id, formData);
        if (updated) {
          setPractitioners(practitioners.map(p => p.id === editingPractitioner.id ? updated : p));
          toast({
            title: "Practitioner Updated",
            description: `${updated.name}'s information has been updated.`,
          });
        }
      } else {
        // Create new practitioner
        const created = await createPractitioner(formData, user.id);
        if (created) {
          setPractitioners([...practitioners, created]);
          toast({
            title: "Practitioner Added",
            description: `${created.name} has been added successfully.`,
          });
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving practitioner:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the practitioner.",
        variant: "destructive",
      });
    }
  };
  
  const renderAvailabilityBadges = (practitioner: Practitioner) => {
    if (!practitioner.availability) return <span className="text-muted-foreground">No availability set</span>;
    
    return (
      <div className="flex flex-wrap gap-1">
        {Object.keys(practitioner.availability).map(day => (
          <Badge key={day} variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {day.substring(0, 3)}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Healthcare Providers</h1>
          <p className="text-muted-foreground">
            Manage your clinic's practitioners and their availability
          </p>
        </div>
        <Button onClick={openNewPractitionerDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Practitioner
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
          <CardDescription>
            View and manage all practitioners at your clinic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading practitioners...</div>
          ) : practitioners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {practitioners.map((practitioner) => (
                  <TableRow key={practitioner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(practitioner.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{practitioner.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{practitioner.specialization || 'General'}</TableCell>
                    <TableCell>{renderAvailabilityBadges(practitioner)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditPractitionerDialog(practitioner)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmDeletePractitioner(practitioner)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <User className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Practitioners Added</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any practitioners to your clinic yet.
              </p>
              <Button onClick={openNewPractitionerDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Practitioner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPractitioner ? `Edit ${editingPractitioner.name}` : 'Add New Practitioner'}
            </DialogTitle>
            <DialogDescription>
              {editingPractitioner 
                ? "Update the practitioner's details and availability"
                : "Add details about the new practitioner"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPractitioner ? 'Update Practitioner' : 'Add Practitioner'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Practitioner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {practitionerToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePractitioner}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PractitionersPage;
