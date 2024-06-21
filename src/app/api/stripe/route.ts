import prisma from "@/lib/db";

// Stripe webhook route
// Stripe will continue to invoke this route based on configured rate
// Can be tested with Stripe CLI or Ngrok

// E.g. https://0de1-2600-1700-38c8-4100-89af-4b68-f4d0-c78a.ngrok-free.app/api/stripe
export async function POST(request: Request) {
  const data = await request.json();

  // verify webhook came from Stripe

  // fulfill order
  const email = data.data.object.customer_email;
  console.log("email", email);
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      hasAccess: true,
    },
  });

  // respond with 200 OK to Stripe to indicate successful receipt
  return Response.json(null, { status: 200 });
}
