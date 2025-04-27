
import { useState, useEffect } from "react";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, User, Building, ListChecks, Clock, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import QrCodeScanner from "@/components/QrCodeScanner";

interface UserProfile {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: string;
  business_name?: string;
  created_at: string;
}

interface Waitlist {
  id: string;
  name: string;
  business_id: string;
  is_active: boolean;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  business_name: string;
  plan: string;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
}

const AdminPage = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;
      setUsers(usersData);

      const { data: waitlistsData, error: waitlistsError } = await supabase
        .from('waitlists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (waitlistsError) throw waitlistsError;
      setWaitlists(waitlistsData);

      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          user_id,
          active,
          current_period_end,
          cancel_at_period_end,
          plan_id,
          created_at,
          profiles!inner(business_name)
        `)
        .order('created_at', { ascending: false });
      
      if (subscriptionsError) throw subscriptionsError;

      // Format subscription data from DB
      const formattedSubscriptions: Subscription[] = subscriptionsData.map((sub: any) => ({
        id: sub.id,
        user_id: sub.user_id,
        business_name: sub.profiles?.business_name || "Unknown Business",
        plan: sub.plan_id || "Basic",
        status: sub.active ? "active" : "expired",
        start_date: sub.created_at,
        end_date: sub.current_period_end || new Date().toISOString(),
        price: sub.plan_id === "premium" ? 1999 : sub.plan_id === "enterprise" ? 4999 : 999,
      }));
      
      setSubscriptions(formattedSubscriptions);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    toast({
      title: "QR Code Scanned",
      description: `Decoded text: ${decodedText}`,
    });
    
    if (decodedText.includes('/join-waitlist/')) {
      const waitlistId = decodedText.split('/join-waitlist/')[1];
      window.location.href = `/join-waitlist/${waitlistId}`;
    }
    
    setShowScanner(false);
  };

  return (
    <div className="container mx-auto py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System management and overview for administrators
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{users.length}</h3>
            </div>
            <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
              <User size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
        
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Business Accounts</p>
              <h3 className="text-2xl font-bold">
                {users.filter(user => user.role === 'business').length}
              </h3>
            </div>
            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
              <Building size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
        
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Waitlists</p>
              <h3 className="text-2xl font-bold">
                {waitlists.filter(waitlist => waitlist.is_active).length}
              </h3>
            </div>
            <div className="rounded-full bg-purple-500/10 p-2 text-purple-500">
              <ListChecks size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
        
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <h3 className="text-2xl font-bold">
                {subscriptions.filter(sub => sub.status === 'active').length}
              </h3>
            </div>
            <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
              <CreditCard size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? "Close Scanner" : "Open QR Scanner"}
        </Button>
      </div>

      {showScanner && (
        <div className="mb-8">
          <QrCodeScanner onScanSuccess={handleScanSuccess} />
        </div>
      )}

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="waitlists">Waitlists</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>User Management</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? "default" : 
                                         user.role === 'business' ? "outline" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.business_name || '-'}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="waitlists">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Waitlist Management</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading waitlists...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Business ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlists.map((waitlist) => (
                      <TableRow key={waitlist.id}>
                        <TableCell>{waitlist.name}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {waitlist.business_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant={waitlist.is_active ? "default" : "secondary"}>
                            {waitlist.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(waitlist.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </BlurCardContent>
          </BlurCard>
        </TabsContent>

        <TabsContent value="subscriptions">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Subscription Management</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading subscriptions...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>{subscription.business_name}</TableCell>
                        <TableCell>
                          <Badge variant={subscription.plan === 'Premium' ? "default" : "outline"}>
                            {subscription.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={subscription.status === 'active' ? "default" : "destructive"} 
                            className={subscription.status === 'active' ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}
                          >
                            {subscription.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.start_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>₹{subscription.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="system">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>System Information</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="p-4">
                <p className="text-muted-foreground mb-4">System statistics and management tools</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Application Status</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Online
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Admin Actions</h3>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={fetchData}>
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
