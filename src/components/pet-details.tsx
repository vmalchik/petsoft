"use client";
import Image from "next/image";
import { usePetContext } from "@/lib/hooks";
import { ClientPet } from "@/lib/types";
import PetButton from "./pet-button";
import { NEW_PET_TEMP_ID_PREFIX } from "@/lib/constants";

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    // Setting flex on section allows children that want to grow to take up the available space to do so via flex-grow
    <section className="w-full h-full flex flex-col">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <PetDetailsHeader pet={selectedPet} />
          <PetInfo pet={selectedPet} />
          <PetNotes pet={selectedPet} />
        </>
      )}
    </section>
  );
}

// Generally not a good idea to have layout styles part of the component but these are internal components and are not meant to be reused
const EmptyView = () => (
  <p className="h-full flex justify-center items-center text-2xl font-medium">
    No pet selected
  </p>
);

type PetProps = {
  pet: ClientPet;
};

const PetDetailsHeader = ({ pet }: PetProps) => {
  const { handleCheckoutPet, selectedPetId } = usePetContext();
  const disabled = selectedPetId?.startsWith(NEW_PET_TEMP_ID_PREFIX);
  return (
    <div className="flex flex-wrap items-center p-5 bg-white border-b border-light">
      <Image
        src={pet.imageUrl}
        alt="Selected pet image"
        width={75}
        height={75}
        className="w-[75px] h-[75px] rounded-full object-cover"
      />

      <h2 className="text-3xl ml-4 font-semibold leading-7">{pet.name}</h2>
      <div className="ml-auto space-x-2">
        <PetButton actionType="edit" disabled={disabled}>
          Edit
        </PetButton>
        <PetButton
          actionType="checkout"
          disabled={disabled}
          onClick={async () => await handleCheckoutPet(pet.id)}
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
};

const PetInfo = ({ pet }: PetProps) => {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <PetKeyValueDetail k="Owner Name" v={pet.ownerName} />
      <PetKeyValueDetail k="Age" v={pet.age} />
    </div>
  );
};

type PetKeyValueDetailProps = {
  k: React.ReactNode;
  v: React.ReactNode;
};

const PetKeyValueDetail = ({ k, v }: PetKeyValueDetailProps) => (
  <div>
    <h3 className="uppercase font-medium text-sm text-zinc-700">{k}</h3>
    <p className="text-center text-base leading-7 text-zinc-800">{v}</p>
  </div>
);

const PetNotes = ({ pet }: PetProps) => (
  <p className="flex-1 text-[15px] bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
    {pet.notes}
  </p>
);
