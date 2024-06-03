import { Pet } from "@/lib/types";
import Image from "next/image";

type PetListProps = {
  pets: Pet[];
};

export default function PetList({ pets }: PetListProps) {
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
  return (
    <li className="h-[70px] flex items-center cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
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
    </li>
  );
};
