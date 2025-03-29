
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ClipboardCheck, Copy, QrCode, Settings } from 'lucide-react';
import { getWaitlistEntries, updateWaitlistEntry, removeFromWaitlist } from '@/lib/waitlistService';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistActions } from '@/components/restaurant/WaitlistActions';
import { Skeleton } from '@/components/ui/skeleton';
import { WaitlistEntryType } from '@/components/restaurant/types';
import QRCode from 'react-qr-code';

const WaitlistDetails = () => {
  const { waitlistId } = useParams<{ waitlistId: string }>();
  const [waitlist, setWaitlist] = useState<any>(null);
  const [entries, setEntries] = useState<WaitlistEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');
  const navigate = useNavigate();
  const { toast } = useToast();
  const joinUrl = `${window.location.origin}/join-waitlist/${waitlistId}`;

  useEffect(() => {
    if (!waitlistId) return;
    
    const fetchWaitlistDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch waitlist details
        const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlists')
          .select('*')
          .eq('id', waitlistId)
          .single();
        
        if (waitlistError) throw waitlistError;
        setWaitlist(waitlistData);
        
        // Fetch waitlist entries
        const entriesData = await getWaitlistEntries(waitlistId);
        setEntries(entriesData);
      } catch (error) {
        console.error("Error loading waitlist details:", error);
        toast({
          title: "Error",
          description: "Failed to load waitlist details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWaitlistDetails();
  }, [waitlistId, toast]);
  
  const handleStatusChange = async (entryId: string, status: "waiting" | "notified" | "seated" | "cancelled") => {
    try {
      await updateWaitlistEntry(entryId, { status });
      
      // Update the local state
      setEntries(prev => 
        prev.map(entry => 
          entry.id === entryId ? { ...entry, status } : entry
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Customer status changed to ${status}`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };
  
  const handleRemoveEntry = async (entryId: string) => {
    try {
      await removeFromWaitlist(entryId);
      
      // Update the local state
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      toast({
        title: "Removed",
        description: "Customer removed from waitlist",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error removing customer:", error);
      toast({
        title: "Error",
        description: "Failed to remove customer",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };
  
  const refreshEntries = async () => {
    if (!waitlistId) return;
    
    try {
      const entriesData = await getWaitlistEntries(waitlistId);
      setEntries(entriesData);
    } catch (error) {
      console.error("Error refreshing entries:", error);
    }
  };
  
  const copyJoinLink = () => {
    navigator.clipboard.writeText(joinUrl);
    toast({
      title: "Copied",
      description: "Join link copied to clipboard",
    });
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }
    
    if (!waitlist) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Waitlist not found</p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="queue">Queue ({entries.length})</TabsTrigger>
            <TabsTrigger value="join">Join Link</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="queue" className="space-y-4 pt-4">
            {entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold">{entry.position}</span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {entry.profiles?.first_name} {entry.profiles?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.profiles?.phone_number || "No phone"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            entry.status === 'waiting' ? 'bg-blue-500/20 text-blue-500' :
                            entry.status === 'notified' ? 'bg-yellow-500/20 text-yellow-500' :
                            entry.status === 'seated' ? 'bg-green-500/20 text-green-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                          <WaitlistActions 
                            entry={entry}
                            onStatusChange={handleStatusChange}
                            onRemove={handleRemoveEntry}
                            refreshEntries={refreshEntries}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No customers in the queue</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="join" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Waitlist Join Link</CardTitle>
                <CardDescription>
                  Share this link or QR code with customers to let them join your waitlist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between border rounded-md p-3">
                  <span className="text-sm truncate mr-2">{joinUrl}</span>
                  <Button variant="ghost" size="sm" onClick={copyJoinLink}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                  <div className="bg-white p-4 rounded-md">
                    <QRCode value={joinUrl} size={200} />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Scan to join {waitlist.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Waitlist Settings</CardTitle>
                <CardDescription>
                  Configure your waitlist settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-4">
                  Settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/waitlist')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Waitlists
          </Button>
          {waitlist && <h1 className="text-2xl font-bold tracking-tight">{waitlist.name}</h1>}
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Check-in Customer
          </Button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default WaitlistDetails;
