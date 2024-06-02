import Branding from "@/components/branding";
import ContentBlock from "@/components/content-block";
import PetDetails from "@/components/pet-details";
import PetList from "@/components/pet-list";
import SearchForm from "@/components/search-form";
import Stats from "@/components/stats";

export default function DashboardPage() {
  return (
    <main>
      <div className="flex justify-between text-white py-8">
        <Branding />
        <Stats />
      </div>
      <div className="grid grid-cols-3 grid-rows-[45px_1fr] gap-4 h-[600px]">
        {/* sit in row 1 under col 1, span only 1 column in width */}
        <div className="row-start-1 row-span-1 col-start-1 col-span-1">
          <SearchForm />
        </div>

        {/* start in row 2; grow the row down to end of the grid. take one column width of space */}
        <div className="row-start-2 row-span-full col-start-1 col-span-1">
          <ContentBlock>
            <PetList />
          </ContentBlock>
        </div>

        <div className="row-start-1 row-span-full col-start-2 col-span-full">
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
}
