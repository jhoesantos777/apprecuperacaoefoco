
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[18px] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-teal-600 to-green-500 text-black hover:from-teal-700 hover:to-green-600 shadow-md",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-black hover:from-red-700 hover:to-red-600 shadow-md",
        outline:
          "border border-black/30 bg-white/40 backdrop-blur-md text-black hover:bg-white/60 shadow-sm",
        secondary:
          "bg-gradient-to-r from-teal-600 to-blue-500 text-black hover:from-teal-700 hover:to-blue-600 shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground text-black",
        link: "text-black underline-offset-4 hover:underline",
        glass: "bg-white/40 backdrop-blur-md border border-white/40 text-black hover:bg-white/60 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[14px] px-3",
        lg: "h-12 rounded-[18px] px-8 text-base",
        xl: "h-14 rounded-[20px] px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
