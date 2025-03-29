import { supabase } from "@/integrations/supabase/client";

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
};

export type SubscriptionStatus = {
  active: boolean;
  plan: SubscriptionPlan | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  payment_method: {
    type: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'For small businesses just getting started',
    price: 999,
    currency: '₹',
    interval: 'monthly',
    features: [
      'Up to 100 waitlist entries per month',
      'Basic analytics',
      'Email notifications',
      'Single location'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Perfect for growing businesses',
    price: 1999,
    currency: '₹',
    interval: 'monthly',
    features: [
      'Unlimited waitlist entries',
      'Advanced analytics',
      'SMS & email notifications',
      'Up to 3 locations',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large establishments with multiple locations',
    price: 4999,
    currency: '₹',
    interval: 'monthly',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited locations',
      'White-label options',
      '24/7 premium support'
    ]
  }
];

export const getCurrentSubscription = async (): Promise<SubscriptionStatus> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockSubscription: SubscriptionStatus = {
      active: true,
      plan: subscriptionPlans[1],
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: false,
      payment_method: {
        type: 'card',
        last4: '4242',
        exp_month: 12,
        exp_year: 2024
      }
    };
    
    return mockSubscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return {
      active: false,
      plan: null,
      current_period_end: null,
      cancel_at_period_end: false,
      payment_method: null
    };
  }
};

export const checkSubscriptionAccess = async (requiredPlan: 'basic' | 'professional' | 'enterprise'): Promise<boolean> => {
  try {
    const subscription = await getCurrentSubscription();
    
    if (!subscription.active || !subscription.plan) {
      return false;
    }
    
    switch (requiredPlan) {
      case 'basic':
        return true;
      case 'professional':
        return ['professional', 'enterprise'].includes(subscription.plan.id);
      case 'enterprise':
        return subscription.plan.id === 'enterprise';
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking subscription access:', error);
    return false;
  }
};

export const createCheckoutSession = async (planId: string): Promise<{ url: string }> => {
  try {
    console.log(`Creating checkout session for plan: ${planId}`);
    
    return { url: '/settings?success=true' };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createPortalSession = async (): Promise<{ url: string }> => {
  try {
    return { url: '/settings' };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

export const updatePaymentMethod = async (): Promise<{ url: string }> => {
  try {
    return { url: '/settings' };
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'inv_mock1',
        number: 'INV-001',
        status: 'paid',
        amount_paid: 1999,
        currency: 'inr',
        created: Date.now() - 86400000 * 30,
        invoice_pdf: '#',
        hosted_invoice_url: '#'
      },
      {
        id: 'inv_mock2',
        number: 'INV-002',
        status: 'paid',
        amount_paid: 1999,
        currency: 'inr',
        created: Date.now() - 86400000 * 60,
        invoice_pdf: '#',
        hosted_invoice_url: '#'
      }
    ];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};
