"use client";
import React from "react";
import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  // To use useFormStatus the component must be a child of a Form component
  // const { pending } = useFormStatus(); // replaced with optimistic updates

  return (
    <Button type="submit">
      <>
        {actionType === "add" && "Add"}
        {actionType === "edit" && "Update"}
      </>
    </Button>
  );
}
