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
