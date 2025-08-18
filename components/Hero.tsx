import { AnimatedAdjective } from "./AnimatedAdjective";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { trackVariantConversion } from "@/lib/ab-test";
import { useABTest } from "./ABTestProvider";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

export function Hero() {
  const { variant } = useABTest();
  const headlineAnimation = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation<HTMLParagraphElement>({ threshold: 0.1 });
  const ctaAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  const handleCTAClick = (action: string) => {
    trackCTAClick(action);
    trackVariantConversion(variant, action);
  };

  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" aria-labelledby="hero-heading">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Main headline - minimalist approach */}
        <header className="text-center mb-16">
          <h1
            ref={headlineAnimation.ref}
            id="hero-heading"
            className={`text-3xl md:text-5xl lg:text-6xl font-heading font-medium leading-[1.1] mb-8 text-foreground text-center animate-fade-up animate-delay-200 ${headlineAnimation.isVisible ? 'visible' : ''}`}
          >
            <span className="block">We build</span>
            <span className="block">
              <AnimatedAdjective className="italic text-accent" />
            </span>
            <span className="block">digital solutions</span>
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
          <Button size="lg" className="px-10 py-4 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" asChild>
            <a
              href="#contact"
              onClick={() => handleCTAClick("hero-commission-site")}
            >
              Commission Your Site
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 border-muted-foreground/30 text-muted-foreground hover:bg-muted/30 hover:border-muted-foreground/40" asChild>
            <a
              href="https://calendly.com/rickithadi/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCTAClick("hero-consultation")}
            >
              30-minute consultation
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
