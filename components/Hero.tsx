import { ArrowRight, Lock, Search, Shield, Sparkles } from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-gray/30 via-background to-accent/5"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto text-center max-w-6xl relative z-10">
        <Badge className="mb-8 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors duration-300 animate-fade-in" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          Payment-First Digital Guardians
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 animate-slide-up">
          <span className="font-heading text-primary font-bold">Engineering</span>{" "}
          <span className="font-serif text-gradient-brand font-semibold italic">
            Digital Trust
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-4xl mx-auto font-body leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          We engineer exceptional digital experiences that are secure, strategic, and built for business growth—starting at just{" "}
          <span className="text-accent font-semibold bg-accent/10 px-2 py-1 rounded-md">$500</span>.
        </p>

        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto font-body animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Fortifying your digital experiences with bullet-proof security and world-class design on every pixel.
          Where enterprise-grade meets boutique care.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button size="lg" className="text-lg px-10 py-4 bg-primary hover:bg-primary/90 shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 group">
            Start Your Digital Fortress
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-10 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-brand hover:shadow-brand-lg transition-all duration-300">
            Free 30min Kickoff Call
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50 shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary">Data Privacy by Design</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">GDPR & CCPA compliant from day one with automated data minimization</p>
          </div>

          <div className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50 shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Search className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary">SEO as Visibility Engine</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">Optimized for discovery, performance tested, and schema tagged</p>
          </div>

          <div className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50 shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary">Narrative Control</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">Own your digital story, not rent it on social platforms</p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Enterprise-grade security</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Boutique-level care</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Pay only if satisfied</span>
          </div>
        </div>
      </div>
    </section>
  );
}
