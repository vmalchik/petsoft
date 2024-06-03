"use client";
import { usePetContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";

export default function PetList() {
  const { pets } = usePetContext();
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {pets.map((pet) => (
        <PetItem key={pet.id} pet={pet} />
      ))}
    </ul>
  );
}

type PetItemProps = {
  pet: Pet;
};

const PetItem = ({ pet }: PetItemProps) => {
  const { handleChangeSelectedPetId } = usePetContext();
  return (
    <li>
      <button
        className="h-[70px] w-full flex items-center cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition"
        onClick={() => handleChangeSelectedPetId(pet.id)}
      >
        <Image
          src={pet.imageUrl}
          alt="pet photo"
          // NextJS uses properties more as a ratio between width and height
          width={45}
          height={45}
          //   cover to scale the image to fit the dimensions but maintain aspect ratio (may crop the image)
          className="w-[45px] h-[45px] rounded-full object-cover"
        />
        <p className="font-semibold">{pet.name}</p>
      </button>
    </li>
  );
};
