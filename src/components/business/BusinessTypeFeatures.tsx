
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Utensils,
  Scissors,
  Stethoscope,
  Building,
  Clock,
  CalendarClock,
  MessageSquare,
  Users,
} from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BusinessTypeFeaturesProps {
  businessType: string;
}

export const BusinessTypeFeatures = ({ businessType }: BusinessTypeFeaturesProps) => {
  const getFeaturesByType = (type: string): FeatureItem[] => {
    switch (type) {
      case 'restaurant':
        return [
          {
            title: 'Table Management',
            description: 'Efficiently manage seating and reservations',
            icon: <Utensils className="w-8 h-8 text-primary" />
          },
          {
            title: 'Digital Waitlist',
            description: 'Streamline customer queuing',
            icon: <Clock className="w-8 h-8 text-primary" />
          },
          {
            title: 'Customer Notifications',
            description: 'Automatic SMS/email when table is ready',
            icon: <MessageSquare className="w-8 h-8 text-primary" />
          },
        ];
      case 'salon':
        return [
          {
            title: 'Appointment Scheduling',
            description: 'Book and manage client appointments',
            icon: <CalendarClock className="w-8 h-8 text-primary" />
          },
          {
            title: 'Stylist Management',
            description: 'Organize stylist schedules and specialties',
            icon: <Scissors className="w-8 h-8 text-primary" />
          },
          {
            title: 'Client History',
            description: 'Track client preferences and history',
            icon: <Users className="w-8 h-8 text-primary" />
          },
        ];
      case 'clinic':
        return [
          {
            title: 'Patient Management',
            description: 'Comprehensive patient records',
            icon: <Stethoscope className="w-8 h-8 text-primary" />
          },
          {
            title: 'Appointment Scheduling',
            description: 'Organize patient visits efficiently',
            icon: <CalendarClock className="w-8 h-8 text-primary" />
          },
          {
            title: 'Digital Queue',
            description: 'Manage patient wait times',
            icon: <Clock className="w-8 h-8 text-primary" />
          },
        ];
      default:
        return [
          {
            title: 'Queue Management',
            description: 'Digital queue for any business type',
            icon: <Building className="w-8 h-8 text-primary" />
          },
          {
            title: 'Customer Management',
            description: 'Track customer data and preferences',
            icon: <Users className="w-8 h-8 text-primary" />
          },
          {
            title: 'Notifications',
            description: 'Automated customer communications',
            icon: <MessageSquare className="w-8 h-8 text-primary" />
          },
        ];
    }
  };

  const features = getFeaturesByType(businessType);

  if (!businessType) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">
        Features for your {businessType.charAt(0).toUpperCase() + businessType.slice(1)} Business
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center space-y-2">
              <div className="flex justify-center mb-2">
                {feature.icon}
              </div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
