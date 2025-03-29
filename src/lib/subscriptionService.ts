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

export type PaymentMethod = {
  type: string;
  last4: string;
  exp_month: number;
  exp_year: number;
};

export type SubscriptionStatus = {
  active: boolean;
  plan: SubscriptionPlan | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  payment_method: PaymentMethod | null;
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
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .single();
    
    if (error) throw error;
    
    const plan = subscriptionPlans.find(p => p.id === data.plan_id);
    
    let paymentMethod: PaymentMethod | null = null;
    if (data.payment_method) {
      try {
        const parsedMethod = typeof data.payment_method === 'string' 
          ? JSON.parse(data.payment_method) 
          : data.payment_method;
          
        if (parsedMethod && 
            typeof parsedMethod.type === 'string' && 
            typeof parsedMethod.last4 === 'string' && 
            typeof parsedMethod.exp_month === 'number' && 
            typeof parsedMethod.exp_year === 'number') {
          paymentMethod = {
            type: parsedMethod.type,
            last4: parsedMethod.last4,
            exp_month: parsedMethod.exp_month,
            exp_year: parsedMethod.exp_year
          };
        }
      } catch (e) {
        console.error('Error parsing payment method:', e);
      }
    }
    
    return {
      active: data.active,
      plan: plan || null,
      current_period_end: data.current_period_end,
      cancel_at_period_end: data.cancel_at_period_end,
      payment_method: paymentMethod
    };
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
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: JSON.stringify({ planId })
  });

  if (error) throw error;
  
  return data;
};

export const createPortalSession = async (): Promise<{ url: string }> => {
  const { data, error } = await supabase.functions.invoke('create-portal');

  if (error) throw error;
  
  return data;
};

export const updatePaymentMethod = async (): Promise<{ url: string }> => {
  const { data, error } = await supabase.functions.invoke('update-payment');

  if (error) throw error;
  
  return data;
};

export const getInvoices = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-invoices');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};
