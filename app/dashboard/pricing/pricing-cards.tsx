"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { createCheckoutSession, createPortalSession } from "./actions"

interface Plan {
  name: string
  price: number
  priceId: string
  features: readonly string[]
}

interface PricingCardsProps {
  plans: Record<string, Plan>
  currentPlan?: string | null
}

export function PricingCards({ plans, currentPlan }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planKey: string) => {
    try {
      setLoading(planKey)
      await createCheckoutSession(priceId)
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setLoading("manage")
      await createPortalSession()
    } catch (error) {
      console.error("Error creating portal session:", error)
      alert("Failed to open billing portal. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {Object.entries(plans).map(([key, plan]) => {
        const isCurrent = currentPlan === key
        const isPro = key === "PRO" || key === "BUSINESS"
        
        return (
          <div
            key={key}
            className={`relative rounded-lg border bg-card p-8 shadow-sm ${
              isPro ? "border-primary shadow-lg" : ""
            }`}
          >
            {isPro && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  POPULAR
                </span>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
            </div>

            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {key === "FREE" ? (
              <button
                disabled
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCurrent ? "Current Plan" : "Free Forever"}
              </button>
            ) : isCurrent ? (
              <button
                onClick={handleManageSubscription}
                disabled={loading === "manage"}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === "manage" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Manage Subscription"
                )}
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.priceId, key)}
                disabled={loading === key}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === key ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
