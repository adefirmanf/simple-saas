import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      
      if (!session.subscription) {
        break
      }

      // Payment successful
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      // Get period end from the first subscription item
      const periodEnd = subscription.items.data[0]?.current_period_end

      if (!periodEnd) {
        console.error("No current_period_end found on subscription item")
        break
      }

      // Update user with subscription info
      await prisma.user.update({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
        },
      })
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      
      // Check if this invoice is related to a subscription
      const subscriptionId = invoice.parent?.subscription_details?.subscription
      
      if (!subscriptionId) {
        // This might be a one-time payment, not a subscription
        break
      }

      // Update subscription period end date
      const subscription = await stripe.subscriptions.retrieve(
        typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id
      )

      const periodEnd = subscription.items.data[0]?.current_period_end

      if (!periodEnd) {
        console.error("No current_period_end found on subscription item")
        break
      }

      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription

      const periodEnd = subscription.items.data[0]?.current_period_end

      if (!periodEnd) {
        console.error("No current_period_end found on subscription item")
        break
      }

      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription

      // Reset subscription fields when canceled
      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      })
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new NextResponse(null, { status: 200 })
}
