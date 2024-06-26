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
          startTransition(async () => {
            const data = await logout();
            data && setError(data?.error?.message || "Failed to sign out");
          });
        }}
      >
        Sign out
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
}
