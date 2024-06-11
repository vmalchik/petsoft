import { PetContext } from "@/contexts/pet-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Pet } from "./types";
import { NEW_PET_TEMP_ID_PREFIX } from "./constants";

export function usePetContext() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within a PetContextProvider");
  }
  return context;
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      "usePetContext must be used within a SearchContextProvider"
    );
  }
  return context;
}

export function useSelectedPetWithOptimisticCreate(pets: Pet[]) {
  // 'tempPet' variable is a fix for optimistic updates causing newly added
  // to flicker in UI when selected by user before the server response
  const tempPet = useRef<Pet | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = useMemo(() => {
    if (selectedPetId === tempPet.current?.id) {
      return tempPet.current;
    }
    return pets.find((pet) => pet.id === selectedPetId);
  }, [pets, selectedPetId]);

  // event handlers
  useEffect(() => {
    // if a new pet is added, select it
    if (tempPet.current?.id) {
      setSelectedPetId(tempPet.current.id);
    }
  }, [pets.length]);

  useEffect(() => {
    // reset tempPet if user selects another pet
    if (selectedPetId !== tempPet.current?.id) {
      tempPet.current = null;
    }
  }, [selectedPetId]);

  const handleChangeSelectedPetId = (id: string | null) => {
    setSelectedPetId(id);
  };

  const handleOptimisticCreatedPet = (newPet: Pet) => {
    tempPet.current = newPet;
  };

  const handleResolvedCreatedPet = (newPet: Pet, tempId: string) => {
    // if user hasn't selected another pet before the server response
    // smooth update ui with the new pet id from the server without flicker
    if (tempPet.current?.id === tempId) {
      tempPet.current = newPet;
      setSelectedPetId(newPet.id);
    }
  };

  return {
    selectedPetId,
    selectedPet,
    handleChangeSelectedPetId,
    handleOptimisticCreatedPet,
    handleResolvedCreatedPet,
  };
}
