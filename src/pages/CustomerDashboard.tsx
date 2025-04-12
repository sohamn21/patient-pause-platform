
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlurCard, BlurCardContent } from '@/components/ui/blur-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, ArrowRight, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CustomerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a visit with your healthcare provider',
      icon: <Calendar className="w-10 h-10 text-primary" />,
      action: () => navigate('/customer/appointments')
    },
    {
      title: 'Join Waitlist',
      description: 'Add yourself to a business waitlist',
      icon: <Clock className="w-10 h-10 text-primary" />,
      action: () => navigate('/customer/waitlists')
    },
    {
      title: 'Complete Health Profile',
      description: 'Set up your medical information for appointments',
      icon: <FileEdit className="w-10 h-10 text-primary" />,
      action: () => navigate('/customer/profile')
    }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Welcome, {profile?.first_name || 'Patient'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BlurCard>
            <BlurCardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback>
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="text-muted-foreground mb-2">
                  {user?.email}
                </p>
                <Badge variant="outline" className="mt-2">
                  {profile?.role || 'customer'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate('/customer/profile')}
                >
                  Edit Profile
                </Button>
              </div>
            </BlurCardContent>
          </BlurCard>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center justify-center text-center"
                  onClick={action.action}
                >
                  <div className="mb-2">{action.icon}</div>
                  <h3 className="font-medium text-lg">{action.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{action.description}</p>
                </Button>
              ))}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-muted-foreground mb-4">
                  You don't have any recent activities
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/customer/appointments')}
                  className="group"
                >
                  Book Your First Appointment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
