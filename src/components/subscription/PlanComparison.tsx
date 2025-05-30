
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { subscriptionPlans, createCheckoutSession } from "@/lib/subscriptionService";
import { useSubscription } from "@/context/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

export const PlanComparison = () => {
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = React.useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setIsCheckingOut(planId);
      const { url } = await createCheckoutSession(planId);
      window.open(url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.active && subscription.plan?.id === planId;
  };

  const features = [
    'Waitlist entries per month',
    'Analytics',
    'Email notifications',
    'SMS notifications',
    'Locations',
    'Priority support',
    'Custom branding'
  ];

  const getFeatureValue = (planId: string, feature: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return { available: false, value: '' };

    switch (feature) {
      case 'Waitlist entries per month':
        return planId === 'basic' ? { available: true, value: '100' } : { available: true, value: 'Unlimited' };
      case 'Analytics':
        return planId === 'basic' ? { available: true, value: 'Basic' } : { available: true, value: 'Advanced' };
      case 'Email notifications':
        return { available: true, value: '✓' };
      case 'SMS notifications':
        return planId === 'basic' ? { available: false, value: '' } : { available: true, value: '✓' };
      case 'Locations':
        return planId === 'basic' ? { available: true, value: '1' } : 
               planId === 'professional' ? { available: true, value: '3' } : 
               { available: true, value: 'Unlimited' };
      case 'Priority support':
        return planId === 'basic' ? { available: false, value: '' } : { available: true, value: '✓' };
      case 'Custom branding':
        return planId === 'enterprise' ? { available: true, value: '✓' } : { available: false, value: '' };
      default:
        return { available: false, value: '' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select the perfect plan for your business needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.id === 'professional' ? 'border-primary shadow-lg' : ''} ${
              isCurrentPlan(plan.id) ? 'ring-2 ring-green-500' : ''
            }`}
          >
            {plan.id === 'professional' && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                <Star className="inline h-3 w-3 mr-1" />
                Most Popular
              </div>
            )}
            
            {isCurrentPlan(plan.id) && (
              <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-br-lg rounded-tl-lg">
                Current Plan
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {plan.currency}{plan.price / 100}
                  <span className="text-base font-normal text-muted-foreground">
                    /{plan.interval}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature) => {
                  const featureData = getFeatureValue(plan.id, feature);
                  return (
                    <div key={feature} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{feature}</span>
                      <div className="flex items-center">
                        {featureData.available ? (
                          <>
                            <span className="mr-2">{featureData.value}</span>
                            <Check className="h-4 w-4 text-green-500" />
                          </>
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCheckingOut === plan.id || isCurrentPlan(plan.id)}
                className={`w-full ${plan.id === 'professional' ? '' : 'variant-outline'}`}
                variant={plan.id === 'professional' ? 'default' : 'outline'}
              >
                {isCheckingOut === plan.id ? (
                  "Processing..."
                ) : isCurrentPlan(plan.id) ? (
                  "Current Plan"
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
