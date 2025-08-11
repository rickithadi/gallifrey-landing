import { ArrowRight, Shield, Users, Zap } from "lucide-react";

import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative py-24 md:py-32 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Editorial-style intro */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
            Digital Security & Strategy
          </p>
          <div className="w-12 h-px bg-accent mx-auto"></div>
        </div>

        {/* Main headline - Faculty Dept inspired typography */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-[0.9] mb-8 text-primary">
            We build digital experiences
            <br />
            <span className="italic text-accent">worth trusting</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body">
            Security-first web development that doesn't compromise on design or performance.
            Starting at $500, because good work shouldn't break the bank.
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button size="lg" className="px-8 py-3 bg-primary hover:bg-primary/90 transition-colors">
            Start a project
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
            30-minute consultation
          </Button>
        </div>

        {/* Three-column feature grid - cleaner, more editorial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center group">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-4 text-primary">Security by Design</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              GDPR compliance, data encryption, and privacy protection built into every project from day one.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-4 text-primary">Performance First</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Optimized for speed, SEO, and user experience. Your site loads fast and ranks well.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-4 text-primary">Human-Centered</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              We design for real people, not just metrics. Accessible, intuitive, and genuinely useful.
            </p>
          </div>
        </div>

        {/* Trust indicators - more subtle */}
        <div className="mt-20 pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs text-muted-foreground/80 uppercase tracking-wider">
            <span>Enterprise Security</span>
            <span>•</span>
            <span>Boutique Service</span>
            <span>•</span>
            <span>Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
