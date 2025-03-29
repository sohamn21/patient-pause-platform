
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from '@/components/ui/blur-card';

const AdminRoleUpdater = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const updateToAdminRole = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating role:', error);
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Refresh profile data to get the updated role
      await refreshProfile();
      
      toast({
        title: "Role Updated",
        description: "Your account has been updated to admin role. Please sign out and sign back in for changes to take effect.",
      });
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlurCard>
      <BlurCardHeader>
        <BlurCardTitle>Admin Role Updater</BlurCardTitle>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Current role: <span className="font-medium">{profile?.role || 'unknown'}</span></p>
            <p>User ID: <span className="font-mono text-xs">{user?.id || 'Not logged in'}</span></p>
          </div>
          
          <Button 
            onClick={updateToAdminRole} 
            disabled={isLoading || profile?.role === 'admin'}
            className="w-full"
          >
            {isLoading ? "Updating..." : profile?.role === 'admin' ? "Already Admin" : "Update to Admin Role"}
          </Button>
          
          {profile?.role === 'admin' && (
            <p className="text-sm text-muted-foreground">
              You already have admin privileges. Visit the <a href="/admin" className="text-primary hover:underline">Admin Dashboard</a>.
            </p>
          )}
        </div>
      </BlurCardContent>
    </BlurCard>
  );
};

export default AdminRoleUpdater;
