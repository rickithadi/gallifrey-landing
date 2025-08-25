import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const sectionVariants = cva(
  "py-20 px-4",
  {
    variants: {
      background: {
        white: "bg-white",
        "gallifrey-section": "bg-gallifrey-off-white",
        "oyn-section": "bg-oyn-stone-50",
        "oyn-gradient": "bg-gradient-to-b from-oyn-stone-100 to-oyn-stone-50",
        "gallifrey-gradient": "bg-gradient-to-b from-gallifrey-off-white to-white",
        transparent: "bg-transparent",
      },
      padding: {
        default: "py-20",
        sm: "py-12",
        lg: "py-32",
        xl: "py-40",
      },
      container: {
        default: "container mx-auto max-w-6xl",
        wide: "container mx-auto max-w-7xl",
        narrow: "container mx-auto max-w-4xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      background: "white",
      padding: "default",
      container: "default",
    },
  },
);

const containerVariants = cva(
  "mx-auto",
  {
    variants: {
      size: {
        default: "max-w-6xl",
        wide: "max-w-7xl",
        narrow: "max-w-4xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
  containerClassName?: string;
}

function Section({
  className,
  background,
  padding,
  container,
  containerClassName,
  children,
  as: Component = "section",
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ background, padding, className }))}
      {...props}
    >
      <div className={cn(containerVariants({ size: container }), containerClassName)}>
        {children}
      </div>
    </Component>
  );
}

export { Section, sectionVariants };