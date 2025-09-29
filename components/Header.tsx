import { Menu, X } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { useState, useEffect, useCallback, memo } from "react";
import { useTranslation } from 'next-i18next';

const HeaderComponent = function Header() {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 20);
    
    // Update active section for better UX
    const sections = ['services', 'testimonials', 'pricing', 'faq', 'contact'];
    const currentSection = sections.find(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    setActiveSection(currentSection || '');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    closeMenu();
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [closeMenu]);

  const navItems = [
    { href: "#services", label: t('navigation.services'), id: 'services' },
    { href: "#testimonials", label: t('navigation.results'), id: 'testimonials' },
    { href: "#pricing", label: t('navigation.investment'), id: 'pricing' },
    { href: "#faq", label: t('navigation.faq'), id: 'faq' },
    { href: "#contact", label: t('navigation.contact'), id: 'contact' },
  ];

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#services" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-md focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all"
        onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
      >
        {t('navigation.skipToMain')}
      </a>
      <header className={`border-b border-border/30 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/98 shadow-lg shadow-primary/5 py-2' 
        : 'bg-white/95 py-4'
    }`}
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 transition-opacity duration-200">
              <Logo width={120} height={37} className="transition-opacity duration-200 hover:opacity-95" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-3 py-2 text-sm font-normal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 ${
                    isActive 
                      ? 'text-primary bg-primary/2' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/2'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-px bg-primary/40" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-6">
            <Button
              size="sm"
              className="hidden sm:block text-sm bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2 font-normal transition-colors duration-200 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
              onClick={() => window.open("https://calendly.com/rickithadi/30min", "_blank", "noopener,noreferrer")}
            >
              {t('navigation.getStarted')}
            </Button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-muted/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-[500px] opacity-100 py-6 border-t border-border/30' 
              : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`text-sm font-normal px-4 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 ${
                    isActive 
                      ? 'text-primary bg-primary/2' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/2'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {isActive && <div className="w-1 h-1 bg-primary/40" />}
                  </div>
                </a>
              );
            })}
            
            <div className="pt-6 border-t border-border/30">
              <Button
                className="w-full text-sm bg-primary hover:bg-primary/95 text-primary-foreground py-3 font-normal transition-colors duration-200 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
                onClick={() => {
                  closeMenu();
                  window.open("https://calendly.com/rickithadi/30min", "_blank", "noopener,noreferrer");
                }}
              >
                {t('navigation.getStarted')}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
};

// Memoize the header component for performance
export const Header = memo(HeaderComponent, () => {
  // Header has no props, so we can optimize by preventing unnecessary re-renders
  return true;
});
