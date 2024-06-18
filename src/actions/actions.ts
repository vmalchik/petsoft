"use server";

import "server-only";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { NewPet, PetId } from "@/lib/types";
import { PetFormSchema, PetIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";

// --- User actions ---
export const login = async (formData: FormData) => {
  const credentials = Object.fromEntries(formData.entries());
  await signIn("credentials", credentials);
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};

// --- Pet actions ---

// server actions perform update and revalidate the layout page in a single function and single network request
// we cannot trust input from the client so input type will initially be unknown until validation is done
export const addPet = async (pet: unknown) => {
  try {
    const validatedPet = PetFormSchema.safeParse(pet);
    if (!validatedPet.success) {
      throw new Error("Failed to add pet. Invalid pet data");
    }

    const createdPet = await prisma.pet.create({ data: validatedPet.data });
    // revalidate the layout page because that is where we do the fetching for app/dashboard which
    // since we do the fetch in layout we need to specify app as route and layout as location
    revalidatePath("/app", "layout");
    return { pet: createdPet };
  } catch (error) {
    console.error(`Failed to add pet: ${error}`);
    // server to return an object with a message property
    return {
      error: {
        message: "Failed to add pet",
      },
    };
  }
};

export const editPet = async (petId: unknown, pet: unknown) => {
  try {
    // could use parse() instead of safeParse() but safeParse() will return an object with a success property
    const validatedPetId = PetIdSchema.safeParse(petId);
    const validatedPet = PetFormSchema.safeParse(pet);

    if (!validatedPetId.success) {
      throw new Error("Failed to edit pet. Invalid pet id.");
    }

    if (!validatedPet.success) {
      throw new Error("Failed to edit pet. Invalid pet data.");
    }

    // Prisma update not able to infer the type of the data so we need to specify the type
    const updatedPet = await prisma.pet.update<{
      where: { id: PetId };
      data: NewPet;
    }>({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });

    revalidatePath("/app", "layout");
    return {
      pet: updatedPet,
    };
  } catch (error) {
    console.error(`Failed to edit pet: ${error}`);
    return {
      error: {
        message: "Failed to edit pet",
      },
    };
  }
};

export const deletePet = async (petId: unknown) => {
  try {
    const validatedPetId = PetIdSchema.safeParse(petId);

    if (!validatedPetId.success) {
      throw new Error("Failed to edit pet. Invalid pet id.");
    }

    const deletedPet = await prisma.pet.delete({
      where: { id: validatedPetId.data },
    });
    revalidatePath("/app", "layout");
    return { pet: deletedPet };
  } catch (error) {
    console.error(`Failed to delete pet: ${error}`);
    return {
      error: {
        message: "Failed to checkout pet",
      },
    };
  }
};
