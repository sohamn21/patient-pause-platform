
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CreditCard, Receipt, Calendar } from "lucide-react";
import { format } from "date-fns";
import { SubscriptionStatus } from "@/lib/subscriptionService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BillingSummaryProps {
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
}

export const BillingSummary = ({ subscription, isLoading }: BillingSummaryProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription?.active) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              No active subscription
            </p>
            <Button onClick={() => navigate('/settings')}>
              Choose a Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.plan?.name} ({subscription.plan?.currency}{(subscription.plan?.price || 0) / 100}/{subscription.plan?.interval})
                </p>
              </div>
            </div>
            <Button variant="ghost" className="text-primary" size="sm">
              View Details <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Next Billing Date</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.current_period_end 
                    ? format(new Date(subscription.current_period_end), "MMMM d, yyyy") 
                    : "Not available"}
                  {subscription.cancel_at_period_end && " (Cancels after this billing cycle)"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.payment_method 
                    ? `${subscription.payment_method.type === 'card' ? 'Card ending in ' + subscription.payment_method.last4 : 'Other payment method'}`
                    : "No payment method on file"}
                </p>
              </div>
            </div>
            <Button variant="ghost" className="text-primary" size="sm">
              Update <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
