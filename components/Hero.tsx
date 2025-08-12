import { ArrowRight, Shield, Users, Zap } from "lucide-react";

import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative py-24 md:py-32 px-4" aria-labelledby="hero-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Editorial-style intro */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
            Digital Security & Strategy
          </p>
          <div className="w-12 h-px bg-accent mx-auto" role="presentation"></div>
        </div>

        {/* Main headline - Faculty Dept inspired typography */}
        <header className="text-center mb-16">
          <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-[0.9] mb-8 text-primary">
            We craft pixel-perfect
            <br />
            <span className="italic text-accent">digital experiences</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body">
            Custom-coded websites with obsessive attention to design detail. Every pixel positioned with purpose, every interaction crafted to perfection. Starting at $500, because exceptional work shouldn&apos;t break the bank.
          </p>
        </header>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button size="lg" className="px-8 py-3 bg-primary hover:bg-primary/90 transition-colors" asChild>
            <a href="#contact">
              Start a project
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50" asChild>
            <a href="https://calendly.com/rickithadi/30min" target="_blank" rel="noopener noreferrer">
              30-minute consultation
            </a>
          </Button>
        </div>

        {/* Three-column feature grid - cleaner, more editorial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center group">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-4 text-primary">Pixel-Perfect Design</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Every element positioned with mathematical precision. Custom design systems built from scratch with obsessive attention to detail.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-4 text-primary">Performance Perfection</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Hand-optimized code architecture for lightning-fast loading. Every interaction smooth, every animation purposeful.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-4 text-primary">Security by Design</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Military-grade security woven into every line of code. GDPR compliance and privacy protection built from the ground up.
            </p>
          </div>
        </div>

        {/* Trust indicators - more subtle */}
        <div className="mt-20 pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs text-muted-foreground/80 uppercase tracking-wider">
            <span>Pixel-Perfect Craftsmanship</span>
            <span>•</span>
            <span>Custom Design Systems</span>
            <span>•</span>
            <span>Obsessive Attention to Detail</span>
          </div>
        </div>
      </div>
    </section>
  );
}
