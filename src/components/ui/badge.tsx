
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: 
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        info: 
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        gold: 
          "border-transparent bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-inner",
        purple: 
          "border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-inner",
        premium: 
          "border border-yellow-400 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-400 shadow-inner",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[0.625rem]",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
      size?: "default" | "sm" | "lg" | "xl";
    }

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
