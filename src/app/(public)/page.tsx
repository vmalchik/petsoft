import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-[#5DC9A8] min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10">
      {/* NextJS Image component usage */}
      {/* https://www.youtube.com/watch?v=IU_qq_c_lKA */}
      <Image
        // Use fill with sizes together
        // fill
        // sizes - provides information how wide image will be at different breakpoints to improve performance using fill or responsive
        priority
        quality={100} // 75 is default
        src="/petsoft-preview.png"
        alt="Petsoft product usage preview"
        // width and height are required for Image component to prevent layout shift
        width={519}
        height={472}
        style={{
          // width: "100%",
          maxWidth: "100%",
          height: "auto",
        }}
        className="rounded-xl"
      />

      <div className="">
        <Logo />
        <h1 className="text-5xl font-semibold my-6 max-w-[500px]">
          Manage your <span className="font-extrabold">pet daycare</span> with
          ease
        </h1>
        <p className="text-2xl font-medium max-w-[600px]">
          Use PetSoft to easily keep track of pets under your care. Get lifetime
          access for $299.
        </p>
        <div className="mt-10 space-x-3">
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
