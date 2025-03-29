
import React, { useState, useEffect } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { getCurrentSubscription, SubscriptionStatus } from "@/lib/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const BillingDetails = () => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    fetchSubscription();

    if (success === 'true') {
      toast({
        title: "Subscription Successful",
        description: "Your subscription has been activated successfully.",
        // Remove the icon property as it's not in the Toast type
      });
    } else if (canceled === 'true') {
      toast({
        title: "Checkout Canceled",
        description: "You've canceled the checkout process.",
        variant: "default"
      });
    }
  }, [success, canceled]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const data = await getCurrentSubscription();
      setSubscription(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load subscription details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {(success === 'true' || canceled === 'true') && (
        <Alert 
          className={`mb-6 ${success === 'true' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : ''}`}
          variant={success === 'true' ? 'default' : 'default'}
        >
          {success === 'true' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>
            {success === 'true' ? 'Subscription Activated' : 'Checkout Canceled'}
          </AlertTitle>
          <AlertDescription>
            {success === 'true' 
              ? 'Your subscription has been activated successfully. You now have access to all features of your plan.'
              : 'You\'ve canceled the checkout process. You can subscribe anytime when you\'re ready.'}
          </AlertDescription>
        </Alert>
      )}
      
      <SubscriptionCard
        subscription={subscription}
        isLoading={isLoading}
        onRefresh={fetchSubscription}
      />
    </>
  );
};
