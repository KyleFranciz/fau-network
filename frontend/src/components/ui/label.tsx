import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed", className)}
      {...rest}
    />
  );
});
Label.displayName = "Label";

export { Label };

