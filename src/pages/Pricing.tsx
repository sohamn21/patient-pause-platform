
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = React.useState('monthly');
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      description: 'Essential features for small businesses just getting started',
      monthlyPrice: '₹999',
      yearlyPrice: '₹9,990',
      yearlyDiscount: 'Save ₹1,998',
      features: [
        'Up to 3 waitlists',
        'Single location',
        'Basic analytics',
        'Email notifications',
        'Maximum 100 customers per day',
        'Standard support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Premium',
      description: 'Advanced features for growing businesses with multiple locations',
      monthlyPrice: '₹1,999',
      yearlyPrice: '₹19,990',
      yearlyDiscount: 'Save ₹3,998',
      features: [
        'Unlimited waitlists',
        'Up to 3 locations',
        'Advanced analytics',
        'SMS & email notifications',
        'Maximum 500 customers per day',
        'Priority support',
        'Custom branding'
      ],
      cta: 'Go Premium',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive solution for large businesses with multiple branches',
      monthlyPrice: '₹4,999',
      yearlyPrice: '₹49,990',
      yearlyDiscount: 'Save ₹9,998',
      features: [
        'Unlimited waitlists',
        'Unlimited locations',
        'Enterprise-grade analytics',
        'SMS, email & WhatsApp notifications',
        'Unlimited customers',
        '24/7 dedicated support',
        'Custom branding',
        'API access',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const handleSubscribe = (plan: string) => {
    // In a real app, this would redirect to a checkout page
    console.log(`Subscribing to ${plan} plan with ${billingCycle} billing`);
    navigate('/signin');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. All plans come with a 14-day free trial.
        </p>
        
        <div className="mt-6 inline-block">
          <Tabs defaultValue="monthly" value={billingCycle} onValueChange={setBillingCycle} className="w-[250px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {billingCycle === 'yearly' && (
          <p className="mt-2 text-green-600 dark:text-green-400">Save up to 20% with annual billing</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`flex flex-col ${plan.highlighted ? 'border-primary shadow-lg relative overflow-hidden' : ''}`}>
            {plan.highlighted && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-muted-foreground ml-2">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
                
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {plan.yearlyDiscount}
                  </p>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.name)}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I change my plan later?</h3>
            <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be prorated.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Is there a contract or commitment?</h3>
            <p className="text-muted-foreground">No long-term contracts. You can cancel your subscription at any time without penalties.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">How does the 14-day trial work?</h3>
            <p className="text-muted-foreground">Your trial starts when you create an account. You can explore all features without any payment information required.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Do you offer custom plans?</h3>
            <p className="text-muted-foreground">Yes, for large businesses with specific needs, we offer custom enterprise solutions. Contact our sales team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
