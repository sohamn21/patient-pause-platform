
import * as React from "react";
import { cn } from "@/lib/utils";

const GlowButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    glowColor?: string;
    glowSize?: "sm" | "md" | "lg";
  }
>(({ 
  className, 
  variant = "default", 
  size = "default", 
  glowColor = "from-primary/40 via-primary/10 to-transparent", 
  glowSize = "md",
  ...props 
}, ref) => {
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const glowSizeClasses = {
    sm: "blur-[10px] -z-10 opacity-50 h-6 w-[70%]",
    md: "blur-[20px] -z-10 opacity-50 h-8 w-[85%]",
    lg: "blur-[30px] -z-10 opacity-50 h-10 w-full",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {(variant === "default" || variant === "secondary") && (
        <div 
          className={cn(
            "absolute bottom-0 rounded-full bg-gradient-to-r",
            glowColor,
            glowSizeClasses[glowSize]
          )}
        />
      )}
      {props.children}
    </button>
  );
});

GlowButton.displayName = "GlowButton";

export { GlowButton };
