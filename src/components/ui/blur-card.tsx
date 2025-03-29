
import * as React from "react";
import { cn } from "@/lib/utils";

const BlurCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-card rounded-xl border border-white/10 p-6",
      className
    )}
    {...props}
  />
));

BlurCard.displayName = "BlurCard";

const BlurCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));

BlurCardHeader.displayName = "BlurCardHeader";

const BlurCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

BlurCardTitle.displayName = "BlurCardTitle";

const BlurCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

BlurCardDescription.displayName = "BlurCardDescription";

const BlurCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));

BlurCardContent.displayName = "BlurCardContent";

const BlurCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));

BlurCardFooter.displayName = "BlurCardFooter";

export {
  BlurCard,
  BlurCardHeader,
  BlurCardFooter,
  BlurCardTitle,
  BlurCardDescription,
  BlurCardContent,
};
