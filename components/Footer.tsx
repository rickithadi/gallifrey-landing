import React from "react";
import { Logo } from "./Logo";

export const Footer = React.memo(function Footer() {
  return (
    <footer className="bg-background border-t border-border/30">
      <div className="container mx-auto px-4 py-8">
        {/* Single streamlined row */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Left: Brand + Description */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
              <Logo width={120} height={37} />
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Enterprise security and digital sovereignty for Melbourne businesses.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md">GDPR</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md">Zero Trust</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md">Enterprise</span>
              </div>
            </div>
          </div>

          {/* Right: Contact + Legal */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
            <div className="space-y-1">
              <a href="#contact" className="text-sm font-medium text-primary hover:text-accent transition-colors block">
                Start Consultation
              </a>
              <a href="mailto:hello@gallifreyconsulting.com" className="text-xs text-muted-foreground hover:text-accent transition-colors block">
                hello@gallifreyconsulting.com
              </a>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>© 2024 Gallifrey Consulting</p>
              <div className="flex gap-3">
                <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                <a href="#" className="hover:text-accent transition-colors">Terms</a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
});
