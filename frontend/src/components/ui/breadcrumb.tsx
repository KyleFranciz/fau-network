import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItemProps = {
  href?: string;
  isCurrent?: boolean;
  label: string;
};

const BreadcrumbList = (props: React.HTMLAttributes<HTMLOListElement>): JSX.Element => {
  const { className, ...rest } = props;
  return <ol className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)} {...rest} />;
};

const BreadcrumbItem = (props: BreadcrumbItemProps): JSX.Element => {
  const { href, isCurrent = false, label } = props;
  const sharedProps = {
    className: cn(
      "rounded-lg px-2 py-1 transition-colors",
      isCurrent ? "bg-muted text-foreground" : "hover:bg-muted/60",
    ),
    "aria-current": isCurrent ? "page" : undefined,
  };
  if (!href || isCurrent) {
    return <span {...sharedProps}>{label}</span>;
  }
  return (
    <a href={href} {...sharedProps}>
      {label}
    </a>
  );
};

const BreadcrumbSeparator = (): JSX.Element => (
  <span className="text-muted-foreground" aria-hidden="true">
    <ChevronRight className="h-4 w-4" />
  </span>
);

const Breadcrumb = (props: { items: BreadcrumbItemProps[] }): JSX.Element => {
  const { items } = props;
  return (
    <nav aria-label="Breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <BreadcrumbItem {...item} />
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </nav>
  );
};

export type { BreadcrumbItemProps };
export { Breadcrumb };

