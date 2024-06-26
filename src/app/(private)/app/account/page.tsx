import SignOutBtn from "@/components/sign-out-btn";
import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import { checkAuth } from "@/lib/server-utils";

export default async function AccountPage() {
  const session = await checkAuth();
  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>
      <ContentBlock className="h-[500px] flex flex-col gap-3 items-center justify-center">
        <p>Logged in as {session.user.email}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}
