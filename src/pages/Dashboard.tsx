
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Settings, Plus, DollarSign, BarChart2, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessWaitlists } from '@/lib/waitlistService';
import { getUserWaitlistEntries } from '@/lib/waitlistService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const role = user?.user_metadata?.role as string || 'customer';
  const businessType = profile?.business_type || user?.user_metadata?.businessType as string;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Show different dashboard based on user role
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

    fetchWaitlists();
  }, [user, toast]);

  // Stats data
  const stats = [
    { title: 'Today\'s Waitlist', value: waitlists.length.toString(), icon: <Clock className="h-4 w-4" /> },
    { title: 'Total Customers', value: '245', icon: <Users className="h-4 w-4" /> },
    { title: 'Monthly Revenue', value: '₹42,500', icon: <DollarSign className="h-4 w-4" /> },
  ];

  // Industry-specific features
  let industryFeatures = [];
  
  if (businessType === 'clinic') {
    industryFeatures = [
      { title: 'Patient Management', description: 'Manage patient records and history', icon: <Users /> },
      { title: 'Service-Based Scheduling', description: 'Organize appointments by service type', icon: <Calendar /> },
      { title: 'Practitioner Preferences', description: 'Allow patients to choose their preferred healthcare provider', icon: <UserPlus /> },
    ];
  } else if (businessType === 'salon') {
    industryFeatures = [
      { title: 'Stylist Management', description: 'Assign appointments to specific stylists', icon: <Users /> },
      { title: 'Service Duration', description: 'Set different durations for various salon services', icon: <Clock /> },
      { title: 'Client Preferences', description: 'Track client preferences and history', icon: <UserPlus /> },
    ];
  } else if (businessType === 'restaurant') {
    industryFeatures = [
      { title: 'Table Management', description: 'Manage seating and table assignments', icon: <Users /> },
      { title: 'Party Size Handling', description: 'Organize reservations by group size', icon: <UserPlus /> },
      { title: 'Walk-in Management', description: 'Balance walk-ins with reservations', icon: <Clock /> },
    ];
  } else {
    industryFeatures = [
      { title: 'Customizable Queues', description: 'Create custom queues for your business needs', icon: <Settings /> },
      { title: 'Service Tracking', description: 'Track different services and appointment types', icon: <Calendar /> },
      { title: 'Customer Management', description: 'Maintain customer relationships and history', icon: <Users /> },
    ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => navigate('/waitlist')}>
          <Plus className="mr-2 h-4 w-4" />
          New Waitlist Entry
        </Button>
        <Button variant="outline" onClick={() => navigate('/appointments')}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
        <Button variant="outline" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Business Settings
        </Button>
      </div>
      
      {/* Stats */}
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
      
      {/* Waitlists Section */}
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
      
      {/* Industry Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {businessType === 'clinic' ? 'Clinic Features' : 
           businessType === 'salon' ? 'Salon Features' : 
           businessType === 'restaurant' ? 'Restaurant Features' : 
           'Business Features'}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {industryFeatures.map((feature, index) => (
            <Card key={index} className="hover:bg-accent/5 transition-colors">
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
      
      {/* Quick Actions */}
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
      
      {/* Current Waitlist Entries */}
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
      
      {/* Upcoming Appointments */}
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
