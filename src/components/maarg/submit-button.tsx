"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";


type Props = ComponentProps<typeof Button> & {
  children: React.ReactNode;
};

export function SubmitButton({ children, className, ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending} className={cn(props.variant === "accent" ? "" : "transition-all duration-300 hover:scale-105", className)}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
