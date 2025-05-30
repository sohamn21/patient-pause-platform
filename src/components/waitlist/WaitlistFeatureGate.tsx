
import React from "react";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { LimitIndicator } from "@/components/subscription/LimitIndicator";
import { useSubscription } from "@/context/SubscriptionContext";
import { isWithinLimits } from "@/lib/subscriptionFeatures";

interface WaitlistFeatureGateProps {
  waitlistCount: number;
  children: React.ReactNode;
}

export const WaitlistFeatureGate = ({ 
  waitlistCount,
  children 
}: WaitlistFeatureGateProps) => {
  const { subscription } = useSubscription();
  
  const canCreateWaitlist = isWithinLimits('maxWaitlists', waitlistCount, subscription?.plan);

  return (
    <>
      <LimitIndicator 
        feature="maxWaitlists"
        currentCount={waitlistCount}
        plan={subscription?.plan}
        entityName="Waitlist"
      />
      
      {canCreateWaitlist ? (
        children
      ) : (
        <FeatureGate feature="maxWaitlists" plan={subscription?.plan}>
          {children}
        </FeatureGate>
      )}
    </>
  );
};

export default WaitlistFeatureGate;
