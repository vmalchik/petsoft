import H1 from "./h1";

export default function Branding() {
  return (
    <section>
      {/* design trick to make text a little bolder to add interesting styling */}
      {/* line-hight is set to improve readability by adding/lowering distance between lines of text*/}
      <H1>
        Pet<span className="font-semibold">Soft</span>
      </H1>
      {/* de-emphasis text using opacity */}
      <p className="text-lg opacity-80">Manage your pet daycare with ease</p>
    </section>
  );
}
