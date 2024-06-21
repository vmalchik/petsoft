"use server";

import "server-only";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { NewPet, PetId } from "@/lib/types";
import { PetFormSchema, PetIdSchema, AuthSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import {
  checkAuth,
  getPetById,
  handleNextAuthRedirectError,
} from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Stripe from "stripe";
// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// --- Payment actions ---
// https://docs.stripe.com/api/authentication
export const createCheckoutSession = async () => {
  // Test Credit Card: 4242 4242 4242 4242
  try {
    const session = await checkAuth();
    if (process.env.STRIPE_SECRET_KEY) {
      const appUrl = process.env.CANONICAL_URL;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: session.user.email!, // TODO: look into typescript error
        line_items: [
          {
            price: "price_1PTYPxRucQ0yETEvbn7qg2aY",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/payment?success=true`,
        cancel_url: `${appUrl}/payment?cancelled=true`,
      });
      console.log(checkoutSession);
      redirect(checkoutSession.url);
    }
  } catch (error) {
    handleNextAuthRedirectError(error);
    console.log(`Failed to create Stripe session: ${error}`);
  }
  return {
    message: "Failed to create purchase request",
  };
};

// --- User actions ---
// prevState is not used but is required to satisfy usage of useFormState in auth-form.tsx
export const login = async (prevState: unknown, formData: unknown) => {
  // Must check request data is of valid type (FormData)
  if (formData instanceof FormData === false) {
    return {
      message: "Invalid form data",
    };
  }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    console.error(`Failed to sign in: ${error}`);
    handleNextAuthRedirectError(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials",
          };
        }
        default: {
          return {
            message: "Error. Could not sign in.",
          };
        }
      }
    }
    return {
      message: "Could not sign in",
    };
  }
};

export const logout = async () => {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    console.error(`Failed to sign out: ${error}`);
    handleNextAuthRedirectError(error);
  }
  // Something went wrong if user was not redirected
  return {
    message: "Failed to sign out",
  };
};

// prevState is not used but is required to satisfy usage of useFormState in auth-form.tsx
export const signup = async (prevState: unknown, formData: unknown) => {
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
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    console.error(`Failed to create user: ${error}`);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
        };
      }
    }
    return {
      message: "Failed to create user",
    };
  }

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
    // TODO: Victor refactor error.message
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
    // TODO: Victor refactor error.message
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
    // TODO: Victor refactor error.message
    return {
      error: {
        message: "Failed to checkout pet",
      },
    };
  }
};
