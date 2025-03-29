
import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionPlan } from "@/lib/subscriptionService";
import { hasFeatureAccess, FeatureLimits } from "@/lib/subscriptionFeatures";

interface FeatureGateProps {
  feature: keyof FeatureLimits;
  plan: SubscriptionPlan | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate = ({ feature, plan, children, fallback }: FeatureGateProps) => {
  const navigate = useNavigate();
  const hasAccess = hasFeatureAccess(feature, plan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt by default
  return (
    <Card className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold">Premium Feature</h3>
          <p className="text-muted-foreground">
            This feature requires a subscription upgrade to access.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/settings')}
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          View Subscription Plans
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
