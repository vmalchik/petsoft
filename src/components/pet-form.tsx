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
    // zodResolver is a function that returns a resolver for react-hook-form to validate against a Zod schema
    resolver: zodResolver(PetFormSchema),
  });

  const handleAction = async () => {
    // trigger is a method from react-hook-form that triggers validation for all fields using specified resolver
    const result = await trigger();
    if (!result) {
      return;
    }

    onFormSubmission();

    const petData = getValues();
    const sanitizedPet = PetFormSchema.parse(petData); // manually trigger parse which will apply transformations
    if (actionType === "add") {
      await handleAddPet(sanitizedPet);
    } else if (actionType === "edit") {
      const updatedPet: ClientPet = {
        ...pet,
        ...sanitizedPet,
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
              {/* htmlFor connects to id attribute */}
              {/* name attribute is used to reference elements in JS or form data after a form is submitted */}
              <Label htmlFor={name}>{label}</Label>
              {type === "textarea" ? (
                <Textarea
                  id={name}
                  rows={3}
                  {...register(name, {
                    ...field,
                    value: pet?.[name],
                  })}
                />
              ) : (
                <Input
                  id={name}
                  {...register(name, {
                    ...field,
                    value: pet?.[name],
                  })}
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
