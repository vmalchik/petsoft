import { Pet, User } from "@prisma/client";
import { z } from "zod";
import { AuthSchema } from "./validations";

// Note: Prisma has other types such as Prisma.UserCreateInput

// Pet
export type NewPet = Omit<Pet, "id" | "createdAt" | "updatedAt" | "userId">;
export type ClientPet = Omit<Pet, "createdAt" | "updatedAt">;
export type PetId = Pet["id"];

// User
export type UserId = User["id"];

// Auth
export type TAuth = z.infer<typeof AuthSchema>;
