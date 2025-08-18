import { AnimatedAdjective } from "./AnimatedAdjective";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

export function Hero() {
  const headlineAnimation = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation<HTMLParagraphElement>({ threshold: 0.1 });
  const ctaAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative py-40 md:py-48 px-4" aria-labelledby="hero-heading">
      <div className="container mx-auto max-w-4xl">
        {/* Main headline - minimalist approach */}
        <header className="text-center mb-16">
          <h1
            ref={headlineAnimation.ref}
            id="hero-heading"
            className={`text-4xl md:text-6xl lg:text-7xl font-heading font-medium leading-[0.9] mb-8 text-foreground animate-fade-up animate-delay-200 ${headlineAnimation.isVisible ? 'visible' : ''}`}
          >
            We build{' '}
            <AnimatedAdjective className="italic text-accent" />
            <br />
            digital solutions
          </h1>

          <p
            ref={subtitleAnimation.ref}
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body animate-fade-up animate-delay-400 ${subtitleAnimation.isVisible ? 'visible' : ''}`}
          >
            Data services, software consultancy, and custom development. Security-first, pixel perfect solutions that scale with your business.
          </p>
        </header>

        {/* CTA Section */}
        <div
          ref={ctaAnimation.ref}
          className={`flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-600 ${ctaAnimation.isVisible ? 'visible' : ''}`}
        >
          <Button size="lg" className="px-10 py-4 bg-primary hover:bg-primary/90 transition-colors" asChild>
            <a
              href="#contact"
              onClick={() => trackCTAClick("hero-commission-site")}
            >
              Commission Your Site
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
