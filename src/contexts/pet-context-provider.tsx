"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { useSearchContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import {
  createContext,
  useOptimistic,
  useState,
  startTransition,
  useEffect,
  useMemo,
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
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { searchQuery } = useSearchContext();

  // todo - look into showing newly added pet without flicker after optimistic update
  // const [selectedPet, setSelectedPet] = useState<Pet | undefined>();
  // useEffect(() => {
  //   if (!selectedPet && selectedPetId) {
  //     setSelectedPet(optimisticPets.find((pet) => pet.id === selectedPetId));
  //   } else if (selectedPet && !selectedPetId?.startsWith("temp")) {
  //     setSelectedPet(optimisticPets.find((pet) => pet.id === selectedPetId));
  //   }
  // }, [selectedPet, selectedPetId, optimisticPets]);

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numPets = optimisticPets.length;
  // todo - useMemo for performance
  const filteredPets = optimisticPets.filter((pet) => {
    return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // event handlers
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
    const id = `temp-${Date.now()}`;
    const newPet = { ...pet, id };
    startTransition(() => {
      setOptimisticPets({
        action: OptimisticPetActions.add,
        payload: { pet: newPet },
      });
    });
    const response = await addPet(pet);
    // todo - fix flicker when adding new pet
    // if (response.pet) {
    //   setSelectedPetId((prev) => (prev === newPet.id ? response.pet.id : prev));
    // }
    response.error && handleError(response.error);
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
