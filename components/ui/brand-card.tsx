import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const cardVariants = cva(
  "rounded-lg p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white border border-border shadow-sm hover:shadow-md",
        gallifrey: "bg-white border border-gallifrey-border shadow-gallifrey hover:shadow-gallifrey-lg",
        "gallifrey-elevated": "bg-white border border-gallifrey-border shadow-gallifrey-lg hover:shadow-gallifrey-xl",
        oyn: "bg-white border border-oyn-stone-200 shadow-oyn hover:shadow-oyn-lg",
        "oyn-elevated": "bg-white border border-oyn-stone-200 shadow-oyn-lg hover:shadow-oyn-xl",
        glass: "glass-card",
        flat: "bg-white border border-border",
      },
      padding: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:transform hover:-translate-y-1",
        scale: "hover:scale-105",
        glow: "hover-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      hover: "none",
    },
  },
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

function Card({
  className,
  variant,
  padding,
  hover,
  children,
  as: Component = "div",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(cardVariants({ variant, padding, hover, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-serif font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };