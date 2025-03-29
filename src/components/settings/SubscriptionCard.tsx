
import React, { useState } from "react";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, ReceiptText, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { SubscriptionStatus, createPortalSession, createCheckoutSession } from "@/lib/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionCardProps {
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const SubscriptionCard = ({ subscription, isLoading, onRefresh }: SubscriptionCardProps) => {
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsManaging(true);
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open subscription portal",
        variant: "destructive",
      });
    } finally {
      setIsManaging(false);
    }
  };

  const handleUpgradeSubscription = async (planId: string) => {
    try {
      setIsCheckingOut(true);
      const { url } = await createCheckoutSession(planId);
      window.location.href = url;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <BlurCard>
        <BlurCardHeader>
          <BlurCardTitle>Subscription & Billing</BlurCardTitle>
        </BlurCardHeader>
        <BlurCardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </BlurCardContent>
      </BlurCard>
    );
  }

  return (
    <BlurCard>
      <BlurCardHeader>
        <BlurCardTitle>Subscription & Billing</BlurCardTitle>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="space-y-4">
          {subscription?.active ? (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-md bg-card/40">
                <div className="flex flex-col mb-4 md:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">Current Plan: <span className="text-primary">{subscription.plan?.name}</span></span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Active
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subscription.plan?.currency}{subscription.plan?.price / 100}/{subscription.plan?.interval}
                  </span>
                  {subscription.current_period_end && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>
                        Renews on {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
                        {subscription.cancel_at_period_end && " (Cancels after this period)"}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleManageSubscription}
                  disabled={isManaging}
                >
                  {isManaging ? "Opening..." : "Manage Subscription"}
                  <ArrowUpRight size={16} />
                </Button>
              </div>

              {subscription.payment_method && (
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-medium">Payment Method</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.payment_method.type === 'card' 
                          ? `Card ending in ${subscription.payment_method.last4}`
                          : 'Payment method on file'}
                      </span>
                      {subscription.payment_method.type === 'card' && (
                        <span className="text-xs text-muted-foreground">
                          Expires {subscription.payment_method.exp_month}/{subscription.payment_method.exp_year}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleManageSubscription} disabled={isManaging}>
                    Update
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <ReceiptText className="h-6 w-6 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">Billing History</span>
                    <span className="text-sm text-muted-foreground">View past invoices and payment history</span>
                  </div>
                </div>
                <Button variant="outline" onClick={handleManageSubscription} disabled={isManaging}>
                  View Invoices
                </Button>
              </div>
            </>
          ) : (
            <>
              <Alert>
                <AlertDescription>
                  You currently don't have an active subscription. Choose a plan below to get started.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Basic Plan */}
                <div className="border rounded-lg p-4 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Basic</h3>
                    <p className="text-sm text-muted-foreground">For small businesses</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Up to 100 waitlist entries per month</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Email notifications</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Single location</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleUpgradeSubscription('basic')}
                    disabled={isCheckingOut}
                    className="w-full"
                  >
                    {isCheckingOut ? "Processing..." : "Subscribe"}
                  </Button>
                </div>
                
                {/* Professional Plan */}
                <div className="border rounded-lg p-4 flex flex-col h-full relative bg-primary/5 border-primary/30">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Professional</h3>
                    <p className="text-sm text-muted-foreground">Perfect for growing businesses</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹1,999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Unlimited waitlist entries</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>SMS & email notifications</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Up to 3 locations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleUpgradeSubscription('professional')}
                    disabled={isCheckingOut}
                    className="w-full"
                  >
                    {isCheckingOut ? "Processing..." : "Subscribe"}
                  </Button>
                </div>
                
                {/* Enterprise Plan */}
                <div className="border rounded-lg p-4 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Enterprise</h3>
                    <p className="text-sm text-muted-foreground">For large establishments</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹4,999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Unlimited everything</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Unlimited locations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>White-label options</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>24/7 premium support</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleUpgradeSubscription('enterprise')}
                    disabled={isCheckingOut}
                    className="w-full"
                  >
                    {isCheckingOut ? "Processing..." : "Subscribe"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </BlurCardContent>
    </BlurCard>
  );
};
