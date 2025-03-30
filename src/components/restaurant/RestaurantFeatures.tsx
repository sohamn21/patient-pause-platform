
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, TableProperties, Clock, Calendar, Users, ChefHat } from 'lucide-react';

export const RestaurantFeatures = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Table Management',
      description: 'Interactive floor plan to manage table layouts, capacity, and availability.',
      icon: <TableProperties className="h-6 w-6 text-primary" />,
      action: () => navigate('/tables')
    },
    {
      title: 'Reservations',
      description: 'Schedule and manage reservations to optimize seating and guest experience.',
      icon: <Calendar className="h-6 w-6 text-primary" />,
      action: () => navigate('/table-reservations')
    },
    {
      title: 'Waitlist Management',
      description: 'Digital queue system for walk-in guests to reduce lobby congestion.',
      icon: <Clock className="h-6 w-6 text-primary" />,
      action: () => navigate('/waitlist')
    },
    {
      title: 'Guest Database',
      description: 'Track guest preferences, special occasions, and visit history.',
      icon: <Users className="h-6 w-6 text-primary" />,
      action: () => navigate('/customers')
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Utensils className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Restaurant Management Features</h2>
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
            <h3 className="text-lg font-medium">Optimize your restaurant operations</h3>
            <p className="text-sm text-muted-foreground">
              Improve table turnover, reduce wait times, and enhance the dining experience for your guests.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/table-reservations')}>
              <TableProperties className="mr-2 h-4 w-4" />
              Manage Tables
            </Button>
            <Button variant="outline" onClick={() => navigate('/waitlist')}>
              <ChefHat className="mr-2 h-4 w-4" />
              Current Waitlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
