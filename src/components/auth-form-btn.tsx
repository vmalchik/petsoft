"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type AuthFormBtnProps = {
  type: "login" | "signup";
};

export default function AuthFormBtn({ type }: AuthFormBtnProps) {
  // Hook can only be used in a component that is a child of a form element
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {type === "login" ? "Log in" : "Sign up"}
    </Button>
  );
}
