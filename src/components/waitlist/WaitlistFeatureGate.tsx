
import React from "react";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { LimitIndicator } from "@/components/subscription/LimitIndicator";
import { isWithinLimits } from "@/lib/subscriptionFeatures";
import { SubscriptionStatus } from "@/lib/subscriptionService";

interface WaitlistFeatureGateProps {
  waitlistCount: number;
  children: React.ReactNode;
  subscription?: SubscriptionStatus | null;
}

export const WaitlistFeatureGate = ({ 
  waitlistCount,
  children,
  subscription
}: WaitlistFeatureGateProps) => {
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
