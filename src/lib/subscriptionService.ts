
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

// Get the current subscription for a user - for now, we'll use mock data
export const getCurrentSubscription = async (): Promise<SubscriptionStatus> => {
  try {
    // Mock data instead of calling Supabase function
    // In a production environment, this would be replaced with the real API call
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response for testing
    // You can modify this to test different subscription states
    const mockSubscription: SubscriptionStatus = {
      active: true,
      plan: subscriptionPlans[1], // Professional plan
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      cancel_at_period_end: false,
      payment_method: {
        type: 'card',
        last4: '4242',
        exp_month: 12,
        exp_year: 2024
      }
    };
    
    return mockSubscription;
    
    // Commented out real implementation for later use with Stripe
    // const { data, error } = await supabase.functions.invoke('get-subscription');
    // if (error) throw error;
    // return data;
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

// Initiate a checkout session for subscription
export const createCheckoutSession = async (planId: string): Promise<{ url: string }> => {
  try {
    // For now, simulate a successful checkout with mock data
    console.log(`Creating checkout session for plan: ${planId}`);
    
    // Return a mock URL that redirects back to the settings page with success parameter
    return { url: '/settings?success=true' };
    
    // Real implementation for later
    // const { data, error } = await supabase.functions.invoke('create-checkout', {
    //   body: { planId }
    // });
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create a portal session for managing subscription
export const createPortalSession = async (): Promise<{ url: string }> => {
  try {
    // Return a mock URL for now
    return { url: '/settings' };
    
    // Real implementation for later
    // const { data, error } = await supabase.functions.invoke('create-portal');
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Update payment method
export const updatePaymentMethod = async (): Promise<{ url: string }> => {
  try {
    // Return a mock URL for now
    return { url: '/settings' };
    
    // Real implementation for later
    // const { data, error } = await supabase.functions.invoke('update-payment-method');
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

// Get subscription invoices
export const getInvoices = async () => {
  try {
    // Return mock data for now
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    return [
      {
        id: 'inv_mock1',
        number: 'INV-001',
        status: 'paid',
        amount_paid: 1999,
        currency: 'inr',
        created: Date.now() - 86400000 * 30, // 30 days ago
        invoice_pdf: '#',
        hosted_invoice_url: '#'
      },
      {
        id: 'inv_mock2',
        number: 'INV-002',
        status: 'paid',
        amount_paid: 1999,
        currency: 'inr',
        created: Date.now() - 86400000 * 60, // 60 days ago
        invoice_pdf: '#',
        hosted_invoice_url: '#'
      }
    ];
    
    // Real implementation for later
    // const { data, error } = await supabase.functions.invoke('get-invoices');
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};
