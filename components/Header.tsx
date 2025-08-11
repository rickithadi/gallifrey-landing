import { Menu, Shield, X } from "lucide-react";

import { Button } from "./ui/button";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#narrative", label: "Own Your Narrative" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-brand">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-all duration-300 group-hover:scale-105">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-logo font-semibold text-2xl text-primary tracking-wide">Gallifrey</span>
              <div className="flex items-center space-x-2">
                <span className="font-body font-medium text-xs text-muted-foreground tracking-[0.2em] uppercase">CONSULTING</span>
                <div className="w-1 h-1 bg-accent rounded-full"></div>
                <span className="text-xs text-accent font-medium">Engineering Digital Trust</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground shadow-brand hover:shadow-brand-lg transition-all duration-300 font-body font-medium">
              Free Consultation
            </Button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-secondary/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border/50">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-brand font-body font-medium">
                  Free Consultation
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
