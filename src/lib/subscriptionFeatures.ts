
import { SubscriptionPlan } from "@/lib/subscriptionService";

// Define feature access by plan level
export type FeatureLimits = {
  maxWaitlists: number;
  maxLocations: number;
  maxCustomersPerDay: number;
  hasAdvancedAnalytics: boolean;
  hasSmsNotifications: boolean;
  hasEmailNotifications: boolean;
  hasWhitelabel: boolean;
  hasCustomBranding: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
};

// Define the base free tier limits
const freeTierLimits: FeatureLimits = {
  maxWaitlists: 1,
  maxLocations: 1,
  maxCustomersPerDay: 50,
  hasAdvancedAnalytics: false,
  hasSmsNotifications: false,
  hasEmailNotifications: true,
  hasWhitelabel: false,
  hasCustomBranding: false,
  hasApiAccess: false,
  hasPrioritySupport: false,
};

// Map subscription plans to feature limits
export const getFeatureLimits = (plan: SubscriptionPlan | null): FeatureLimits => {
  if (!plan) return freeTierLimits;
  
  switch (plan.id) {
    case 'basic':
      return {
        maxWaitlists: 3,
        maxLocations: 1,
        maxCustomersPerDay: 100,
        hasAdvancedAnalytics: false,
        hasSmsNotifications: false,
        hasEmailNotifications: true,
        hasWhitelabel: false,
        hasCustomBranding: false,
        hasApiAccess: false,
        hasPrioritySupport: false,
      };
    case 'professional':
      return {
        maxWaitlists: 10,
        maxLocations: 3,
        maxCustomersPerDay: 500,
        hasAdvancedAnalytics: true,
        hasSmsNotifications: true,
        hasEmailNotifications: true,
        hasWhitelabel: false,
        hasCustomBranding: true,
        hasApiAccess: false,
        hasPrioritySupport: true,
      };
    case 'enterprise':
      return {
        maxWaitlists: -1, // Unlimited
        maxLocations: -1, // Unlimited
        maxCustomersPerDay: -1, // Unlimited
        hasAdvancedAnalytics: true,
        hasSmsNotifications: true,
        hasEmailNotifications: true,
        hasWhitelabel: true,
        hasCustomBranding: true,
        hasApiAccess: true,
        hasPrioritySupport: true,
      };
    default:
      return freeTierLimits;
  }
};

// Helper to check if a user has access to a specific feature
export const hasFeatureAccess = (
  feature: keyof FeatureLimits, 
  plan: SubscriptionPlan | null
): boolean => {
  const limits = getFeatureLimits(plan);
  const value = limits[feature];
  
  // For numeric limits, -1 means unlimited, any positive number is the limit
  if (typeof value === 'number') {
    return value === -1 || value > 0;
  }
  
  // For boolean features
  return !!value;
};

// Helper to check if a user is within their numeric limits
export const isWithinLimits = (
  feature: 'maxWaitlists' | 'maxLocations' | 'maxCustomersPerDay',
  currentCount: number,
  plan: SubscriptionPlan | null
): boolean => {
  const limits = getFeatureLimits(plan);
  const limit = limits[feature];
  
  // -1 means unlimited
  return limit === -1 || currentCount < limit;
};

// Get a human-readable description of the limit
export const getLimitDescription = (
  feature: 'maxWaitlists' | 'maxLocations' | 'maxCustomersPerDay',
  plan: SubscriptionPlan | null
): string => {
  const limits = getFeatureLimits(plan);
  const limit = limits[feature];
  
  return limit === -1 ? 'Unlimited' : limit.toString();
};
