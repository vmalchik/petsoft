"use client";
import React from "react";
import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button type="submit">
      <>
        {actionType === "add" && "Add"}
        {actionType === "edit" && "Update"}
      </>
    </Button>
  );
}
