import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-all duration-100",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Enhanced click handler for better responsiveness
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent default if disabled
      if (props.disabled) {
        e.preventDefault();
        return;
      }
      
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Call the original onClick
      onClick?.(e);
    }, [onClick, props.disabled]);

    // Enhanced touch handlers for better mobile responsiveness
    const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
      if (!props.disabled) {
        e.currentTarget.style.transform = 'scale(0.95)';
      }
    }, [props.disabled]);

    const handleTouchEnd = React.useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
      if (!props.disabled) {
        e.currentTarget.style.transform = 'scale(1)';
      }
    }, [props.disabled]);

    // When asChild is true, don't pass event handlers (for Server Components compatibility)
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          WebkitTapHighlightColor: 'transparent', // Remove iOS tap highlight
          touchAction: 'manipulation', // Improve touch responsiveness
          userSelect: 'none', // Prevent text selection
          ...props.style
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 