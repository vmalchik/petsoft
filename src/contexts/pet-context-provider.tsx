"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { NEW_PET_TEMP_ID_PREFIX } from "@/lib/constants";
import {
  useSearchContext,
  useSelectedPetWithOptimisticCreate,
} from "@/lib/hooks";
import type { ClientPet, NewPet, PetId } from "@/lib/types";
import { createContext, useOptimistic, startTransition, useMemo } from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: ClientPet[];
  numPets: number;
  selectedPetId: PetId | null;
  selectedPet: ClientPet | null;
  handleChangeSelectedPetId: (id: PetId) => void;
  handleCheckoutPet: (id: PetId) => Promise<void>;
  handleAddPet: (pet: NewPet) => Promise<void>;
  handleEditPet: (petId: PetId, pet: ClientPet) => Promise<void>;
};

type PetContextProviderProps = {
  data: ClientPet[];
  children: React.ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

enum OptimisticPetActions {
  add = "add",
  update = "update",
  delete = "delete",
}

type OptimisticPetAdd = {
  action: OptimisticPetActions.add;
  payload: { pet: ClientPet };
};

type OptimisticPetUpdate = {
  action: OptimisticPetActions.update;
  payload: { pet: ClientPet };
};

type OptimisticPetDelete = {
  action: OptimisticPetActions.delete;
  payload: { id: PetId };
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

  const {
    selectedPetId,
    selectedPet,
    handleChangeSelectedPetId,
    handleOptimisticCreatedPet,
    handleResolvedCreatedPet,
  } = useSelectedPetWithOptimisticCreate(optimisticPets);

  // derived state / computed state
  const numPets = optimisticPets.length;

  const filteredPets = useMemo(() => {
    return optimisticPets.filter((pet) => {
      return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, optimisticPets]);

  // event handlers / actions
  const handleError = (message: string) => {
    toast.warning(message);
  };

  const handleCheckoutPet = async (id: PetId) => {
    handleChangeSelectedPetId(null);
    startTransition(() => {
      setOptimisticPets({
        action: OptimisticPetActions.delete,
        payload: { id },
      });
    });
    const response = await deletePet(id);
    if (response.error) {
      handleError(response.error?.message || "Failed to checkout pet");
    }
  };

  const handleAddPet = async (pet: NewPet) => {
    const tempId = `${NEW_PET_TEMP_ID_PREFIX}-${Date.now()}`;
    const newPet: ClientPet = { ...pet, id: tempId };
    handleOptimisticCreatedPet(newPet);
    setOptimisticPets({
      action: OptimisticPetActions.add,
      payload: { pet: newPet },
    });

    const response = await addPet(pet);
    if (response.pet) {
      handleResolvedCreatedPet(response.pet, tempId);
    } else {
      handleError(response.error?.message || "Failed to add pet");
      setOptimisticPets({
        action: OptimisticPetActions.delete,
        payload: { id: tempId },
      });
      handleChangeSelectedPetId(null);
    }
  };

  const handleEditPet = async (petId: PetId, pet: ClientPet) => {
    startTransition(() => {
      const updatedPet = { ...pet, id: petId };
      setOptimisticPets({
        action: OptimisticPetActions.update,
        payload: { pet: updatedPet },
      });
    });
    const response = await editPet(petId, pet);
    if (response.error) {
      handleError(response.error?.message || "Failed to edit pet");
    }
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
