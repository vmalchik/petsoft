import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PetId, UserId } from "./types";
import prisma from "./db";

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function getPetById(petId: PetId) {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
    select: {
      userId: true, // only select userId from the response. prevents over fetching
    },
  });
  return pet;
}

export async function getAllPetsByUserId(userId: UserId) {
  const pets = await prisma.pet.findMany({
    where: {
      userId,
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
