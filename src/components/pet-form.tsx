"use client";
import { usePetContext } from "@/lib/hooks";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { ClientPet } from "@/lib/types";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetFormSchema } from "@/lib/validations";
import { PLACE_HOLDER_IMAGE_URL } from "@/lib/constants";

type TPetForm = z.infer<typeof PetFormSchema>;

type Field<K extends keyof TPetForm> = {
  label: string;
  name: K; // enforce to be one one of the keys of TPetForm such as "name", "ownerName", etc.
  type: "text" | "number" | "textarea";
};

const fields: Field<keyof TPetForm>[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
  },
  {
    label: "Owner Name",
    name: "ownerName",
    type: "text",
  },
  {
    label: "Age",
    name: "age",
    type: "number",
  },
  {
    label: "Image URL",
    name: "imageUrl",
    type: "text",
  },
  {
    label: "Notes",
    name: "notes",
    type: "textarea",
  },
];

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

const getDefaultImageURL = (url?: string) => {
  return url === PLACE_HOLDER_IMAGE_URL ? "" : url;
};

const setDefaultFormValues = (pet: ClientPet) => {
  return {
    name: pet!.name,
    ownerName: pet!.ownerName,
    age: pet!.age,
    imageUrl: getDefaultImageURL(pet?.imageUrl),
    notes: pet?.notes || "",
  };
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, selectedPet: pet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(PetFormSchema),
    defaultValues:
      actionType === "edit" ? setDefaultFormValues(pet!) : undefined,
  });

  const handleAction = async () => {
    const result = await trigger();
    if (!result) {
      return;
    }

    onFormSubmission();

    const petData = getValues();
    // Must manually trigger parse to apply transformations when using "action"
    const validatedPet = PetFormSchema.parse(petData);
    if (actionType === "add") {
      await handleAddPet(validatedPet);
    } else if (actionType === "edit") {
      const updatedPet: ClientPet = {
        ...pet,
        ...validatedPet,
        id: pet!.id,
      };
      await handleEditPet(updatedPet.id, updatedPet);
    }
  };

  return (
    <form action={handleAction}>
      <div className="space-y-3">
        {fields.map((field) => {
          const { label, name, type } = field;
          return (
            <div key={name} className="space-y-1">
              <Label htmlFor={name}>{label}</Label>
              {type === "textarea" ? (
                <Textarea
                  id={name}
                  aria-invalid={errors[name] ? "true" : "false"}
                  rows={3}
                  {...register(name)}
                />
              ) : (
                <Input
                  id={name}
                  aria-invalid={errors[name] ? "true" : "false"}
                  {...register(name)}
                />
              )}
              {errors[name] && (
                <p className="text-red-500">{errors[name]?.message}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-right mt-5">
        <PetFormBtn actionType={actionType} />
      </div>
    </form>
  );
}
