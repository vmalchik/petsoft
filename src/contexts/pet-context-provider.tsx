"use client";
import { useSearchContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  numPets: number;
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleChangeSelectedPetId: (id: string) => void;
};

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

// NOTE: How to use Zustand instead of React Context
// https://medium.com/@mak-dev/zustand-with-next-js-14-server-components-da9c191b73df#:~:text=Server%2Dside%20components%20are%20meant,%E2%80%9Cstate%E2%80%9D%20inside%20the%20server.

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [pets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { searchQuery } = useSearchContext();

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numPets = pets.length;
  const filteredPets = pets.filter((pet) => {
    return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // event handlers
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: filteredPets,
        numPets,
        selectedPetId,
        selectedPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
