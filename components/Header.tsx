import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <div>
              <span className="font-bold text-lg">Gallifrey Consulting</span>
              <p className="text-xs text-muted-foreground">Engineering Digital Trust</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="hover:text-primary transition-colors font-medium">Services</a>
            <a href="#process" className="hover:text-primary transition-colors font-medium">Process</a>
            <a href="#narrative" className="hover:text-primary transition-colors font-medium">Own Your Narrative</a>
            <a href="#pricing" className="hover:text-primary transition-colors font-medium">Pricing</a>
            <a href="#contact" className="hover:text-primary transition-colors font-medium">Contact</a>
          </nav>
          
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Free Consultation
          </Button>
        </div>
      </div>
    </header>
  );
}