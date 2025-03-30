
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, BarChart2, Settings, Grid2X2 } from 'lucide-react';

export const GenericBusinessFeatures = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Customer Management',
      description: 'Track customer information, preferences, and visit history.',
      icon: <Users className="h-6 w-6 text-primary" />,
      action: () => navigate('/customers')
    },
    {
      title: 'Appointment Scheduling',
      description: 'Manage bookings, reservations, and appointments in one place.',
      icon: <Calendar className="h-6 w-6 text-primary" />,
      action: () => navigate('/appointments')
    },
    {
      title: 'Waitlist Management',
      description: 'Digital queue system for walk-in customers to reduce waiting times.',
      icon: <Clock className="h-6 w-6 text-primary" />,
      action: () => navigate('/waitlist')
    },
    {
      title: 'Business Analytics',
      description: 'Gain insights into your business performance and customer trends.',
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
      action: () => navigate('/reports')
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Grid2X2 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Business Management Features</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:bg-accent/5 transition-colors"
            onClick={feature.action}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
              <div className="mt-4">
                <Button variant="link" className="p-0 h-auto" onClick={feature.action}>
                  Learn more
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">Optimize your business operations</h3>
            <p className="text-sm text-muted-foreground">
              Streamline customer flow, reduce wait times, and enhance service quality.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/waitlist')}>
              <Clock className="mr-2 h-4 w-4" />
              Manage Waitlist
            </Button>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Business Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
