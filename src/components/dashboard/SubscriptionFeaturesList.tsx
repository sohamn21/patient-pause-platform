
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Check, X, Info } from "lucide-react";
import { SubscriptionStatus } from "@/lib/subscriptionService";
import { getFeatureLimits } from "@/lib/subscriptionFeatures";

interface SubscriptionFeaturesListProps {
  subscription: SubscriptionStatus | null;
}

export const SubscriptionFeaturesList = ({ subscription }: SubscriptionFeaturesListProps) => {
  const limits = getFeatureLimits(subscription?.plan);
  
  const features = [
    { 
      name: 'Waitlists', 
      value: limits.maxWaitlists === -1 ? 'Unlimited' : limits.maxWaitlists.toString(),
      enabled: limits.maxWaitlists > 0
    },
    { 
      name: 'Locations', 
      value: limits.maxLocations === -1 ? 'Unlimited' : limits.maxLocations.toString(),
      enabled: limits.maxLocations > 0
    },
    { 
      name: 'Customers per day', 
      value: limits.maxCustomersPerDay === -1 ? 'Unlimited' : limits.maxCustomersPerDay.toString(),
      enabled: limits.maxCustomersPerDay > 0
    },
    { 
      name: 'Advanced Analytics', 
      value: limits.hasAdvancedAnalytics ? 'Yes' : 'No',
      enabled: limits.hasAdvancedAnalytics
    },
    { 
      name: 'SMS Notifications', 
      value: limits.hasSmsNotifications ? 'Yes' : 'No',
      enabled: limits.hasSmsNotifications
    },
    { 
      name: 'Email Notifications', 
      value: limits.hasEmailNotifications ? 'Yes' : 'No',
      enabled: limits.hasEmailNotifications
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Current Features</CardTitle>
          <Badge variant={subscription?.active ? "default" : "outline"}>
            {subscription?.active ? subscription.plan?.name || 'Active' : 'Free Tier'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between py-1 border-b last:border-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{feature.name}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{feature.enabled ? 'Available in your plan' : 'Upgrade to access this feature'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center gap-2">
                <span>{feature.value}</span>
                {feature.enabled ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionFeaturesList;
