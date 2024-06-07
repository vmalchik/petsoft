"use server";

import "server-only";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// perform update and revalidate the layout page in a single function and single network request
export const addPet = async (formData) => {
  const data = {
    name: formData.get("name"),
    ownerName: formData.get("ownerName"),
    age: parseInt(formData.get("age")),
    imageUrl: formData.get("imageUrl") || "/placeholder.svg",
    notes: formData.get("notes"),
  };
  try {
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
