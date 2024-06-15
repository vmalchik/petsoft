import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-w-60">
      <H1 className="text-center mb-5">Log In</H1>
      <AuthForm />
      <p className="mt-6 text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/signup" className="mt-6 text-sm text-zinc-500 font-medium">
          Sign up
        </Link>
      </p>
    </main>
  );
}
