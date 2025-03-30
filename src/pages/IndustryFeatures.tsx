
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClinicFeatures } from '@/components/clinic/ClinicFeatures';
import { SalonFeatures } from '@/components/salon/SalonFeatures';
import { RestaurantFeatures } from '@/components/restaurant/RestaurantFeatures';
import { GenericBusinessFeatures } from '@/components/business/GenericBusinessFeatures';

const IndustryFeatures = () => {
  const { profile } = useAuth();
  const businessType = profile?.business_type;
  
  const renderIndustryFeatures = () => {
    switch (businessType) {
      case 'clinic':
        return <ClinicFeatures />;
      case 'salon':
        return <SalonFeatures />;
      case 'restaurant':
        return <RestaurantFeatures />;
      default:
        return <GenericBusinessFeatures />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Industry Features</h1>
        <p className="text-muted-foreground">
          Specialized tools and functionality designed for your {businessType || 'business'} needs.
        </p>
      </div>
      
      {renderIndustryFeatures()}
    </div>
  );
};

export default IndustryFeatures;
