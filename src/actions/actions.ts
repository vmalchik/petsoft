"use server";

import "server-only";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { NewPet, PetId } from "@/lib/types";
import { PetFormSchema, PetIdSchema, AuthSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";

// --- User actions ---
export const login = async (formData: unknown) => {
  // Must check request data is of valid type (FormData)
  if (formData instanceof FormData === false) {
    return {
      message: "Invalid form data",
    };
  }
  await signIn("credentials", formData);
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};

export const signup = async (formData: unknown) => {
  // Note: adding try/catch causes signIn to not work. TODO: investigate https://github.com/vercel/next.js/issues/49298
  // Must check request data is of valid type (FormData)
  if (formData instanceof FormData === false) {
    return {
      message: "Invalid form data",
    };
  }
  const credentials = Object.fromEntries(formData.entries());
  const parsedFormData = AuthSchema.safeParse(credentials);
  if (!parsedFormData.success) {
    return {
      message: "Invalid form data",
    };
  }
  const { email, password } = parsedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      hashedPassword: hashedPassword,
    },
  });
  console.log(`New user ${credentials.email}`);
  // sign in the user upon successful sign up
  await signIn("credentials", parsedFormData.data);
};

// --- Pet actions ---

// server actions perform update and revalidate the layout page in a single function and single network request
// we cannot trust input from the client so input type will initially be unknown until validation is done
export const addPet = async (pet: unknown) => {
  try {
    // Must validate that add new pet request is being made by authenticated user
    const session = await checkAuth();
    const validatedPet = PetFormSchema.safeParse(pet);
    if (!validatedPet.success) {
      throw new Error("Failed to add pet. Invalid pet data");
    }

    const createdPet = await prisma.pet.create({
      data: {
        ...validatedPet.data,
        // alternatively could use userId
        // userId: session.user.id,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
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

export const editPet = async (petId: unknown, newPetData: unknown) => {
  try {
    // Only authenticated users can delete pets
    const session = await checkAuth();

    // could use parse() instead of safeParse() but safeParse() will return an object with a success property
    const validatedPetId = PetIdSchema.safeParse(petId);
    const validatedPet = PetFormSchema.safeParse(newPetData);

    if (!validatedPetId.success) {
      throw new Error("Failed to edit pet. Invalid pet id.");
    }

    if (!validatedPet.success) {
      throw new Error("Failed to edit pet. Invalid pet data.");
    }

    // Must validate that user owns pet (authorization check)
    const pet = await getPetById(validatedPetId.data);

    if (!pet) {
      throw new Error("Failed to edit pet. Pet not found.");
    }

    if (pet.userId !== session.user.id) {
      throw new Error("Failed to edit pet. Unauthorized.");
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
    // Only authenticated users can delete pets
    const session = await checkAuth();

    const validatedPetId = PetIdSchema.safeParse(petId);

    if (!validatedPetId.success) {
      throw new Error("Failed to edit pet. Invalid pet id.");
    }

    // Must validate that user owns pet (authorization check)
    const pet = await getPetById(validatedPetId.data);

    if (!pet) {
      throw new Error("Failed to delete pet. Pet not found.");
    }

    if (pet.userId !== session.user.id) {
      throw new Error("Failed to delete pet. Unauthorized.");
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
