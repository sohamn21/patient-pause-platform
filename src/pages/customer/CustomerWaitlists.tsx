
import React, { useState } from 'react';
import { BlurCard } from "@/components/ui/blur-card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, Clock, Calendar, Store, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Sample businesses with waitlists
const sampleBusinesses = [
  {
    id: "1",
    name: "Urban Bistro",
    type: "Restaurant",
    waitTime: "25-30 min",
    distance: "0.8 miles",
    capacity: "12/45"
  },
  {
    id: "2",
    name: "Cloud 9 Cafe",
    type: "Cafe",
    waitTime: "10-15 min",
    distance: "1.2 miles",
    capacity: "5/30"
  },
  {
    id: "3",
    name: "Studio 54 Hair Salon",
    type: "Salon",
    waitTime: "45-60 min",
    distance: "0.5 miles",
    capacity: "8/10"
  },
  {
    id: "4",
    name: "Peak Medical Clinic",
    type: "Healthcare",
    waitTime: "35-40 min",
    distance: "2.1 miles",
    capacity: "15/25"
  }
];

// Sample user's active waitlists
const sampleActiveWaitlists = [
  {
    id: "w1",
    businessName: "Urban Bistro",
    joinedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    position: 3,
    estimatedWaitTime: "10-15 min",
    status: "waiting" as const
  },
  {
    id: "w2",
    businessName: "Peak Medical Clinic",
    joinedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    position: 2,
    estimatedWaitTime: "5-10 min",
    status: "notified" as const
  }
];

// Sample past waitlist history
const sampleHistoryWaitlists = [
  {
    id: "h1",
    businessName: "Cloud 9 Cafe",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    waitTime: "12 min",
    status: "seated" as const
  },
  {
    id: "h2",
    businessName: "Studio 54 Hair Salon",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    waitTime: "32 min",
    status: "seated" as const
  },
  {
    id: "h3",
    businessName: "Urban Bistro",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    waitTime: "8 min",
    status: "cancelled" as const
  }
];

const CustomerWaitlists = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredBusinesses = sampleBusinesses.filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleJoinWaitlist = (businessId: string, businessName: string) => {
    toast({
      title: "Joined Waitlist",
      description: `You've been added to ${businessName}'s waitlist.`,
    });
  };
  
  const handleLeaveWaitlist = (waitlistId: string, businessName: string) => {
    toast({
      title: "Left Waitlist",
      description: `You've been removed from ${businessName}'s waitlist.`,
      variant: "destructive",
    });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Waitlists</h1>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">My Active Waitlists</TabsTrigger>
          <TabsTrigger value="discover">Discover Waitlists</TabsTrigger>
          <TabsTrigger value="history">Waitlist History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {sampleActiveWaitlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleActiveWaitlists.map(waitlist => (
                <BlurCard key={waitlist.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{waitlist.businessName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Joined {waitlist.joinedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        waitlist.status === 'notified' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {waitlist.status === 'notified' ? 'Ready Soon' : 'Waiting'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Position: {waitlist.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Wait: {waitlist.estimatedWaitTime}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleLeaveWaitlist(waitlist.id, waitlist.businessName)}
                    >
                      Leave Waitlist
                    </Button>
                  </div>
                </BlurCard>
              ))}
            </div>
          ) : (
            <BlurCard className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No Active Waitlists</h3>
              <p className="text-muted-foreground mb-4">
                You are not currently on any waitlists.
              </p>
              <Button onClick={() => document.querySelector('[data-value="discover"]')?.click()}>
                Discover Waitlists
              </Button>
            </BlurCard>
          )}
        </TabsContent>
        
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
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map(business => (
                <BlurCard key={business.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{business.name}</h3>
                        <p className="text-sm text-muted-foreground">{business.type} • {business.distance}</p>
                      </div>
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {business.capacity}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Current wait: {business.waitTime}</span>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => handleJoinWaitlist(business.id, business.name)}
                    >
                      Join Waitlist
                    </Button>
                  </div>
                </BlurCard>
              ))
            ) : (
              <div className="col-span-full text-center py-6">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Waitlists Found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any businesses matching your search.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <BlurCard>
            <div className="divide-y divide-border">
              {sampleHistoryWaitlists.map(waitlist => (
                <div key={waitlist.id} className="p-4 hover:bg-accent/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{waitlist.businessName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {waitlist.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Wait time: {waitlist.waitTime}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      waitlist.status === 'seated' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {waitlist.status === 'seated' ? 'Seated' : 'Cancelled'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerWaitlists;
