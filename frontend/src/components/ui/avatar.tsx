import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border", className)}
      {...rest}
    />
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>((props, ref) => {
  const { className, ...rest } = props;
  return <AvatarPrimitive.Image ref={ref} className={cn("h-full w-full object-cover", className)} {...rest} />;
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center bg-muted text-sm font-medium", className)}
      {...rest}
    />
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

