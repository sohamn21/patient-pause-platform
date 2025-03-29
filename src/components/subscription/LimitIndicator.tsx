
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { SubscriptionPlan } from "@/lib/subscriptionService";
import { isWithinLimits, getLimitDescription } from "@/lib/subscriptionFeatures";

interface LimitIndicatorProps {
  feature: 'maxWaitlists' | 'maxLocations' | 'maxCustomersPerDay';
  currentCount: number;
  plan: SubscriptionPlan | null;
  entityName: string;
}

export const LimitIndicator = ({ 
  feature, 
  currentCount, 
  plan, 
  entityName 
}: LimitIndicatorProps) => {
  const navigate = useNavigate();
  const withinLimits = isWithinLimits(feature, currentCount, plan);
  const limitValue = plan ? getLimitDescription(feature, plan) : '1';
  const isUnlimited = limitValue === 'Unlimited';
  
  // Calculate progress percentage, but only if not unlimited
  const progressPercentage = isUnlimited 
    ? 0 
    : Math.min(100, (currentCount / parseInt(limitValue)) * 100);
  
  if (withinLimits && currentCount === 0) {
    // Don't show anything if zero and within limits
    return null;
  }

  if (!withinLimits) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limit Reached</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            You've reached your {entityName} limit ({limitValue}). Upgrade your subscription to add more.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 gap-2 bg-background"
            onClick={() => navigate('/settings')}
          >
            <Shield className="h-4 w-4" />
            View Plans
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Only show progress if we're approaching the limit (>70%) and not unlimited
  if (!isUnlimited && progressPercentage > 70) {
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{entityName} Usage</span>
          <span>{currentCount} / {limitValue}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        {progressPercentage > 90 && (
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex justify-between">
            <span>You're approaching your limit</span>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs"
              onClick={() => navigate('/settings')}
            >
              Upgrade
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default LimitIndicator;
