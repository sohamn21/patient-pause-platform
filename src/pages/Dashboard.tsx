
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const role = user?.user_metadata?.role as string || 'customer';
  const businessType = user?.user_metadata?.businessType as string;
  
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
  const stats = [
    { title: 'Today\'s Waitlist', value: '12', icon: <Clock className="h-4 w-4" /> },
    { title: 'Today\'s Appointments', value: '8', icon: <Calendar className="h-4 w-4" /> },
    { title: 'Customers', value: '245', icon: <Users className="h-4 w-4" /> },
  ];

  // Industry-specific features
  let industryFeatures = [];
  
  if (businessType === 'clinic') {
    industryFeatures = [
      { title: 'Patient Management', description: 'Manage patient records and history' },
      { title: 'Service-Based Scheduling', description: 'Organize appointments by service type' },
      { title: 'Practitioner Preferences', description: 'Allow patients to choose their preferred healthcare provider' },
    ];
  } else if (businessType === 'salon') {
    industryFeatures = [
      { title: 'Stylist Management', description: 'Assign appointments to specific stylists' },
      { title: 'Service Duration', description: 'Set different durations for various salon services' },
      { title: 'Client Preferences', description: 'Track client preferences and history' },
    ];
  } else if (businessType === 'restaurant') {
    industryFeatures = [
      { title: 'Table Management', description: 'Manage seating and table assignments' },
      { title: 'Party Size Handling', description: 'Organize reservations by group size' },
      { title: 'Walk-in Management', description: 'Balance walk-ins with reservations' },
    ];
  } else {
    industryFeatures = [
      { title: 'Customizable Queues', description: 'Create custom queues for your business needs' },
      { title: 'Service Tracking', description: 'Track different services and appointment types' },
      { title: 'Customer Management', description: 'Maintain customer relationships and history' },
    ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Waitlist Entry
        </Button>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Business Settings
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
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
            <Card key={index}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
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
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Join Waitlist
        </Button>
      </div>
      
      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <Card>
          <CardHeader>
            <CardTitle>No Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You don't have any upcoming appointments. Book one to get started!
            </CardDescription>
            <Button className="mt-4" asChild>
              <a href="/appointments">Book Now</a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>No Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your recent appointments and waitlist entries will appear here.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
