import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PetId, UserId } from "./types";
import prisma from "./db";
import { Routes } from "./constants";

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    console.error("No valid session. Redirecting to login");
    redirect(Routes.Login);
  }
  return session;
}

export async function getPetById(petId: PetId) {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
    select: {
      userId: true,
    },
  });
  return pet;
}

export async function getAllPetsByUserId(userId: UserId) {
  const pets = await prisma.pet.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return pets;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export function handleNextAuthRedirectError(error: unknown) {
  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    // logout will attempt to redirect upon action (e.g. sign out | sign in)
    // next-auth redirect works by throwing an error which will be caught by our try/catch
    // catching the error will prevent redirect so we need to re-throw the error
    console.error(
      `NextAuth action was successful. Redirect error caught. Re-throwing redirect error.`
    );
    throw error;
  }
}
