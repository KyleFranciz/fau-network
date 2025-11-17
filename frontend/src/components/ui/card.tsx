import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("rounded-xl  bg-card text-card-foreground", className)}
      {...rest}
    />
  );
});
Card.displayName = "Card";

const CardHeader = (props: React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const { className, ...rest } = props;
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...rest} />;
};

const CardTitle = (props: React.HTMLAttributes<HTMLHeadingElement>): JSX.Element => {
  const { className, ...rest } = props;
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...rest} />;
};

const CardDescription = (props: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element => {
  const { className, ...rest } = props;
  return <p className={cn("text-sm text-muted-foreground", className)} {...rest} />;
};

const CardContent = (props: React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const { className, ...rest } = props;
  return <div className={cn("p-6 pt-0", className)} {...rest} />;
};

const CardFooter = (props: React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const { className, ...rest } = props;
  return <div className={cn("flex items-center p-6 pt-0", className)} {...rest} />;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

