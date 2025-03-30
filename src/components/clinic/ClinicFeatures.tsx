
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Stethoscope, Users, ClipboardList, Calendar, Clock } from 'lucide-react';

export const ClinicFeatures = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Patient Management',
      description: 'Comprehensive patient records, medical history tracking, and appointment scheduling.',
      icon: <Users className="h-6 w-6 text-primary" />,
      action: () => navigate('/patients')
    },
    {
      title: 'Healthcare Services',
      description: 'Organize and manage various medical services and treatments for your patients.',
      icon: <ClipboardList className="h-6 w-6 text-primary" />,
      action: () => navigate('/services')
    },
    {
      title: 'Practitioner Scheduling',
      description: 'Manage healthcare providers, their specialties, and availability.',
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      action: () => navigate('/practitioners')
    },
    {
      title: 'Digital Waitroom',
      description: 'Reduce waiting room congestion with our virtual queue management system.',
      icon: <Clock className="h-6 w-6 text-primary" />,
      action: () => navigate('/waitlist')
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Healthcare Management Features</h2>
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
            <h3 className="text-lg font-medium">Ready to streamline your healthcare practice?</h3>
            <p className="text-sm text-muted-foreground">
              Reduce waiting times, improve patient satisfaction, and optimize your clinic workflow.
            </p>
          </div>
          <Button onClick={() => navigate('/appointments')}>
            <Calendar className="mr-2 h-4 w-4" />
            Manage Appointments
          </Button>
        </div>
      </div>
    </div>
  );
};
