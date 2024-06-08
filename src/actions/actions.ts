"use server";

import "server-only";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// perform update and revalidate the layout page in a single function and single network request
export const addPet = async (formData) => {
  try {
    const data = {
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      age: parseInt(formData.get("age")),
      imageUrl: formData.get("imageUrl") || "/placeholder.svg",
      notes: formData.get("notes"),
    };
    await prisma.pet.create({ data });
  } catch (error) {
    console.error(`Failed to add pet: ${error}`);
    // server to return an object with a message property
    return {
      message: "Failed to add pet",
    };
  }

  // revalidate the layout page because that is where we do the fetching for app/dashboard which
  // since we do the fetch in layout we need to specify app as route and layout as location
  revalidatePath("/app", "layout");
};

export const editPet = async (petId, formData) => {
  try {
    const data = {
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      age: parseInt(formData.get("age")),
      imageUrl: formData.get("imageUrl") || "/placeholder.svg",
      notes: formData.get("notes"),
    };
    await prisma.pet.update({
      where: { id: petId },
      data,
    });
  } catch (error) {
    console.error(`Failed to edit pet: ${error}`);
    return {
      message: "Failed to edit pet",
    };
  }

  revalidatePath("/app", "layout");
};

export const deletePet = async (petId) => {
  try {
    await prisma.pet.delete({
      where: { id: petId },
    });
  } catch (error) {
    console.error(`Failed to delete pet: ${error}`);
    return {
      message: "Failed to checkout pet",
    };
  }

  revalidatePath("/app", "layout");
};
