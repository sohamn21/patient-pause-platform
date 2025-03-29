
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// Map Stripe price IDs to plan information
const planDetails = {
  'price_basic': {
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
  'price_professional': {
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
  'price_enterprise': {
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
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // No customer found, return inactive subscription
      return new Response(
        JSON.stringify({
          active: false,
          plan: null,
          current_period_end: null,
          cancel_at_period_end: false,
          payment_method: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customerId = customers.data[0].id;

    // Get subscriptions for customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No active subscription found
      return new Response(
        JSON.stringify({
          active: false,
          plan: null,
          current_period_end: null,
          cancel_at_period_end: false,
          payment_method: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    // Get payment method
    let paymentMethod = null;
    if (subscription.default_payment_method) {
      const pm = subscription.default_payment_method;
      paymentMethod = {
        type: pm.type,
        last4: pm.card ? pm.card.last4 : '****',
        exp_month: pm.card ? pm.card.exp_month : 0,
        exp_year: pm.card ? pm.card.exp_year : 0
      };
    }

    // Return subscription details
    return new Response(
      JSON.stringify({
        active: subscription.status === 'active',
        plan: planDetails[priceId] || null,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        payment_method: paymentMethod
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
