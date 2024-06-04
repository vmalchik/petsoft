"use client";

import { Button, ButtonProps } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

type PetButtonProps = ButtonProps & {
  actionType: "add" | "edit" | "checkout";
};

export default function PetButton({
  children,
  actionType,
  ...props
}: PetButtonProps) {
  if (actionType === "add") {
    return (
      <Button size="icon" {...props}>
        <PlusIcon className="h-6 w-6" />
      </Button>
    );
  }

  if (actionType === "edit") {
    return (
      <Button variant="secondary" {...props}>
        {children}
      </Button>
    );
  }

  if (actionType === "checkout") {
    return (
      <Button variant="secondary" {...props}>
        {children}
      </Button>
    );
  }
}
