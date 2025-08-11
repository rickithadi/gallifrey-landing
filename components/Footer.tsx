export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="mb-4">
                <span className="font-serif text-2xl font-medium text-primary tracking-tight">
                  Gallifrey
                </span>
                <div className="text-xs text-muted-foreground/80 font-medium tracking-wider uppercase mt-0.5">
                  Consulting
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                We build digital experiences that earn trust through thoughtful craftsmanship,
                security-first development, and ongoing partnership.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Security-First</span>
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">GDPR Compliant</span>
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Performance Optimized</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-accent transition-colors">Custom Development</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">E-commerce Platforms</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Web Applications</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Security Consulting</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Performance Optimization</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary">Get Started</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#contact" className="hover:text-accent transition-colors">Free Consultation</a></li>
              <li><a href="mailto:hello@gallifreyconsulting.com" className="hover:text-accent transition-colors">hello@gallifreyconsulting.com</a></li>
              <li className="text-muted-foreground/70">Response within 24 hours</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 Gallifrey Consulting. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
