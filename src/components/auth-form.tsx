import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login, signup } from "@/actions/actions";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    // Redirect to desired location based on callback in URL
    // <form action={() => { await login(); Router.push(// callback URL value"); }}>
    <form action={type === "login" ? login : signup}>
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
      <Button type="submit">{type === "login" ? "Log in" : "Sign up"}</Button>
    </form>
  );
}
