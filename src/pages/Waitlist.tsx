import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createWaitlist, getBusinessWaitlists, updateWaitlist, deleteWaitlist } from '@/lib/waitlistService';
import { getCurrentSubscription, SubscriptionStatus } from '@/lib/subscriptionService';
import { WaitlistFeatureGate } from '@/components/waitlist/WaitlistFeatureGate';

const WaitlistPage = () => {
  const [waitlists, setWaitlists] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedWaitlist, setSelectedWaitlist] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { close } = useToast();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  
  useEffect(() => {
    const fetchWaitlists = async () => {
      try {
        setIsLoading(true);
        const data = await getBusinessWaitlists();
        setWaitlists(data || []);
      } catch (error) {
        console.error("Error fetching waitlists:", error);
        toast({
          title: "Error",
          description: "Failed to load waitlist data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWaitlists();
    
    // Add this to fetch subscription
    const fetchSubscription = async () => {
      try {
        setSubscriptionLoading(true);
        const data = await getCurrentSubscription();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);
  
  const handleCreateWaitlist = async () => {
    try {
      setIsLoading(true);
      await createWaitlist({ name, description });
      toast({
        title: "Success",
        description: "Waitlist created successfully.",
      });
      setShowCreateDialog(false);
      const data = await getBusinessWaitlists();
      setWaitlists(data || []);
      setName('');
      setDescription('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create waitlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateWaitlist = async () => {
    if (!selectedWaitlist) return;
    try {
      setIsLoading(true);
      await updateWaitlist(selectedWaitlist.id, { name, description });
      toast({
        title: "Success",
        description: "Waitlist updated successfully.",
      });
      setShowEditDialog(false);
      const data = await getBusinessWaitlists();
      setWaitlists(data || []);
      setName('');
      setDescription('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update waitlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteWaitlist = async (waitlistId: string) => {
    try {
      setIsLoading(true);
      await deleteWaitlist(waitlistId);
      toast({
        title: "Success",
        description: "Waitlist deleted successfully.",
      });
      const data = await getBusinessWaitlists();
      setWaitlists(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete waitlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist Management</h1>
          <p className="text-muted-foreground">
            Create and manage waitlists for your business.
          </p>
        </div>
        
        {/* Wrap the Create Waitlist button in WaitlistFeatureGate */}
        <WaitlistFeatureGate 
          subscription={subscription} 
          waitlistCount={waitlists.length}
        >
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Waitlist
          </Button>
        </WaitlistFeatureGate>
      </div>
      
      {/* Waitlists List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {waitlists.map((waitlist) => (
          <Card key={waitlist.id} className="hover:bg-accent/5 transition-colors">
            <CardHeader>
              <CardTitle>{waitlist.name}</CardTitle>
              <CardDescription>{waitlist.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Created At: {new Date(waitlist.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {waitlist.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedWaitlist(waitlist);
                    setName(waitlist.name);
                    setDescription(waitlist.description);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the waitlist and remove all data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteWaitlist(waitlist.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Create Waitlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Waitlist</DialogTitle>
            <DialogDescription>
              Create a new waitlist to manage customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateWaitlist}>Create Waitlist</Button>
        </DialogContent>
      </Dialog>
      
      {/* Edit Waitlist Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Waitlist</DialogTitle>
            <DialogDescription>
              Edit the selected waitlist details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleUpdateWaitlist}>Update Waitlist</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaitlistPage;
