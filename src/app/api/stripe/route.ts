import Stripe from "stripe";
import prisma from "@/lib/db";

// Stripe webhook route
// Stripe will continue to invoke this route based on configured rate
// Can be tested with Stripe CLI or Ngrok
// Test Credit Card: 4242 4242 4242 4242
// E.g. https://0de1-2600-1700-38c8-4100-89af-4b68-f4d0-c78a.ngrok-free.app/api/stripe
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function POST(request: Request) {
  let event;
  // verify webhook signature
  try {
    const signature = request.headers.get("stripe-signature");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (error) {
    console.error("Failed to verify Stripe webhook.", error);
    return Response.json({ error: "Webhook Error" }, { status: 400 });
  }

  // fulfill order
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const email = event.data.object.customer_email!;
        console.log("Checkout session completed for:", email);
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            hasAccess: true,
          },
        });
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    // respond with 200 OK to Stripe to indicate successful receipt
    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to process Stripe webhook event.", error);
    return Response.json({ error: "Webhook Handling error" }, { status: 500 });
  }
}
