import { Button, ButtonProps } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

type PetButtonProps = ButtonProps & {
  action: "add" | "edit" | "checkout";
};

export default function PetButton({ children, ...props }: PetButtonProps) {
  const { action } = props;
  if (action === "add") {
    return (
      <Button size="icon" {...props}>
        <PlusIcon className="h-6 w-6" />
      </Button>
    );
  }

  if (action === "edit") {
    return (
      <Button variant="secondary" {...props}>
        {children}
      </Button>
    );
  }

  if (action === "checkout") {
    return (
      <Button variant="secondary" {...props}>
        {children}
      </Button>
    );
  }
}
