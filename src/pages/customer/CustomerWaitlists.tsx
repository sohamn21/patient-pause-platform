import React, { useState, useEffect } from 'react';
import { BlurCard } from "@/components/ui/blur-card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, Clock, Calendar, Store, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { getAvailableWaitlists, getUserWaitlistEntries } from '@/lib/waitlistService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const CustomerWaitlists = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableWaitlists, setAvailableWaitlists] = useState<any[]>([]);
  const [activeWaitlists, setActiveWaitlists] = useState<any[]>([]);
  const [pastWaitlists, setPastWaitlists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchWaitlists = async () => {
      setIsLoading(true);
      try {
        // Always fetch available waitlists for discovery
        const waitlistsData = await getAvailableWaitlists();
        setAvailableWaitlists(waitlistsData || []);
        
        // Only fetch user's waitlist entries if they're logged in
        if (user) {
          const userEntriesData = await getUserWaitlistEntries(user.id);
          
          // Split entries into active and past
          const active = userEntriesData.filter(entry => 
            entry.status === 'waiting' || entry.status === 'notified'
          );
          
          const past = userEntriesData.filter(entry => 
            entry.status === 'seated' || entry.status === 'cancelled'
          );
          
          setActiveWaitlists(active);
          setPastWaitlists(past);
        } else {
          setActiveWaitlists([]);
          setPastWaitlists([]);
        }
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
  }, [user, toast]);
  
  const filteredWaitlists = availableWaitlists.filter(waitlist => 
    waitlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    waitlist.profiles?.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    waitlist.profiles?.business_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleJoinWaitlist = (waitlistId: string) => {
    // Navigate to the guest form for joining waitlists
    navigate(`/join-waitlist/${waitlistId}`);
  };
  
  const handleLeaveWaitlist = async (waitlistId: string, entryId: string, businessName: string) => {
    if (!user) return;
    
    try {
      // Use the removeFromWaitlist function from waitlistService
      await import('@/lib/waitlistService').then(module => {
        return module.removeFromWaitlist(entryId);
      });
      
      // Update the state by removing the entry
      setActiveWaitlists(prev => prev.filter(entry => entry.id !== entryId));
      
      toast({
        title: "Left Waitlist",
        description: `You've been removed from ${businessName}'s waitlist.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error leaving waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to leave waitlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSwitchToDiscoverTab = () => {
    // Create a safer way to switch to the discover tab
    const tabsElement = document.querySelector('button[data-value="discover"]') as HTMLButtonElement;
    if (tabsElement) {
      tabsElement.click();
    }
  };

  const renderActiveWaitlists = () => {
    if (!user) {
      return (
        <BlurCard className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Sign In to View Your Waitlists</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to see your current waitlist status and history.
          </p>
          <Button onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        </BlurCard>
      );
    }

    if (isLoading) {
      return Array(2).fill(0).map((_, i) => (
        <BlurCard key={i}>
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </BlurCard>
      ));
    }
    
    if (activeWaitlists.length === 0) {
      return (
        <BlurCard className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No Active Waitlists</h3>
          <p className="text-muted-foreground mb-4">
            You are not currently on any waitlists.
          </p>
          <Button onClick={handleSwitchToDiscoverTab}>
            Discover Waitlists
          </Button>
        </BlurCard>
      );
    }
    
    return activeWaitlists.map(entry => (
      <BlurCard key={entry.id} className="overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{entry.waitlists?.name || 'Unnamed Waitlist'}</h3>
              <p className="text-sm text-muted-foreground">
                {entry.waitlists?.profiles?.business_name || 'Unknown Business'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              entry.status === 'notified' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
            }`}>
              {entry.status === 'notified' ? 'Ready Soon' : 'Waiting'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Position: {entry.position}</span>
            </div>
            {entry.estimated_wait_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Wait: ~{entry.estimated_wait_time} min</span>
              </div>
            )}
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => handleLeaveWaitlist(
              entry.waitlist_id, 
              entry.id, 
              entry.waitlists?.profiles?.business_name || 'this business'
            )}
          >
            Leave Waitlist
          </Button>
        </div>
      </BlurCard>
    ));
  };

  const renderAvailableWaitlists = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <BlurCard key={i}>
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </BlurCard>
      ));
    }
    
    if (filteredWaitlists.length === 0) {
      return (
        <div className="col-span-full text-center py-6">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Waitlists Found</h3>
          <p className="text-muted-foreground">
            We couldn't find any businesses matching your search.
          </p>
        </div>
      );
    }
    
    return filteredWaitlists.map(waitlist => {
      // Check if user is already in this waitlist (only if logged in)
      const alreadyJoined = user && activeWaitlists.some(entry => entry.waitlist_id === waitlist.id);
      
      return (
        <BlurCard key={waitlist.id} className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">{waitlist.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {waitlist.profiles?.business_name || 'Unknown Business'} • 
                  {waitlist.profiles?.business_type || 'Business'}
                </p>
              </div>
              {waitlist.max_capacity && (
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  Capacity: {waitlist.max_capacity}
                </div>
              )}
            </div>
            
            {waitlist.description && (
              <p className="text-sm mb-4 text-muted-foreground line-clamp-2">
                {waitlist.description}
              </p>
            )}
            
            <Button
              className="w-full"
              disabled={alreadyJoined}
              onClick={() => handleJoinWaitlist(waitlist.id)}
            >
              {alreadyJoined ? 'Already Joined' : 'Join Waitlist'}
            </Button>
          </div>
        </BlurCard>
      );
    });
  };

  const renderHistoryTab = () => {
    return (
      <BlurCard>
        <div className="divide-y divide-border">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <div className="flex items-center gap-4 mt-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))
          ) : pastWaitlists.length > 0 ? (
            pastWaitlists.map(entry => (
              <div key={entry.id} className="p-4 hover:bg-accent/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {entry.waitlists?.name || 'Unnamed Waitlist'} - 
                      {entry.waitlists?.profiles?.business_name || 'Unknown Business'}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                      {entry.estimated_wait_time && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Wait time: ~{entry.estimated_wait_time} min
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    entry.status === 'seated' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {entry.status === 'seated' ? 'Seated' : 'Cancelled'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                You don't have any past waitlist entries yet.
              </p>
            </div>
          )}
        </div>
      </BlurCard>
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Waitlists</h1>
      
      <Tabs defaultValue={user ? "active" : "discover"}>
        <TabsList className="mb-6">
          {user && <TabsTrigger value="active">My Active Waitlists</TabsTrigger>}
          <TabsTrigger value="discover">Discover Waitlists</TabsTrigger>
          {user && <TabsTrigger value="history">Waitlist History</TabsTrigger>}
        </TabsList>
        
        {user && (
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderActiveWaitlists()}
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="discover">
          <div className="mb-6">
            <Input
              placeholder="Search by business name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search size={18} className="text-muted-foreground mr-2" />}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderAvailableWaitlists()}
          </div>
        </TabsContent>
        
        {user && (
          <TabsContent value="history">
            {renderHistoryTab()}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CustomerWaitlists;
