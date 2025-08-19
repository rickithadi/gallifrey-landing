import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="mb-4">
              <Logo width={140} height={43} />
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">
              Bespoke digital solutions with enterprise-grade security and comprehensive digital narrative control.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4 text-primary">Get Started</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#contact" className="hover:text-accent transition-colors">Free Consultation</a></li>
              <li><a href="mailto:hello@gallifreyconsulting.com" className="hover:text-accent transition-colors">hello@gallifreyconsulting.com</a></li>
            </ul>
          </div>

          {/* Compliance badges */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4 text-primary">Security Standards</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">GDPR Compliant</span>
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Enterprise Security</span>
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Zero Trust</span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 Gallifrey Consulting. All rights reserved. ABN: 69 696 168 286
              </p>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
