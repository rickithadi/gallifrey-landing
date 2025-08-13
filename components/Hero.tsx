import { AnimatedAdjective } from "./AnimatedAdjective";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";

export function Hero() {
  return (
    <section className="relative py-32 md:py-40 px-4" aria-labelledby="hero-heading">
      <div className="container mx-auto max-w-4xl">
        {/* Main headline - minimalist approach */}
        <header className="text-center mb-16">
          <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-[0.9] mb-8 text-primary">
            We build{' '}
            <AnimatedAdjective className="italic text-accent" />
            <br />
            digital solutions
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Data services, software consultancy, and custom development. Security-first, pixel perfect solutions that scale with your business.
          </p>
        </header>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8 py-3 bg-primary hover:bg-primary/90 transition-colors" asChild>
            <a
              href="#contact"
              onClick={() => trackCTAClick("hero-start-project")}
            >
              Start a project
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50" asChild>
            <a
              href="https://calendly.com/rickithadi/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick("hero-consultation")}
            >
              30-minute consultation
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
