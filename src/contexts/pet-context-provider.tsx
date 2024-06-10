"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { NEW_PET_TEMP_ID_PREFIX } from "@/lib/constants";
import { useSearchContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import {
  createContext,
  useOptimistic,
  useState,
  startTransition,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: Pet[];
  numPets: number;
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleAddPet: (pet: Omit<Pet, "id">) => Promise<void>;
  handleEditPet: (petId: string, pet: Omit<Pet, "id">) => Promise<void>;
};

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

// NOTE: How to use Zustand instead of React Context
// https://medium.com/@mak-dev/zustand-with-next-js-14-server-components-da9c191b73df#:~:text=Server%2Dside%20components%20are%20meant,%E2%80%9Cstate%E2%80%9D%20inside%20the%20server.

enum OptimisticPetActions {
  add = "add",
  update = "update",
  delete = "delete",
}

type OptimisticPetAdd = {
  action: OptimisticPetActions.add;
  payload: { pet: Pet };
};

type OptimisticPetUpdate = {
  action: OptimisticPetActions.update;
  payload: { pet: Pet };
};

type OptimisticPetDelete = {
  action: OptimisticPetActions.delete;
  payload: { id: string };
};

type OptimisticPetsChanges =
  | OptimisticPetUpdate
  | OptimisticPetDelete
  | OptimisticPetAdd;

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const { searchQuery } = useSearchContext();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // 'tempPet' variable is a fix for optimistic updates causing newly added
  // to flicker in UI when selected by user before the server response
  const tempPet = useRef<Pet | null>(null);

  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }: OptimisticPetsChanges) => {
      switch (action) {
        case OptimisticPetActions.add:
          return [...state, payload.pet];
        case OptimisticPetActions.update:
          return state.map((p) => (p.id === payload.pet.id ? payload.pet : p));
        case OptimisticPetActions.delete:
          return state.filter(({ id }) => id !== payload.id);
        default:
          return [...state];
      }
    }
  );

  // derived state
  const numPets = optimisticPets.length;

  const selectedPet = useMemo(() => {
    if (selectedPetId === tempPet.current?.id) {
      return tempPet.current;
    }
    return optimisticPets.find((pet) => pet.id === selectedPetId);
  }, [optimisticPets, selectedPetId]);

  const filteredPets = useMemo(() => {
    return optimisticPets.filter((pet) => {
      return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, optimisticPets]);

  // event handlers
  useEffect(() => {
    // if a new pet is added, select it
    if (tempPet.current?.id) {
      setSelectedPetId(tempPet.current.id);
    }
  }, [optimisticPets.length]);

  useEffect(() => {
    // reset tempPet if user selects another pet
    if (selectedPetId !== tempPet.current?.id) {
      tempPet.current = null;
    }
  }, [selectedPetId]);

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleError = (error: any) => {
    if (error?.message) {
      toast.warning(error.message);
    }
  };

  const handleCheckoutPet = async (id: string) => {
    setSelectedPetId(null);
    startTransition(() => {
      setOptimisticPets({
        action: OptimisticPetActions.delete,
        payload: { id },
      });
    });
    const response = await deletePet(id);
    response.error && handleError(response.error);
  };

  const handleAddPet = async (pet: Omit<Pet, "id">) => {
    const id = `${NEW_PET_TEMP_ID_PREFIX}-${Date.now()}`;
    const newPet = { ...pet, id };
    tempPet.current = newPet;
    setOptimisticPets({
      action: OptimisticPetActions.add,
      payload: { pet: newPet },
    });

    const response = await addPet(pet);
    if (response.error) {
      tempPet.current = null;
      handleError(response.error);
      setOptimisticPets({
        action: OptimisticPetActions.delete,
        payload: { id },
      });
    } else if (response?.pet?.id) {
      // if user hasn't selected another pet before the server response
      // smooth update ui with the new pet id from the server without flicker
      if (tempPet.current?.id === id) {
        tempPet.current = response.pet;
        setSelectedPetId(response.pet.id);
      }
    }
  };

  const handleEditPet = async (petId: string, pet: Omit<Pet, "id">) => {
    startTransition(() => {
      const updatedPet = { ...pet, id: petId };
      setOptimisticPets({
        action: OptimisticPetActions.update,
        payload: { pet: updatedPet },
      });
    });
    const response = await editPet(petId, pet);
    response.error && handleError(response.error);
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
