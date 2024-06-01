import BackgroundPattern from "@/components/background-pattern";
import Footer from "@/components/footer";
import Header from "@/components/header";

type PrivateLayoutProps = {
  readonly children: React.ReactNode;
};

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <>
      <BackgroundPattern />
      {/* when you have max-width you can use margin auto to center the other axis */}
      {/* add padding to prevent page elements being next to edge of the browser window on smaller screen sizes */}
      <div className="max-w-[1050px] mx-auto px-4">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
