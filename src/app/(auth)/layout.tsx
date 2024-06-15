import Logo from "@/components/logo";
import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col items-center gap-y-5 justify-center min-h-screen bg-white/75">
      <Logo />
      {children}
    </div>
  );
}
