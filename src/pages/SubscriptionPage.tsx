
import React from "react";
import { SubscriptionDashboard } from "@/components/subscription/SubscriptionDashboard";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

const SubscriptionPage = () => {
  return (
    <SubscriptionProvider>
      <SubscriptionDashboard />
    </SubscriptionProvider>
  );
};

export default SubscriptionPage;
