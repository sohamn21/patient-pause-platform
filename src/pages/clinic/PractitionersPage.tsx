
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
import { useToast } from '@/hooks/use-toast';
import { Dialog } from '@/components/ui/dialog';
import { PlusCircle, User } from 'lucide-react';
import { mapToPractitioner } from '@/lib/dataMappers';
import PractitionerList from '@/components/clinic/PractitionerList';
import NoDataPlaceholder from '@/components/clinic/NoDataPlaceholder';
import DeleteConfirmationDialog from '@/components/clinic/DeleteConfirmationDialog';
import PractitionerForm from '@/components/clinic/PractitionerForm';

const PractitionersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [practitionerToDelete, setPractitionerToDelete] = useState<Practitioner | null>(null);
  
  useEffect(() => {
    const fetchPractitioners = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const practitionersData = await getPractitioners(user.id);
        
        // Ensure we're working with an array
        if (!Array.isArray(practitionersData)) {
          console.warn("Practitioners data is not an array:", practitionersData);
          setPractitioners([]);
          return;
        }
        
        // Transform each item using the mapper utility
        const mappedPractitioners = practitionersData.map(item => mapToPractitioner(item));
        
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
  
  const handleFormSubmit = async (data: PractitionerFormData) => {
    if (!user) return;
    
    try {
      if (editingPractitioner) {
        // Update existing practitioner
        const updated = await updatePractitioner(editingPractitioner.id, data);
        if (updated) {
          // Create a new array with the updated practitioner
          const updatedPractitioners = practitioners.map(p => 
            p.id === editingPractitioner.id ? updated : p
          );
          setPractitioners(updatedPractitioners);
          toast({
            title: "Practitioner Updated",
            description: `${updated.name}'s information has been updated.`,
          });
        }
      } else {
        // Create new practitioner
        const businessId = user.id;
        const created = await createPractitioner(data, businessId);
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
            <PractitionerList 
              practitioners={practitioners}
              onEdit={openEditPractitionerDialog}
              onDelete={confirmDeletePractitioner}
            />
          ) : (
            <NoDataPlaceholder 
              icon={User}
              title="No Practitioners Added"
              description="You haven't added any practitioners to your clinic yet."
              buttonText="Add First Practitioner"
              onAction={openNewPractitionerDialog}
            />
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <PractitionerForm
          practitioner={editingPractitioner}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
      
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeletePractitioner}
        title="Delete Practitioner"
        description={`Are you sure you want to delete ${practitionerToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default PractitionersPage;
