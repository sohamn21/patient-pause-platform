
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, ...props }, ref) => {
    return (
      <div className={cn("flex h-10 items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
        {prefix && <div className="flex items-center pl-3">{prefix}</div>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border-0 bg-transparent py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            !suffix ? (!prefix ? "px-3" : "pl-1 pr-3") : !prefix ? "pl-3 pr-1" : "px-1"
          )}
          ref={ref}
          {...props}
        />
        {suffix && <div className="flex items-center pr-3">{suffix}</div>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
