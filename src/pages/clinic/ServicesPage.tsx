import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getServices, createService, updateService, deleteService } from '@/lib/clinicService';
import { Service, ServiceFormData } from '@/types/clinic';
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
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  Clock, 
  DollarSign, 
  Save, 
  X 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  price: z.coerce.number().min(0, "Price cannot be negative").optional(),
});

const ServicesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      price: undefined,
    },
  });
  
  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const servicesData = await getServices(user.id);
        
        // Map data to ensure it conforms to the Service type
        const mappedServices = Array.isArray(servicesData) 
          ? servicesData.map(item => ({
              id: item.id || '',
              business_id: item.business_id || '',
              name: item.name || '',
              description: item.description || null,
              duration: typeof item.duration === 'number' ? item.duration : 30,
              price: typeof item.price === 'number' ? item.price : null,
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
            } as Service))
          : [];
        
        setServices(mappedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [user, toast]);
  
  useEffect(() => {
    // Reset form when editing service changes
    if (editingService) {
      form.reset({
        name: editingService.name,
        description: editingService.description || '',
        duration: editingService.duration,
        price: editingService.price || undefined,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        duration: 30,
        price: undefined,
      });
    }
  }, [editingService, form]);
  
  const handleAddService = () => {
    setEditingService(null);
    setIsAddingService(true);
  };
  
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsAddingService(true);
  };
  
  const confirmDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    const success = await deleteService(serviceToDelete.id);
    if (success) {
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      toast({
        title: "Service Deleted",
        description: `${serviceToDelete.name} has been successfully deleted.`,
      });
    }
    
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };
  
  const onSubmit = async (data: ServiceFormData) => {
    if (!user) return;
    
    try {
      if (editingService) {
        // Update existing service
        const updated = await updateService(editingService.id, data);
        if (updated) {
          setServices(services.map(s => s.id === editingService.id ? updated : s));
          toast({
            title: "Service Updated",
            description: `${updated.name} has been successfully updated.`,
          });
        }
      } else {
        // Create new service
        const created = await createService(data, user.id);
        if (created) {
          setServices([...services, created]);
          toast({
            title: "Service Created",
            description: `${created.name} has been successfully added.`,
          });
        }
      }
      
      setIsAddingService(false);
      setEditingService(null);
      form.reset();
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the service.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the services your clinic offers
          </p>
        </div>
        <Button onClick={handleAddService}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>
      
      {isAddingService && (
        <Card>
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
            <CardDescription>
              {editingService 
                ? 'Update the details of this service' 
                : 'Define a new service your clinic provides'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Initial Consultation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Description of what this service includes" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description to help patients understand what this service includes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input type="number" {...field} />
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          How long this service typically takes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field} 
                              value={field.value === undefined ? '' : field.value}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                            />
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Optional - leave blank if price varies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsAddingService(false);
                      setEditingService(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Service
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>
            All services currently offered by your clinic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading services...</div>
          ) : services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>
                      {service.price ? `$${service.price.toFixed(2)}` : 'Varies'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {service.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmDeleteService(service)}
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
              <h3 className="text-lg font-medium mb-2">No Services Defined</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any services yet. Get started by adding your first service.
              </p>
              <Button onClick={handleAddService}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{serviceToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
