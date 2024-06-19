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

export default function AuthForm({ type }: AuthFormProps) {
  // type === "login" ? login : signup
  // Note: this is a different hook from useFormStatus in auth-form-btn.tsx
  //       main reason to use this hook is to preserve progressive enhancement including with error state
  const [signUpError, dispatchSignUpAction] = useFormState(signup, undefined);
  const [loginError, dispatchLoginAction] = useFormState(login, undefined);
  return (
    // Redirect to desired location based on callback in URL. Note: doing () => fn() would lose progressive enhancement
    // <form action={() => { await login(); Router.push(// callback URL value"); }}>
    // progressive enhancement enabled for this form
    <form
      action={type === "login" ? dispatchLoginAction : dispatchSignUpAction}
    >
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email" // must be provided for next-auth to work
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-1 mt-2 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password" // must be provided for next-auth to work
          required
          autoComplete="current-password"
        />
      </div>
      <AuthFormBtn type={type} />
      {signUpError && <ErrorMessage message={signUpError.message} />}
      {loginError && <ErrorMessage message={loginError.message} />}
    </form>
  );
}

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-red-500 text-sm mt-2">{message}</p>
);
