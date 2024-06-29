"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { NEW_PET_TEMP_ID_PREFIX } from "@/lib/constants";
import { useSearchContext } from "@/lib/hooks";
import type { ClientPet, NewPet, PetId } from "@/lib/types";
import {
  createContext,
  useOptimistic,
  startTransition,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: ClientPet[];
  numPets: number;
  selectedPetId: { id: PetId | null; tmpId: PetId | null } | null;
  selectedPet: ClientPet | undefined;
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
  // object usage addresses the issue of flickering when selecting a newly added pet
  const [selectedPetId, setSelectedPetId] = useState<{
    id: string | null;
    tmpId: string | null;
  } | null>(null);

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

  // derived state / computed state
  const numPets = optimisticPets.length;
  const selectedPet = useMemo(() => {
    return optimisticPets.find(
      (pet) => pet.id === selectedPetId?.id || pet.id === selectedPetId?.tmpId
    );
  }, [optimisticPets, selectedPetId]);

  const filteredPets = useMemo(() => {
    return optimisticPets.filter((pet) => {
      return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, optimisticPets]);

  // event handlers / actions
  const handleError = (message: string) => {
    toast.warning(message);
  };

  const handleChangeSelectedPetId = (id: PetId) => {
    setSelectedPetId({ id, tmpId: null });
  };

  const handleCheckoutPet = async (id: PetId) => {
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
    setOptimisticPets({
      action: OptimisticPetActions.add,
      payload: { pet: newPet },
    });
    setSelectedPetId({ id: null, tmpId: tempId });
    const response = await addPet(pet);
    if (response?.pet?.id) {
      setSelectedPetId((prev) => {
        return prev?.tmpId === tempId
          ? { id: response!.pet!.id, tmpId: tempId }
          : prev;
      });
    } else {
      handleError(response.error?.message || "Failed to add pet");
      setOptimisticPets({
        action: OptimisticPetActions.delete,
        payload: { id: tempId },
      });
      setSelectedPetId((prev) => {
        return prev?.tmpId === tempId ? { id: null, tmpId: null } : prev;
      });
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
