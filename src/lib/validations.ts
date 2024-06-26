import { ZodSchema, z } from "zod";
import { NewPet, PetId } from "./types";
import { PLACE_HOLDER_IMAGE_URL } from "./constants";

// Note: transformations (e.g. trim, coerce, etc.) only works with onSubmit. Does not work with form action.
export const PetFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(32, { message: "Name must be less than 32 characters" }),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner name is required" })
      .max(32, { message: "Owner name must be less than 32 characters" }),
    imageUrl: z.union([
      z.literal(""),
      z.literal(PLACE_HOLDER_IMAGE_URL),
      z.string().trim().url({ message: "Image URL must be a valid URL" }),
    ]),
    age: z.coerce
      .number()
      .int()
      .positive({ message: "Age must be a positive number" })
      .max(999, { message: "Age must be less than 100" }),
    notes: z.union([
      z.literal(""),
      z
        .string()
        .max(256, { message: "Notes must be less than 256 characters" }),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || PLACE_HOLDER_IMAGE_URL,
  })) satisfies ZodSchema<NewPet>;

export const PetIdSchema = z
  .string()
  .cuid({ message: "Invalid pet ID" }) satisfies ZodSchema<PetId>;

export const AuthSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});
