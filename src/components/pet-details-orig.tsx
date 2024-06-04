"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { usePetContext } from "@/lib/hooks";

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  if (!selectedPet) {
    return <p>No pet selected</p>;
  }

  return (
    // Setting flex on section allows children that want to grow to take up the available space to do so via flex-grow
    <section className="w-full h-full flex flex-col">
      <PetDetailsHeader src={selectedPet.imageUrl} name={selectedPet.name} />

      <PetDetailsBody>
        <PetKeyValues>
          <PetKeyValueDetail k="Owner Name" v={selectedPet.ownerName} />
          <PetKeyValueDetail k="Age" v={selectedPet.age} />
        </PetKeyValues>

        <PetNotes notes={selectedPet.notes} />
      </PetDetailsBody>
    </section>
  );
}

type PetDetailsHeaderProps = {
  src: string;
  name: string;
};

const PetDetailsHeader = ({ src, name }: PetDetailsHeaderProps) => (
  <div className="flex w-full flex-wrap justify-between p-5 gap-4 bg-white border-b border-black/[8%]">
    <div className="flex items-center gap-4">
      <Image
        src={src}
        alt="Selected pet image"
        width={75}
        height={75}
        className="w-[75px] h-[75px] rounded-full object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7">{name}</h2>
    </div>
    <div className="flex items-center gap-2 justify-end">
      <Button variant="secondary">Edit</Button>
      <Button variant="secondary">Checkout</Button>
    </div>
  </div>
);

type PetDetailsBodyProps = {
  children: React.ReactNode;
};

const PetDetailsBody = ({ children }: PetDetailsBodyProps) => (
  <div className="flex flex-col flex-grow p-10">{children}</div>
);

type PetKeyValuesProps = {
  children: React.ReactNode;
};

const PetKeyValues = ({ children }: PetKeyValuesProps) => (
  <div className="flex items-center justify-evenly mb-10">{children}</div>
);

type PetKeyValueDetailProps = {
  k: React.ReactNode;
  v: React.ReactNode;
};

const PetKeyValueDetail = ({ k, v }: PetKeyValueDetailProps) => (
  <div>
    <h3 className="uppercase font-medium text-md text-zinc-700">{k}</h3>
    <p className="text-center text-base leading-7 text-zinc-800">{v}</p>
  </div>
);

type PetNotesProps = {
  notes: React.ReactNode;
};

const PetNotes = ({ notes }: PetNotesProps) => (
  <p className="text-base bg-white h-full px-6 py-5 rounded-md border border-black/[8%]">
    {notes}
  </p>
);
