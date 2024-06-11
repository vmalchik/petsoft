import { PetContext } from "@/contexts/pet-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ClientPet } from "./types";
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

export function useSelectedPetWithOptimisticCreate(pets: ClientPet[]) {
  // 'pendingNewPet' variable is a fix for optimistic updates causing newly added
  // to flicker in UI when selected by user before the server response
  const pendingNewPet = useRef<ClientPet | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<ClientPet["id"] | null>(
    null
  );

  // derived state
  const selectedPet = useMemo<ClientPet | null>(() => {
    // Check order matters here
    // Prioritize showing non-pending pet
    const pet = pets.find((pet) => pet.id === selectedPetId);
    if (pet) return pet;
    // Check and show pending pet if selected
    if (selectedPetId === pendingNewPet.current?.id) {
      return pendingNewPet.current;
    }
    return null;
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
    // reset pendingNewPet if pendingNewPet has been resolved
    if (!pendingNewPet.current?.id.startsWith(NEW_PET_TEMP_ID_PREFIX)) {
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
      pendingNewPet.current = newPet; // prevents flicker in components depending on selected pet
      setSelectedPetId(newPet.id); // schedules re-render of selected pet
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
