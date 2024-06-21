"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

// Typed based on NextJS docs
// https://nextjs.org/docs/app/api-reference/file-conventions/page
type PaymentPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

// useSearchParams() can be used inside client-side components
// page components are special and provide searchParams as props
export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const [isPending, startTransition] = useTransition();
  const { success, cancelled } = searchParams;
  const showButton = success !== "true";
  const paymentSuccessful = Boolean(success);
  const paymentCancelled = Boolean(cancelled);

  return (
    <main className="min-w-60 flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      {showButton && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}
      {paymentSuccessful && (
        <p className="text-lg text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {paymentCancelled && (
        <p className="text-lg text-red-500">
          Payment cancelled! You can try again.
        </p>
      )}
    </main>
  );
}
