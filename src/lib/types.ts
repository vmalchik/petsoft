import { Pet } from "@prisma/client";

// Note: Prisma has other types such as Prisma.UserCreateInput
export type NewPet = Omit<Pet, "id" | "createdAt" | "updatedAt">;
export type ClientPet = Omit<Pet, "createdAt" | "updatedAt">;
export type PetId = Pet["id"];
