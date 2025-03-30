
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Users, Brush, Calendar, Clock, UserPlus } from 'lucide-react';

export const SalonFeatures = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Stylist Management',
      description: 'Organize your stylists\' schedules, specialties, and client assignments.',
      icon: <Scissors className="h-6 w-6 text-primary" />,
      action: () => navigate('/staff')
    },
    {
      title: 'Beauty Services',
      description: 'Manage your salon services, pricing, and duration for efficient booking.',
      icon: <Brush className="h-6 w-6 text-primary" />,
      action: () => navigate('/services')
    },
    {
      title: 'Client Database',
      description: 'Track client preferences, history, and special requirements for personalized service.',
      icon: <Users className="h-6 w-6 text-primary" />,
      action: () => navigate('/customers')
    },
    {
      title: 'Walk-in Management',
      description: 'Efficiently manage walk-in clients with our digital queue system.',
      icon: <Clock className="h-6 w-6 text-primary" />,
      action: () => navigate('/waitlist')
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Scissors className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Salon Management Features</h2>
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
            <h3 className="text-lg font-medium">Elevate your salon's efficiency</h3>
            <p className="text-sm text-muted-foreground">
              Reduce no-shows, streamline bookings, and give your clients the premium experience they deserve.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/appointments')}>
              <Calendar className="mr-2 h-4 w-4" />
              Manage Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate('/customers')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
