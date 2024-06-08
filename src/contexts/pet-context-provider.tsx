"use client";
import { addPet } from "@/actions/actions";
import { useSearchContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  numPets: number;
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (pet: Omit<Pet, "id">) => void;
  handleEditPet: (petId: string, pet: Omit<Pet, "id">) => void;
};

type PetContextProviderProps = {
  pets: Pet[];
  children: React.ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

// NOTE: How to use Zustand instead of React Context
// https://medium.com/@mak-dev/zustand-with-next-js-14-server-components-da9c191b73df#:~:text=Server%2Dside%20components%20are%20meant,%E2%80%9Cstate%E2%80%9D%20inside%20the%20server.

export default function PetContextProvider({
  pets,
  children,
}: PetContextProviderProps) {
  // state
  // const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { searchQuery } = useSearchContext();

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  console.log("selectedPet", selectedPet);
  const numPets = pets.length;
  // todo - useMemo for performance
  const filteredPets = pets.filter((pet) => {
    return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // event handlers
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    // setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    // setSelectedPetId(null);
  };

  const handleAddPet = async (pet: Omit<Pet, "id">) => {
    // const id = Date.now().toString();
    // setPets((prevPets) => [...prevPets, { ...pet, id }]);

    // call server action from the client side
    await addPet(pet);
  };

  const handleEditPet = (petId: string, pet: Omit<Pet, "id">) => {
    // setPets((prevPets) => {
    //   const updatedPets = prevPets.map((p) => {
    //     if (p.id === petId) {
    //       return { ...pet, id: petId };
    //     }
    //     return p;
    //   });
    //   return updatedPets;
    // });
  };

  return (
    <PetContext.Provider
      value={{
        pets: filteredPets,
        numPets,
        selectedPetId,
        selectedPet,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
