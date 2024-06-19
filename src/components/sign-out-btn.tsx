"use client";

import React, { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { logout } from "@/actions/actions";

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => {
          // https://react.dev/reference/rsc/use-server#calling-a-server-action-outside-of-form
          startTransition(async () => {
            const error = await logout();
            error && setError(error?.message || "Failed to sign out");
          });
        }}
      >
        Sign out
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
}
