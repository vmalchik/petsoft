"use client";
import { usePetContext } from "@/lib/hooks";
import type { ClientPet } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

export default function PetList() {
  const { pets } = usePetContext();
  return (
    <ul className="bg-white border-b border-light h-full md:h-[560px] scrollbar-thin scrollbar-thumb-rounded-none scrollbar-track-rounded-none scrollbar-thumb-[#2C9676]/75 scrollbar-track-transparent overflow-y-scroll">
      {pets.map((pet) => (
        <PetItem key={pet.id} pet={pet} />
      ))}
    </ul>
  );
}

type PetItemProps = {
  pet: ClientPet;
};

const PetItem = ({ pet }: PetItemProps) => {
  const { selectedPetId, handleChangeSelectedPetId } = usePetContext();
  return (
    <li>
      <Button
        variant="ghost"
        aria-label={`Select pet ${pet.name}`}
        className={cn(
          "h-[70px] w-full rounded-none flex items-center justify-start px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition",
          {
            "bg-[#EFF1F2]": pet.id === selectedPetId,
          }
        )}
        onClick={() => handleChangeSelectedPetId(pet.id)}
      >
        <Image
          src={pet.imageUrl}
          alt="pet photo"
          width={45}
          height={45}
          className="w-[45px] h-[45px] rounded-full object-cover"
        />
        <p className="font-semibold">{pet.name}</p>
      </Button>
    </li>
  );
};
