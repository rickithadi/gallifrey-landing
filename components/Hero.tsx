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
      {/* Sophisticated geometric background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-background to-accent/3 pointer-events-none"></div>
      
      {/* Geometric grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(30, 41, 59, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 41, 59, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Subtle floating elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-accent/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-60 w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-300"></div>
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-accent/25 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-60 left-80 w-1 h-1 bg-primary/20 rounded-full animate-pulse delay-1000"></div>
      
      {/* Elegant diagonal accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/[0.02] to-transparent pointer-events-none transform rotate-12"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/[0.02] to-transparent pointer-events-none transform -rotate-12"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Main headline - minimalist approach */}
        <header className="text-center mb-16">
          <h1
            ref={headlineAnimation.ref}
            id="hero-heading"
            className={`text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-8 text-primary text-center animate-fade-up animate-delay-200 ${headlineAnimation.isVisible ? 'visible' : ''}`}
          >
            <span className="inline-block animate-slide-in-left">We craft bespoke, security-first websites</span>
            <span className="block italic text-accent mt-2 animate-slide-in-right animate-delay-500"> with obsessive attention to detail</span>
          </h1>

          <p
            ref={subtitleAnimation.ref}
            className={`text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-up animate-delay-400 ${subtitleAnimation.isVisible ? 'visible' : ''}`}
          >
            Every line of code written from scratch, every pixel positioned with mathematical precision. Custom-built digital solutions with enterprise security architecture, bespoke design systems, and comprehensive digital narrative control. No templates, no shortcuts—just artisanal web development that delivers complete ownership of your code, data, and digital future.
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
