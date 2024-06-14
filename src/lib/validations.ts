import { ZodSchema, z } from "zod";
// import { z } from "zod";
import { NewPet, PetId } from "./types";
import { PLACE_HOLDER_IMAGE_URL } from "./constants";

export const PetFormSchema = z
  .object({
    name: z
      .string()
      .trim() // transformations only works with onSubmit. Does not work with form action.
      .min(1, { message: "Name is required" })
      .max(32, { message: "Name must be less than 32 characters" }),
    ownerName: z
      .string()
      .trim() // transformations only works with onSubmit. Does not work with form action.
      .min(1, { message: "Owner name is required" })
      .max(32, { message: "Owner name must be less than 32 characters" }),
    imageUrl: z.union([
      z.literal(""), // empty string is allowed
      z.literal(PLACE_HOLDER_IMAGE_URL), // placeholder image is allowed
      z.string().trim().url({ message: "Image URL must be a valid URL" }),
    ]),
    age: z.coerce // transformations only works with onSubmit. Does not work with form action.
      .number()
      .int()
      .positive({ message: "Age must be a positive number" })
      .max(999, { message: "Age must be less than 100" }),
    notes: z.union([
      z.literal(""), // empty string is allowed
      z
        .string()
        .max(256, { message: "Notes must be less than 256 characters" }),
    ]),
  })
  .transform((data) => ({
    // transformations only works with onSubmit. Does not work with form action.
    ...data,
    imageUrl: data.imageUrl || PLACE_HOLDER_IMAGE_URL, // after validation; if imageUrl is empty, use placeholder image
  })) satisfies ZodSchema<NewPet>; // satisfies is a type assertion to tell TypeScript that the schema is a Zod schema of NewPet type

// This helps TypeScript understand that PetIdSchema is indeed a Zod schema that validates a PetId (which is a string in your Prisma model).
export const PetIdSchema = z
  .string()
  .cuid({ message: "Invalid pet ID" }) satisfies ZodSchema<PetId>;
