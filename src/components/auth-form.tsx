"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { login, signup } from "@/actions/actions";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";

type AuthFormProps = {
  type: "login" | "signup";
};

// Note: this page supports progressive enhancement
export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUpAction] = useFormState(signup, undefined);
  const [loginError, dispatchLoginAction] = useFormState(login, undefined);
  return (
    <form
      action={type === "login" ? dispatchLoginAction : dispatchSignUpAction}
    >
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-1 mt-2 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </div>
      <AuthFormBtn type={type} />
      {signUpError && (
        <ErrorMessage
          message={signUpError?.error?.message || "Signup failed"}
        />
      )}
      {loginError && (
        <ErrorMessage message={loginError?.error?.message || "Login failed"} />
      )}
    </form>
  );
}

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-red-500 text-sm mt-2">{message}</p>
);
