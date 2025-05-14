
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
        // New medal variants
        gold: "border-transparent bg-gradient-to-r from-yellow-500 to-amber-600 text-white",
        purple: "border-transparent bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
        blue: "border-transparent bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
        green: "border-transparent bg-gradient-to-r from-green-500 to-emerald-600 text-white",
        bronze: "border-transparent bg-gradient-to-r from-orange-400 to-amber-500 text-white",
        silver: "border-transparent bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
        platinum: "border-transparent bg-gradient-to-r from-gray-300 to-blue-200 text-gray-800",
        diamond: "border-transparent bg-gradient-to-r from-blue-300 to-cyan-200 text-gray-800",
      },
      size: {
        default: "h-6 text-xs px-2",
        sm: "h-5 text-[10px] px-1.5",
        lg: "h-8 text-sm px-3 py-1",
        xl: "h-10 text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
