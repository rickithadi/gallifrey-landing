import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">G</span>
              </div>
              <div>
                <span className="font-bold text-lg">Gallifrey Consulting</span>
                <p className="text-xs text-primary-foreground/70">Engineering Digital Trust</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Your idea-to-secure-launch partner. Enterprise-grade security, boutique care, 
              and bespoke processes that adapt to your evolving needs.
            </p>
            <p className="text-xs text-accent font-medium">
              Payment-First Digital Guardians
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-accent">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-accent transition-colors">Personal Websites</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Business Web Apps</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">E-commerce Solutions</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Security Audits</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Payment Integration</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Strategy Consulting</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-accent">Our Approach</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-accent transition-colors">Security First</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Bespoke Craftsmanship</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Design Excellence</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Trust & Transparency</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy by Design</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">SEO Excellence</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-accent">Get Started</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#contact" className="hover:text-accent transition-colors">Free 30min Consultation</a></li>
              <li><a href="mailto:hello@gallifreyconsulting.com" className="hover:text-accent transition-colors">hello@gallifreyconsulting.com</a></li>
              <li className="text-primary-foreground/50">Response within 24 hours</li>
            </ul>
            
            <div className="mt-6 space-y-2">
              <h5 className="font-medium text-accent">Core Values</h5>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">GDPR Compliant</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">PCI-DSS Secure</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Zero-Trust</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-12 bg-primary-foreground/10" />
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <p className="text-sm text-primary-foreground/70">
              © 2024 Gallifrey Consulting. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/50 mt-1">
              Mastering Digital Complexity • Fortifying Your Digital Experiences
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-primary-foreground/70">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Security Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Data Protection</a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-primary-foreground/40 italic">
            "Build your digital TARDIS—secure, custom, ready to regenerate" ✨
          </p>
        </div>
      </div>
    </footer>
  );
}