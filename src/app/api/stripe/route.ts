import Stripe from "stripe";
import prisma from "@/lib/db";

// Stripe webhook route
export async function POST(request: Request) {
  let event;

  // Verify webhook signature
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

  // Fulfill order
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

    // Respond to webhook event
    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to process Stripe webhook event.", error);
    return Response.json({ error: "Webhook Handling error" }, { status: 500 });
  }
}
