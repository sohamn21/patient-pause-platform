
import React from "react";
import { SubscriptionStatus } from "@/lib/subscriptionService";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { LimitIndicator } from "@/components/subscription/LimitIndicator";

interface WaitlistFeatureGateProps {
  subscription: SubscriptionStatus | null;
  waitlistCount: number;
  children: React.ReactNode;
}

export const WaitlistFeatureGate = ({ 
  subscription, 
  waitlistCount,
  children 
}: WaitlistFeatureGateProps) => {
  return (
    <>
      <LimitIndicator 
        feature="maxWaitlists"
        currentCount={waitlistCount}
        plan={subscription?.plan}
        entityName="Waitlist"
      />
      
      {/* If we're at the limit, block the content with the gate */}
      {!subscription?.active && waitlistCount >= 1 ? (
        <FeatureGate feature="maxWaitlists" plan={subscription?.plan}>
          {children}
        </FeatureGate>
      ) : waitlistCount >= 3 && subscription?.plan?.id === 'basic' ? (
        <FeatureGate feature="maxWaitlists" plan={subscription?.plan}>
          {children}
        </FeatureGate>
      ) : waitlistCount >= 10 && subscription?.plan?.id === 'professional' ? (
        <FeatureGate feature="maxWaitlists" plan={subscription?.plan}>
          {children}
        </FeatureGate>
      ) : (
        children
      )}
    </>
  );
};

export default WaitlistFeatureGate;
