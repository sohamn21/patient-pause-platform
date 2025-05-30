
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Crown, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { useSubscription } from "@/context/SubscriptionContext";
import { createPortalSession } from "@/lib/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionStatus = () => {
  const { subscription, isLoading, refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const [isManaging, setIsManaging] = React.useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsManaging(true);
      const { url } = await createPortalSession();
      window.open(url, '_blank');
      
      // Refresh subscription after portal session
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subscription?.active ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </Badge>
                <span className="font-semibold text-lg">
                  {subscription.plan?.name} Plan
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {subscription.plan?.currency}{subscription.plan?.price / 100}/{subscription.plan?.interval}
              </span>
            </div>

            {subscription.current_period_end && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {subscription.cancel_at_period_end ? 'Cancels' : 'Renews'} on{' '}
                  {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
                </span>
              </div>
            )}

            {subscription.payment_method && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>
                  {subscription.payment_method.type === 'card' 
                    ? `Card ending in ${subscription.payment_method.last4}`
                    : 'Payment method on file'}
                </span>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={isManaging}
              className="w-full"
            >
              {isManaging ? "Opening..." : "Manage Subscription"}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                Free Tier
              </Badge>
              <p className="text-sm text-muted-foreground">
                You're currently on the free tier with limited features.
              </p>
            </div>
            <Button onClick={() => window.location.href = '/pricing'} className="w-full">
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
