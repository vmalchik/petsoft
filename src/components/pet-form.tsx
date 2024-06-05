"use client";
import { usePetContext } from "@/lib/hooks";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Pet } from "@/lib/types";

type FormFields = Omit<Pet, "id">;

type Field = {
  label: string;
  name: keyof FormFields;
  type: string;
  required: boolean;
};

const fields: Field[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Owner Name",
    name: "ownerName",
    type: "text",
    required: true,
  },
  {
    label: "Age",
    name: "age",
    type: "number",
    required: true,
  },
  {
    label: "Image URL",
    name: "imageUrl",
    type: "text",
    required: false,
  },
  {
    label: "Notes",
    name: "notes",
    type: "textarea",
    required: false,
  },
];

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

const PLACE_HOLDER_IMAGE_URL = "/placeholder.svg";

const setDefaultValue = (
  actionType: "add" | "edit",
  fieldName: keyof FormFields,
  pet?: Pet
) => {
  let value = undefined;
  if (pet && actionType === "edit") {
    if (
      fieldName === "imageUrl" &&
      pet?.[fieldName] === PLACE_HOLDER_IMAGE_URL
    ) {
      // don't set a default value for image URL if it's the placeholder image
      value = undefined;
    } else {
      value = pet?.[fieldName];
    }
  }
  return value;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, selectedPet: pet, handleEditPet } = usePetContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // FormData is a built-in JS object that allows you to capture form data
    const formData = new FormData(event.currentTarget);

    // Object.fromEntries() is a built-in JS method that converts a list of key-value pairs into an object
    const formObject: FormFields = Object.fromEntries(
      formData.entries()
    ) as unknown as FormFields;

    // Omit is a utility type that allows you to create a new type by excluding certain properties from an existing type
    const newPet: Omit<Pet, "id"> = {
      name: formObject.name,
      ownerName: formObject.ownerName,
      age: formObject.age,
      notes: formObject.notes,
      imageUrl: formObject.imageUrl || PLACE_HOLDER_IMAGE_URL,
    };

    // const newPet: Omit<Pet, "id"> = {
    //   name: formData.get("name") as string,
    //   ownerName: formData.get("ownerName") as string,
    //   age: parseInt(formData.get("age") as string),
    //   imageUrl: (formData.get("imageUrl") as string) || "/placeholder.svg",
    //   notes: formData.get("notes") as string,
    // };

    if (actionType === "add") {
      handleAddPet(newPet);
    } else if (pet?.id && actionType === "edit") {
      handleEditPet(pet.id, newPet);
    }

    onFormSubmission();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        {fields.map((field) => {
          const { label, name, type, required } = field;
          return (
            <div key={name} className="space-y-1">
              {/* htmlFor connects to id attribute */}
              {/* name attribute is used to reference elements in JS or form data after a form is submitted */}
              <Label htmlFor={name}>{label}</Label>
              {type === "textarea" ? (
                <Textarea
                  id={name}
                  name={name}
                  rows={3}
                  required={required}
                  defaultValue={setDefaultValue(actionType, name, pet)}
                />
              ) : (
                <Input
                  id={name}
                  name={name}
                  type={type}
                  required={required}
                  defaultValue={setDefaultValue(actionType, name, pet)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-right mt-5">
        <Button type="submit">
          <>
            {actionType === "add" && "Add"}
            {actionType === "edit" && "Update"}
          </>
        </Button>
      </div>
    </form>
  );
}
