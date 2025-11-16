import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        outline: "border-border text-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        success: "border-transparent bg-emerald-100 text-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

const Badge = (props: BadgeProps): JSX.Element => {
  const { className, variant, ...rest } = props;
  return <div className={cn(badgeVariants({ variant, className }))} {...rest} />;
};

export { Badge, badgeVariants };

