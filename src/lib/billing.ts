// Future Stripe Billing Integration
// This file will contain billing utilities and configurations

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface BillingState {
  subscription: SubscriptionPlan | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
}

// Placeholder subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Basic procurement tools',
      'Limited usage per month',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    features: [
      'All procurement tools',
      'Unlimited usage',
      'Priority support',
      'Advanced analytics',
      'Export capabilities'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Team collaboration',
      'White-label options'
    ]
  }
];

// Placeholder functions for future implementation
export const useBilling = () => {
  return {
    subscription: null,
    isLoading: false,
    hasActiveSubscription: false,
    createCheckoutSession: (planId: string) => Promise.resolve(),
    cancelSubscription: () => Promise.resolve(),
    updateSubscription: (planId: string) => Promise.resolve(),
  };
};

export const canAccessFeature = (feature: string, subscription?: SubscriptionPlan): boolean => {
  // This will check if the user's subscription allows access to a specific feature
  return true; // For now, allow all features
}; 