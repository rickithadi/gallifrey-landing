import React, { Suspense, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { useLayoutABTest } from "./LayoutABTestProvider";
import { trackLayoutVariantConversion } from "@/lib/layout-ab-test";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { PlaceholderAnimation } from "./PlaceholderAnimation";
import { PerformanceProfiler } from "./PerformanceProfiler";
import dynamic from "next/dynamic";

// Use Gallifreyan Three.js background
const HeroThreeBackground = dynamic(
  () => import("./GallifreyanThreeBackground").then(mod => ({ default: mod.GallifreyanThreeBackground })),
  { 
    ssr: false, 
    loading: () => <PlaceholderAnimation />
  }
);

// Coin animation component
const CoinAnimation = dynamic(
  () => import("./CoinAnimation").then(mod => ({ default: mod.CoinAnimation })),
  { 
    ssr: false, 
    loading: () => <div className="w-[120px] h-[120px] bg-gray-200 rounded-full animate-pulse" />
  }
);

export const Hero = React.memo(function Hero() {
  const { variant } = useLayoutABTest();
  const headlineAnimation = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.1,
  });
  const ctaAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
    trackLayoutVariantConversion(variant, action);
  }, [variant]);

  if (variant === "lightweight") {
    return (
      <section
        className="relative min-h-screen px-4 overflow-hidden flex items-center"
        style={{ minHeight: 'calc(100vh - 4rem)' }}
        aria-labelledby="hero-heading"
        data-testid="hero-section-lightweight"
      >
        <PerformanceProfiler id="HeroThreeBackground-lightweight">
          <Suspense fallback={<PlaceholderAnimation />}>
            <HeroThreeBackground className="opacity-30 md:opacity-60" />
          </Suspense>
        </PerformanceProfiler>
        <div className="container mx-auto relative z-20">
          <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
            <header className="mb-8">
              <h1
                ref={headlineAnimation.ref}
                id="hero-heading"
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-light leading-tight text-gallifrey-charcoal tracking-wide animate-fade-in-up hero-animation ${
                  headlineAnimation.isVisible ? "visible complete" : ""
                }`}
              >
Two Sides.<br /><span className="text-authority">One Solution.</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gallifrey-charcoal/70 font-light mt-6 leading-relaxed max-w-2xl">
Master both surveillance and privacy.
              </p>
              <div className="flex items-center justify-center md:justify-start flex-wrap gap-2 mt-8 text-sm text-gallifrey-charcoal/60 font-light">
                <span>Secure</span>
                <span className="hidden sm:inline mx-1">·</span>
                <span className="sm:hidden">•</span>
                <span>Private</span>
                <span className="hidden sm:inline mx-1">·</span>
                <span className="sm:hidden">•</span>
                <span className="whitespace-nowrap">Controlled</span>
              </div>
            </header>

            <div
              ref={ctaAnimation.ref}
              className={`flex justify-center md:block animate-fade-in-up delay-300 ${
                ctaAnimation.isVisible ? "visible" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button
                  size="lg"
                  variant="gallifrey"
                  className="px-8 py-3 font-medium tracking-wide group"
                  asChild
                >
                  <a
                    href="#platform-assessment"
                    onClick={() => handleCTAClick("hero-free-assessment")}
                  >
                    Schedule Consultation
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="gallifrey-outline"
                  className="px-8 py-3 font-medium tracking-wide group"
                  asChild
                >
                  <a
                    href="#contact"
                    onClick={() => handleCTAClick("hero-executive-briefing")}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen px-4 overflow-hidden flex items-center"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
      aria-labelledby="hero-heading"
      data-testid="hero-section-original"
    >
      <PerformanceProfiler id="HeroThreeBackground-original">
        <Suspense fallback={<PlaceholderAnimation />}>
          <HeroThreeBackground className="opacity-40 md:opacity-70" />
        </Suspense>
      </PerformanceProfiler>

      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="text-center md:text-left max-w-4xl mx-auto md:mx-0 md:flex md:items-center md:justify-between">
          <div className="md:flex-1">
            <header className="mb-12 md:mb-16">
            <h1
              ref={headlineAnimation.ref}
              id="hero-heading"
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-light leading-tight mb-8 text-gallifrey-charcoal tracking-wide animate-fade-up animate-delay-200 hero-animation ${
                headlineAnimation.isVisible ? "visible complete" : ""
              }`}
            >
Two Sides.<br /><span className="text-authority">One Solution.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gallifrey-charcoal/70 font-light mb-8 leading-relaxed max-w-2xl">
Master both surveillance and privacy.
            </p>
            <div className="flex items-center justify-center md:justify-start flex-wrap gap-2 mb-12 text-sm text-gallifrey-charcoal/60 font-light">
              <span>Secure</span>
              <span className="hidden sm:inline mx-2">·</span>
              <span className="sm:hidden">•</span>
              <span>Private</span>
              <span className="hidden sm:inline mx-2">·</span>
              <span className="sm:hidden">•</span>
              <span className="whitespace-nowrap">Controlled</span>
            </div>
          </header>

          <div
            ref={ctaAnimation.ref}
            className={`flex justify-center md:block animate-fade-up animate-delay-600 ${
              ctaAnimation.isVisible ? "visible" : ""
            }`}
        >
          <Button
            size="lg"
            variant="gallifrey"
            className="px-8 py-3 font-medium tracking-wide group"
            asChild
          >
            <a
              href="#contact"
              onClick={() => handleCTAClick("hero-executive-briefing")}
            >
              Schedule Consultation
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          </div>
          </div>
          
          {/* Coin Animation */}
          <div className="hidden md:block md:flex-shrink-0 md:ml-16">
            <CoinAnimation className="" autoFlip={true} flipInterval={6000} />
          </div>
        </div>
      </div>
    </section>
  );
});