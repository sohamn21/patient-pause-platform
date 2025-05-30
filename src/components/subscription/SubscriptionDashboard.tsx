
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { PlanComparison } from "./PlanComparison";
import { UsageMetrics } from "./UsageMetrics";
import { BillingHistory } from "@/components/settings/BillingHistory";
import { SubscriptionFeaturesList } from "@/components/dashboard/SubscriptionFeaturesList";
import { useSubscription } from "@/context/SubscriptionContext";

export const SubscriptionDashboard = () => {
  const { subscription } = useSubscription();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view usage, and upgrade your plan
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubscriptionStatus />
        </div>
        <div>
          <UsageMetrics />
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <PlanComparison />
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <SubscriptionFeaturesList subscription={subscription} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingHistory />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <UsageMetrics />
            <SubscriptionFeaturesList subscription={subscription} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
