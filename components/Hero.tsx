import React, { Suspense, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { PlaceholderAnimation } from "./PlaceholderAnimation";
import { PerformanceProfiler } from "./PerformanceProfiler";
import dynamic from "next/dynamic";
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('home');
  const headlineAnimation = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.1,
  });
  const ctaAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
  }, []);

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
                className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-light leading-tight text-gallifrey-charcoal tracking-tight animate-fade-up hero-animation ${
                  headlineAnimation.isVisible ? "visible complete" : ""
                }`}
              >
                {t('hero.title')}{' '}
                <span className="text-authority bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-2xl text-gallifrey-charcoal/60 font-light mt-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>
            </header>

            <div
              ref={ctaAnimation.ref}
              className={`flex flex-col items-center lg:items-start animate-fade-up animate-delay-600 ${
                ctaAnimation.isVisible ? "visible" : ""
              }`}
            >
              <Button
                size="lg"
                variant="gallifrey"
                className="px-10 py-4 text-lg font-semibold tracking-wide group bg-gallifrey-charcoal hover:bg-gallifrey-charcoal/90 text-white border-0 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <a
                  href="#contact"
                  onClick={() => handleCTAClick("hero-secure-assets")}
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              
              {/* Trust Indicators */}
              <div className="mt-6 text-center lg:text-left">
                <p className="text-xs text-gallifrey-charcoal/40 mb-2">{t('hero.trustIndicators.title')}</p>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-gallifrey-charcoal/50">
                  <span>{t('hero.trustIndicators.iso')}</span>
                  <span>•</span>
                  <span>{t('hero.trustIndicators.soc')}</span>
                  <span>•</span>
                  <span>{t('hero.trustIndicators.gdpr')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Enhanced Coin */}
          <div className="flex justify-center lg:justify-end">
            <CoinAnimation 
              size="large"
              autoFlip={true} 
              flipInterval={4000} 
              scrollTrigger={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
});