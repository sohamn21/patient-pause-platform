import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Clock, Users, Settings, Plus, DollarSign, BarChart2, 
  UserPlus, Shield, Check, Stethoscope, ClipboardList, Scissors,
  Utensils, TableProperties, ChefHat, Heart, Brush, Grid2X2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessWaitlists } from '@/lib/waitlistService';
import { getUserWaitlistEntries } from '@/lib/waitlistService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCurrentSubscription, SubscriptionStatus } from '@/lib/subscriptionService';
import { SubscriptionFeaturesList } from '@/components/dashboard/SubscriptionFeaturesList';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const role = user?.user_metadata?.role as string || 'customer';
  const businessType = profile?.business_type || user?.user_metadata?.businessType as string;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (role === 'business') {
    return <BusinessDashboard businessType={businessType} />;
  } else {
    return <CustomerDashboard />;
  }
};

interface BusinessDashboardProps {
  businessType: string;
}

const BusinessDashboard = ({ businessType }: BusinessDashboardProps) => {
  const [waitlists, setWaitlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWaitlists = async () => {
      try {
        if (user) {
          const data = await getBusinessWaitlists(user.id);
          setWaitlists(data || []);
        }
      } catch (error) {
        console.error("Error fetching waitlists:", error);
        toast({
          title: "Error",
          description: "Failed to load waitlist data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

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

    fetchWaitlists();
    fetchSubscription();
  }, [user, toast]);

  const stats = [
    { title: 'Today\'s Waitlist', value: waitlists.length.toString(), icon: <Clock className="h-4 w-4" /> },
    { title: 'Total Customers', value: '245', icon: <Users className="h-4 w-4" /> },
    { title: 'Monthly Revenue', value: '₹42,500', icon: <DollarSign className="h-4 w-4" /> },
  ];

  const getIndustryFeatures = () => {
    switch (businessType) {
      case 'clinic':
        return [
          { 
            title: 'Patient Management', 
            description: 'Manage patient records and medical history', 
            icon: <Users />,
            action: () => navigate('/patients')
          },
          { 
            title: 'Healthcare Services', 
            description: 'Organize appointments by service type', 
            icon: <ClipboardList />,
            action: () => navigate('/services')
          },
          { 
            title: 'Practitioners', 
            description: 'Manage healthcare providers and specializations', 
            icon: <Stethoscope />,
            action: () => navigate('/practitioners')
          },
        ];
      case 'salon':
        return [
          { 
            title: 'Stylist Management', 
            description: 'Assign appointments to specific stylists', 
            icon: <Scissors />,
            action: () => navigate('/staff')
          },
          { 
            title: 'Beauty Services', 
            description: 'Manage salon services and pricing', 
            icon: <Brush />,
            action: () => navigate('/services')
          },
          { 
            title: 'Client History', 
            description: 'Track client preferences and history', 
            icon: <UserPlus />,
            action: () => navigate('/customers')
          },
        ];
      case 'restaurant':
        return [
          { 
            title: 'Table Management', 
            description: 'Manage seating arrangements and availability', 
            icon: <TableProperties />,
            action: () => navigate('/tables')
          },
          { 
            title: 'Reservations', 
            description: 'Manage table reservations and party sizes', 
            icon: <Utensils />,
            action: () => navigate('/table-reservations')
          },
          { 
            title: 'Kitchen Updates', 
            description: 'Keep track of kitchen status and wait times', 
            icon: <ChefHat />,
            action: () => navigate('/waitlist')
          },
        ];
      default:
        return [
          { 
            title: 'Customizable Queues', 
            description: 'Create custom queues for your business needs', 
            icon: <Grid2X2 />,
            action: () => navigate('/waitlist')
          },
          { 
            title: 'Service Tracking', 
            description: 'Track different services and appointment types', 
            icon: <Calendar />,
            action: () => navigate('/appointments')
          },
          { 
            title: 'Customer Database', 
            description: 'Maintain customer relationships and history', 
            icon: <Users />,
            action: () => navigate('/customers')
          },
        ];
    }
  };

  const getBusinessTypeTitle = () => {
    switch (businessType) {
      case 'clinic':
        return 'Healthcare Features';
      case 'salon':
        return 'Salon Features';
      case 'restaurant':
        return 'Restaurant Features';
      default:
        return 'Business Features';
    }
  };

  const getBusinessTypeIcon = () => {
    switch (businessType) {
      case 'clinic':
        return <Heart className="mr-2 h-4 w-4" />;
      case 'salon':
        return <Scissors className="mr-2 h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="mr-2 h-4 w-4" />;
      default:
        return <Calendar className="mr-2 h-4 w-4" />;
    }
  };

  const getPrimaryActionButton = () => {
    switch (businessType) {
      case 'clinic':
        return (
          <Button onClick={() => navigate('/patients')}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        );
      case 'salon':
        return (
          <Button onClick={() => navigate('/appointments')}>
            <Calendar className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        );
      case 'restaurant':
        return (
          <Button onClick={() => navigate('/table-reservations')}>
            <TableProperties className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        );
      default:
        return (
          <Button onClick={() => navigate('/waitlist')}>
            <Plus className="mr-2 h-4 w-4" />
            New Waitlist Entry
          </Button>
        );
    }
  };

  const industryFeatures = getIndustryFeatures();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your {businessType || 'business'}.
        </p>
      </div>
      
      {!subscriptionLoading && (
        <>
          {subscription?.active ? (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{subscription.plan?.name} Plan Active</h3>
                      <p className="text-sm text-muted-foreground">
                        Your subscription renews on {subscription.current_period_end ? 
                          new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/settings')}>
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Free Tier Active</h3>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to unlock more features and remove limitations
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => navigate('/settings')}>
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {!subscriptionLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          <SubscriptionFeaturesList subscription={subscription} />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {getPrimaryActionButton()}
                
                <Button variant="outline" onClick={() => navigate('/appointments')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Business Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Waitlists</h2>
          <Button size="sm" onClick={() => navigate('/waitlist')}>View All</Button>
        </div>
        
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading waitlist data...</p>
            </CardContent>
          </Card>
        ) : waitlists.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {waitlists.map((waitlist) => (
              <Card key={waitlist.id} className="hover:bg-accent/5 transition-colors cursor-pointer" 
                    onClick={() => navigate(`/waitlist/${waitlist.id}`)}>
                <CardHeader>
                  <CardTitle>{waitlist.name}</CardTitle>
                  <CardDescription>
                    {waitlist.is_active ? 
                      <span className="text-green-500">Active</span> : 
                      <span className="text-red-500">Inactive</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{waitlist.description || 'No description'}</p>
                  {waitlist.max_capacity && (
                    <p className="text-sm mt-2">
                      Capacity: <span className="font-medium">{waitlist.max_capacity}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">You haven't created any waitlists yet.</p>
                <Button onClick={() => navigate('/waitlist')}>Create Waitlist</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {getBusinessTypeTitle()}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {industryFeatures.map((feature, index) => (
            <Card key={index} className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={feature.action}>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWaitlistEntries = async () => {
      try {
        if (user) {
          const data = await getUserWaitlistEntries(user.id);
          setWaitlistEntries(data || []);
        }
      } catch (error) {
        console.error("Error fetching waitlist entries:", error);
        toast({
          title: "Error",
          description: "Failed to load your waitlist entries",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistEntries();
  }, [user, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Manage your appointments and reservations.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => navigate('/appointments')}>
          <Calendar className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
        <Button variant="outline" onClick={() => navigate('/waitlist')}>
          <Clock className="mr-2 h-4 w-4" />
          Join Waitlist
        </Button>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">My Current Waitlists</h2>
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading your waitlist entries...</p>
            </CardContent>
          </Card>
        ) : waitlistEntries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {waitlistEntries.map((entry) => (
              <Card key={entry.id} className="hover:bg-accent/5 transition-colors">
                <CardHeader>
                  <CardTitle>{entry.waitlists?.name || 'Unnamed Waitlist'}</CardTitle>
                  <CardDescription>
                    {entry.waitlists?.profiles?.business_name || 'Unknown Business'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`text-sm font-medium ${
                        entry.status === 'waiting' ? 'text-yellow-500' :
                        entry.status === 'notified' ? 'text-blue-500' :
                        entry.status === 'seated' ? 'text-green-500' :
                        'text-red-500'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Position:</span>
                      <span className="text-sm font-medium">{entry.position}</span>
                    </div>
                    {entry.estimated_wait_time && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Wait:</span>
                        <span className="text-sm font-medium">{entry.estimated_wait_time} min</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">You're not currently on any waitlists.</p>
                <Button onClick={() => navigate('/waitlist')}>Browse Waitlists</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">You don't have any upcoming appointments.</p>
              <Button onClick={() => navigate('/appointments')}>Book Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
