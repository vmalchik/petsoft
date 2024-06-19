import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  return (
    <main className="min-w-60 flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      <Button>Buy lifetime access for $299</Button>
    </main>
  );
}
