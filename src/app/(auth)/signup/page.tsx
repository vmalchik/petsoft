import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import { Routes } from "@/lib/constants";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-w-60">
      <H1 className="text-center mb-5">Sign Up</H1>
      <AuthForm type="signup" />
      <p className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href={Routes.Login}
          className="mt-6 text-sm text-zinc-500 font-medium"
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
