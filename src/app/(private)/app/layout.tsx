// "use client";
// "use client" and "use server" directives act as a boundary between client and server components
// Don't want to make this a client component because we are fetching data here which is best done on the server (faster, more secure)
// turning this into a client component creates everything imported (all components) to be client components
// NextJS best practice is to use client components as low in the component tree as possible (ideally in the leaf nodes)
import BackgroundPattern from "@/components/background-pattern";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import { checkAuth, getAllPetsByUserId } from "@/lib/server-utils";

type PrivateLayoutProps = {
  readonly children: React.ReactNode;
};

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await checkAuth();
  const pets = await getAllPetsByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />
      {/* when you have max-width you can use margin auto to center the other axis */}
      {/* add padding to prevent page elements being next to edge of the browser window on smaller screen sizes */}
      <div className="min-h-screen max-w-[1050px] mx-auto px-4 flex flex-col">
        <Header />
        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </>
  );
}
