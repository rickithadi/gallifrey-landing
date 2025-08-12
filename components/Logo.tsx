import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 150, height = 46 }: LogoProps) {
  return (
    <Link href="/" className={`group ${className}`}>
      <div className="flex items-center">
        <ImageWithFallback
          src="/gallifrey-logo.png"
          alt="Gallifrey Consulting - Security-First Web Development"
          width={width}
          height={height}
          className="transition-opacity duration-200 group-hover:opacity-80"
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>
    </Link>
  );
}

// Fallback text logo component for cases where image fails
export function TextLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group ${className}`}>
      <div className="flex flex-col">
        <span className="font-serif text-2xl font-medium text-primary tracking-tight">
          Gallifrey
        </span>
        <div className="text-xs text-muted-foreground/80 font-medium tracking-wider uppercase mt-0.5">
          Consulting
        </div>
      </div>
    </Link>
  );
}
