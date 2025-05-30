
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, BarChart3 } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { getFeatureLimits } from "@/lib/subscriptionFeatures";

interface UsageMetricsProps {
  waitlistCount?: number;
  locationCount?: number;
  customersThisMonth?: number;
}

export const UsageMetrics = ({ 
  waitlistCount = 0, 
  locationCount = 1, 
  customersThisMonth = 0 
}: UsageMetricsProps) => {
  const { subscription } = useSubscription();
  const limits = getFeatureLimits(subscription?.plan);

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return "bg-green-500"; // Unlimited
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited shows as 0%
    return Math.min((current / limit) * 100, 100);
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? "Unlimited" : limit.toString();
  };

  const metrics = [
    {
      title: "Waitlists",
      icon: BarChart3,
      current: waitlistCount,
      limit: limits.maxWaitlists,
      description: "Active waitlists"
    },
    {
      title: "Locations",
      icon: MapPin,
      current: locationCount,
      limit: limits.maxLocations,
      description: "Business locations"
    },
    {
      title: "Customers",
      icon: Users,
      current: customersThisMonth,
      limit: limits.maxCustomersPerDay * 30, // Approximate monthly limit
      description: "This month"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Usage Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const percentage = getUsagePercentage(metric.current, metric.limit);
            const isNearLimit = metric.limit !== -1 && percentage >= 80;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{metric.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {metric.current} / {formatLimit(metric.limit)}
                    </span>
                    {isNearLimit && (
                      <Badge variant="destructive" className="text-xs">
                        Near Limit
                      </Badge>
                    )}
                  </div>
                </div>
                
                {metric.limit !== -1 && (
                  <div className="space-y-1">
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                )}
                
                {metric.limit === -1 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Unlimited
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
