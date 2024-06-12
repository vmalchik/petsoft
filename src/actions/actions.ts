"use server";

import "server-only";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ClientPet } from "@/lib/types";
import { PetFormSchema } from "@/lib/validations";

// server actions perform update and revalidate the layout page in a single function and single network request
// we cannot trust input from the client so input type will initially be unknown until validation is done
export const addPet = async (pet: unknown) => {
  try {
    const validatedPet = PetFormSchema.safeParse(pet);
    if (!validatedPet.success) {
      throw new Error("Invalid pet data");
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

export const editPet = async (petId: ClientPet["id"], pet: ClientPet) => {
  try {
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: pet,
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

export const deletePet = async (petId: ClientPet["id"]) => {
  try {
    const deletedPet = await prisma.pet.delete({
      where: { id: petId },
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
