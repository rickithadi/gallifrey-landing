import React, { Suspense, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { useLayoutABTest } from "./LayoutABTestProvider";
import { trackLayoutVariantConversion } from "@/lib/layout-ab-test";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { useCursorTracking } from "@/lib/useCursorTracking";
import { AnimatedAdjective } from "./AnimatedAdjective";
import { PlaceholderAnimation } from "./PlaceholderAnimation";
import { CursorGlow } from "./CursorGlow";
import { PerformanceProfiler } from "./PerformanceProfiler";
import dynamic from "next/dynamic";

// Dynamic import for performant green rings background
const HeroThreeBackground = dynamic(
  () => import("./HeroThreeBackground").then(mod => ({ default: mod.HeroThreeBackground })),
  { 
    ssr: false, 
    loading: () => <PlaceholderAnimation />
  }
);

export const Hero = React.memo(function Hero() {
  const { variant } = useLayoutABTest();
  const { 
    position: mousePosition,
    velocity,
    gesture,
    interactionState,
    trail,
    clickIntensity
  } = useCursorTracking();
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
        className="relative h-screen px-4 overflow-hidden flex items-center"
        aria-labelledby="hero-heading"
        data-testid="hero-section-lightweight"
      >
        <PerformanceProfiler id="HeroThreeBackground-lightweight">
          <Suspense fallback={<PlaceholderAnimation />}>
            <HeroThreeBackground className="opacity-30 md:opacity-60" />
          </Suspense>
        </PerformanceProfiler>
        <CursorGlow 
          position={mousePosition}
          mode={interactionState.mode}
          isActive={interactionState.isActive}
          chargeLevel={interactionState.chargeLevel}
          clickIntensity={clickIntensity}
        />
        <div className="container mx-auto relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <header className="mb-8">
              <h1
                ref={headlineAnimation.ref}
                id="hero-heading"
                className={`text-4xl md:text-6xl lg:text-7xl font-heading font-medium leading-tight text-primary animate-fade-in-up hero-animation ${
                  headlineAnimation.isVisible ? "visible complete" : ""
                }`}
              >
                We build <AnimatedAdjective className="text-accent italic font-bold" />{" "}
                websites you actually own.
              </h1>
            </header>

            <div
              ref={ctaAnimation.ref}
              className={`flex justify-center md:justify-start animate-fade-in-up delay-300 ${
                ctaAnimation.isVisible ? "visible" : ""
              }`}
            >
              <Button
                size="lg"
                className="px-10 py-4 bg-primary hover:bg-primary/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium tracking-wide group"
                asChild
              >
                <a
                  href="#contact"
                  onClick={() => handleCTAClick("hero-commission-site")}
                >
                  Commission Your Site
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-24 md:py-32 px-4 overflow-hidden"
      aria-labelledby="hero-heading"
      data-testid="hero-section-original"
    >
      <PerformanceProfiler id="HeroThreeBackground-original">
        <Suspense fallback={<PlaceholderAnimation />}>
          <HeroThreeBackground className="opacity-40 md:opacity-70" />
        </Suspense>
      </PerformanceProfiler>
      <CursorGlow 
        position={mousePosition}
        mode={interactionState.mode}
        isActive={interactionState.isActive}
        chargeLevel={interactionState.chargeLevel}
        clickIntensity={clickIntensity}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center md:text-left max-w-4xl">
          <header className="mb-12 md:mb-16">
            <h1
              ref={headlineAnimation.ref}
              id="hero-heading"
              className={`text-3xl md:text-5xl lg:text-6xl font-heading font-medium leading-tight mb-8 text-primary animate-fade-up animate-delay-200 hero-animation ${
                headlineAnimation.isVisible ? "visible complete" : ""
              }`}
            >
              We build <AnimatedAdjective className="text-accent italic font-bold" /> websites
              you actually own
            </h1>
          </header>

          <div
            ref={ctaAnimation.ref}
            className={`flex justify-center md:justify-start animate-fade-up animate-delay-600 ${
              ctaAnimation.isVisible ? "visible" : ""
            }`}
        >
          <Button
            size="lg"
            className="px-10 py-4 bg-primary hover:bg-primary/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium tracking-wide animate-bounce-in animate-delay-700 group"
            asChild
          >
            <a
              href="#contact"
              onClick={() => handleCTAClick("hero-commission-site")}
            >
              Commission Your Site
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          </div>
        </div>
      </div>
    </section>
  );
});