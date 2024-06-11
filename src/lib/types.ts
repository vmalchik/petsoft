import { Pet } from "@prisma/client";

export type NewPet = Omit<Pet, "id" | "createdAt" | "updatedAt">;
export type ClientPet = Omit<Pet, "createdAt" | "updatedAt">;
