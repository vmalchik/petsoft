"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";

type PetButtonProps = ButtonProps & {
  actionType: "add" | "edit" | "checkout";
};

export default function PetButton({
  children,
  actionType,
  ...props
}: PetButtonProps) {
  if (actionType === "checkout") {
    return (
      <Button variant="secondary" {...props}>
        {children}
      </Button>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size="icon" {...props}>
            <PlusIcon className="h-6 w-6" />
          </Button>
        ) : (
          actionType === "edit" && (
            <Button variant="secondary" {...props}>
              {children}
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <>
              {actionType === "add" && "Add new pet"}
              {actionType === "edit" && "Edit pet details"}
            </>
          </DialogTitle>
        </DialogHeader>
        <PetForm actionType={actionType} />
      </DialogContent>
    </Dialog>
  );
}
