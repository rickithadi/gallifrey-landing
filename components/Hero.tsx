import React, { Suspense, useCallback } from "react";
import { ArrowRight, Shield, Activity, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { useLayoutABTest } from "./LayoutABTestProvider";
import { trackLayoutVariantConversion } from "@/lib/layout-ab-test";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { PlaceholderAnimation } from "./PlaceholderAnimation";
import { PerformanceProfiler } from "./PerformanceProfiler";
import dynamic from "next/dynamic";

// Use Security background instead of Gallifreyan
const SecurityBackground = dynamic(
  () => import("./SecurityBackground").then(mod => ({ default: mod.SecurityBackground })),
  { 
    ssr: false, 
    loading: () => <PlaceholderAnimation />
  }
);

// Enhanced coin animation component
const CoinAnimation = dynamic(
  () => import("./CoinAnimation").then(mod => ({ default: mod.CoinAnimation })),
  { 
    ssr: false, 
    loading: () => <div className="w-[180px] h-[180px] bg-gray-200 rounded-full animate-pulse" />
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

  return (
    <section
      className="relative min-h-screen px-4 overflow-hidden flex items-center"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
      aria-labelledby="hero-heading"
      data-testid="hero-section-security"
    >
      <PerformanceProfiler id="SecurityBackground">
        <Suspense fallback={<PlaceholderAnimation />}>
          <SecurityBackground className="opacity-70" />
        </Suspense>
      </PerformanceProfiler>

      <div className="container mx-auto max-w-7xl relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[calc(100vh-8rem)]">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <header className="mb-12">
              <h1
                ref={headlineAnimation.ref}
                id="hero-heading"
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-light leading-tight text-gallifrey-charcoal tracking-wide animate-fade-up hero-animation ${
                  headlineAnimation.isVisible ? "visible complete" : ""
                }`}
              >
                Master Both Sides<br />
                <span className="text-authority bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  of Security
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-3xl text-gallifrey-charcoal/70 font-light mt-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Complete surveillance. Total defense. One platform.
              </p>
              
              {/* Security Metrics */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 text-sm font-medium">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-gallifrey-charcoal/80">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-gallifrey-charcoal/80">Real-time</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span className="text-gallifrey-charcoal/80">Enterprise Grade</span>
                </div>
              </div>
            </header>

            <div
              ref={ctaAnimation.ref}
              className={`flex justify-center lg:justify-start animate-fade-up animate-delay-600 ${
                ctaAnimation.isVisible ? "visible" : ""
              }`}
            >
              <Button
                size="lg"
                variant="gallifrey"
                className="px-10 py-4 text-lg font-semibold tracking-wide group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a
                  href="#contact"
                  onClick={() => handleCTAClick("hero-secure-assets")}
                >
                  Secure Your Assets
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right Content - Enhanced Coin */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <CoinAnimation 
                size="large"
                autoFlip={true} 
                flipInterval={5000} 
                scrollTrigger={true}
              />
              
              {/* Surrounding elements for context */}
              <div className="absolute -top-8 -left-8 text-xs text-gallifrey-charcoal/40 font-mono">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>SECURE</span>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 text-xs text-gallifrey-charcoal/40 font-mono">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>MONITORED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs text-gallifrey-charcoal/40 mb-2">Trusted by Security Professionals</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gallifrey-charcoal/30">
            <span>ISO 27001</span>
            <span>•</span>
            <span>SOC 2</span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
});