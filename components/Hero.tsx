import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, Lock, Search } from "lucide-react";

export function Hero() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto text-center max-w-5xl">
        <Badge className="mb-6 bg-accent/10 text-accent border-accent/20" variant="secondary">
          Payment-First Digital Guardians
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
          <span className="text-primary">Engineering</span>{" "}
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Digital Trust
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          We engineer exceptional digital experiences that are secure, strategic, and built for business growth—starting at just{" "}
          <span className="text-accent font-semibold">$500</span>.
        </p>
        
        <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
          Fortifying your digital experiences with bullet-proof security and world-class design on every pixel. 
          Where enterprise-grade meets boutique care.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
            Start Your Digital Fortress
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            Free 30min Kickoff Call
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-primary">Data Privacy by Design</h3>
            <p className="text-sm text-muted-foreground text-center">GDPR & CCPA compliant from day one</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-primary">SEO as Visibility Engine</h3>
            <p className="text-sm text-muted-foreground text-center">Optimized for discovery & performance</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-primary">Narrative Control</h3>
            <p className="text-sm text-muted-foreground text-center">Own your digital story, not rent it</p>
          </div>
        </div>
      </div>
    </section>
  );
}