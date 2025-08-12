import { Menu, X } from "lucide-react";

import { Button } from "./ui/button";
import Link from "next/link";
import { Logo } from "./Logo";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "/own-your-narrative", label: "Own Your Narrative", isExternal: true },
    { href: "#work", label: "Work" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo width={120} height={37} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isExternal ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-sm border-muted-foreground/20 hover:bg-muted/50"
              asChild
            >
              <a href="https://calendly.com/rickithadi/30min" target="_blank" rel="noopener noreferrer">
                Get in touch
              </a>
            </Button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-muted/50 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/30">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                item.isExternal ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm border-muted-foreground/20"
                  asChild
                >
                  <a href="https://calendly.com/rickithadi/30min" target="_blank" rel="noopener noreferrer">
                    Get in touch
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
