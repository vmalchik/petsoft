"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type PaymentPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const { data: session, update, status } = useSession();
  const router = useRouter();
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
        <>
          <Button
            disabled={status === "loading" || session?.user.hasAccess}
            onClick={async () => {
              // Request updated JWT with new access privileges
              await update(true);
              // Attempt to access dashboard with updated JWT
              router.push(Routes.Dashboard);
            }}
          >
            Access PetSoft
          </Button>
          <p className="text-lg text-green-700">
            Payment successful! You now have lifetime access to PetSoft.
          </p>
        </>
      )}
      {paymentCancelled && (
        <p className="text-lg text-red-500">
          Payment cancelled! You can try again.
        </p>
      )}
    </main>
  );
}
