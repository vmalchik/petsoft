import { PetContext } from "@/contexts/pet-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ClientPet } from "./types";

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

export function useSelectedPetWithOptimisticCreate(pets: ClientPet[]) {
  // 'pendingNewPet' variable is a fix for optimistic updates causing newly added
  // to flicker in UI when selected by user before the server response
  const pendingNewPet = useRef<ClientPet | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<ClientPet["id"] | null>(
    null
  );

  // derived state
  const selectedPet = useMemo(() => {
    if (selectedPetId === pendingNewPet.current?.id) {
      return pendingNewPet.current;
    }
    return pets.find((pet) => pet.id === selectedPetId);
  }, [pets, selectedPetId]);

  // event handlers
  useEffect(() => {
    // if a new pet is added, select it
    if (pendingNewPet.current?.id) {
      setSelectedPetId(pendingNewPet.current.id);
    }
  }, [pets.length]);

  useEffect(() => {
    // reset pendingNewPet if user selects another pet
    if (selectedPetId !== pendingNewPet.current?.id) {
      pendingNewPet.current = null;
    }
  }, [selectedPetId]);

  const handleChangeSelectedPetId = (id: ClientPet["id"] | null) => {
    setSelectedPetId(id);
  };

  const handleOptimisticCreatedPet = (pendingPet: ClientPet) => {
    pendingNewPet.current = pendingPet;
  };

  const handleResolvedCreatedPet = (
    newPet: ClientPet,
    tempId: ClientPet["id"]
  ) => {
    // if user hasn't selected another pet before the server response
    // smooth update ui with the new pet id from the server without flicker
    if (pendingNewPet.current?.id === tempId) {
      pendingNewPet.current = newPet;
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
