import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Pricing plans
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: '', // No Stripe price needed for free plan
    features: [
      'Up to 10 URLs',
      'Basic analytics',
      'Community support',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      'Unlimited URLs',
      'Advanced analytics',
      'Priority support',
      'Custom short codes',
      'API access',
    ],
  },
  BUSINESS: {
    name: 'Business',
    price: 29.99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'White-label branding',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
} as const

export type PlanType = keyof typeof PLANS
