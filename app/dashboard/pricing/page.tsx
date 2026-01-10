import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PLANS } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { PricingCards } from "./pricing-cards"

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id as string
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  // Determine current plan
  let currentPlan = "FREE"
  let isSubscribed = false

  if (user?.stripeSubscriptionId && user?.stripeCurrentPeriodEnd) {
    const now = new Date()
    if (user.stripeCurrentPeriodEnd > now) {
      isSubscribed = true
      // Determine which plan based on price ID
      if (user.stripePriceId === PLANS.PRO.priceId) {
        currentPlan = "PRO"
      } else if (user.stripePriceId === PLANS.BUSINESS.priceId) {
        currentPlan = "BUSINESS"
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-muted-foreground">
          Choose the perfect plan for your needs
        </p>
      </div>

      {searchParams.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          <p className="font-medium">Payment successful!</p>
          <p className="text-sm">Your subscription has been activated.</p>
        </div>
      )}

      {searchParams.canceled && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <p className="font-medium">Payment canceled</p>
          <p className="text-sm">
            Your subscription was not activated. You can try again anytime.
          </p>
        </div>
      )}

      {isSubscribed && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold">Current Subscription</h2>
          <p className="mt-2 text-muted-foreground">
            You are currently subscribed to the <strong>{currentPlan}</strong> plan.
          </p>
          {user?.stripeCurrentPeriodEnd && (
            <p className="mt-1 text-sm text-muted-foreground">
              Next billing date:{" "}
              {user.stripeCurrentPeriodEnd.toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <PricingCards
        plans={PLANS}
        currentPlan={currentPlan}
      />

      <div className="rounded-lg border bg-muted/40 p-6">
        <h3 className="text-lg font-semibold">Stripe Sandbox Mode</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a test environment using Stripe sandbox. Use test card:{" "}
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
            4242 4242 4242 4242
          </code>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use any future expiry date, any 3-digit CVC, and any billing details.
        </p>
      </div>
    </div>
  )
}
