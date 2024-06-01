import Branding from "@/components/branding";
import Stats from "@/components/stats";

export default function DashboardPage() {
  return (
    <main>
      <div className="flex justify-between text-white py-8">
        <Branding />
        <Stats />
      </div>
    </main>
  );
}
