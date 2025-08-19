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
      {/* Enhanced background with more texture and animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/10 pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/15 rounded-full blur-2xl pointer-events-none animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none animate-shimmer"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(120,119,198,0.1),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Main headline - minimalist approach */}
        <header className="text-center mb-16">
          <h1
            ref={headlineAnimation.ref}
            id="hero-heading"
            className={`text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-8 text-primary text-center animate-fade-up animate-delay-200 ${headlineAnimation.isVisible ? 'visible' : ''}`}
          >
            <span className="inline-block animate-slide-in-left">We craft tasteful, secure websites</span>
            <span className="block italic text-accent mt-2 animate-slide-in-right animate-delay-500"> that you actually own</span>
          </h1>

          <p
            ref={subtitleAnimation.ref}
            className={`text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-up animate-delay-400 ${subtitleAnimation.isVisible ? 'visible' : ''}`}
          >
            Hand-crafted websites with obsessive attention to design detail and enterprise security built-in from day one. No templates, no WordPress, no vendor lock-in. Complete ownership of your code, data, and digital future.
          </p>
        </header>

        {/* CTA Section */}
        <div
          ref={ctaAnimation.ref}
          className={`flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-600 ${ctaAnimation.isVisible ? 'visible' : ''}`}
        >
          <Button size="lg" className="px-10 py-4 bg-primary hover:bg-primary/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium tracking-wide animate-bounce-in animate-delay-700 group" asChild>
            <a
              href="#contact"
              onClick={() => handleCTAClick("hero-commission-site")}
            >
              Commission Your Site
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 border border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 font-medium tracking-wide animate-bounce-in animate-delay-800" asChild>
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
