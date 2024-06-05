"use client";
import { usePetContext } from "@/lib/hooks";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Pet } from "@/lib/types";

type FormFields = {
  name: string;
  ownerName: string;
  age: number;
  imageUrl: string;
  notes: string;
};

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

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet } = usePetContext();

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
      imageUrl: formObject.imageUrl || "/placeholder.svg",
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
                <Textarea id={name} name={name} rows={3} required={required} />
              ) : (
                <Input id={name} name={name} type={type} required={required} />
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
