import React, { Suspense, useCallback, useMemo, useEffect, useState } from "react";
import { ArrowRight, Shield, Award, CheckCircle } from "lucide-react";
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
  
  // Enhanced animation states for professional enterprise feel
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Progressive animation phases for smooth enterprise experience
  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setAnimationPhase(1), 300);
    const timer3 = setTimeout(() => setAnimationPhase(2), 600);
    const timer4 = setTimeout(() => setAnimationPhase(3), 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  // Optimized animations with better performance
  const headlineAnimation = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  const ctaAnimation = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.1,
    triggerOnce: true 
  });
  const metricsAnimation = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.2,
    triggerOnce: true 
  });

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
  }, []);

  // Memoize trust indicators for performance
  const trustIndicators = useMemo(() => [
    { icon: Shield, label: t('hero.trustIndicators.iso'), key: 'iso' },
    { icon: Award, label: t('hero.trustIndicators.soc'), key: 'soc' },
    { icon: CheckCircle, label: t('hero.trustIndicators.gdpr'), key: 'gdpr' }
  ], [t]);

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
            {/* Client Logos / Trust Signals */}
            <div className="mb-8">
              <p className="text-xs text-gallifrey-charcoal/40 mb-4">{t('hero.clientLogos.title')}</p>
              <div className="flex items-center justify-center lg:justify-start gap-6 opacity-60">
                <div className="w-20 h-8 bg-gallifrey-charcoal/10 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gallifrey-charcoal/50">Enterprise</span>
                </div>
                <div className="w-20 h-8 bg-gallifrey-charcoal/10 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gallifrey-charcoal/50">Fortune 500</span>
                </div>
                <div className="w-20 h-8 bg-gallifrey-charcoal/10 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gallifrey-charcoal/50">Global</span>
                </div>
              </div>
            </div>

            <header className="mb-12">
              <h1
                ref={headlineAnimation.ref}
                id="hero-heading"
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-[1.1] text-gallifrey-charcoal tracking-tight transform transition-all duration-700 ease-out ${
                  headlineAnimation.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{ 
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                  letterSpacing: '-0.025em'
                }}
              >
                {t('hero.title')}{' '}
                <span className="bg-gradient-to-r from-gallifrey-teal via-gallifrey-teal-dark to-blue-700 bg-clip-text text-transparent font-black">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              
              <p className={`text-xl sm:text-2xl lg:text-3xl text-gallifrey-charcoal/75 font-light mt-8 leading-relaxed max-w-3xl mx-auto lg:mx-0 transform transition-all duration-700 ease-out delay-200 ${
                headlineAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-6"
              }`}>
                {t('hero.subtitle')}
              </p>
            </header>

            <div
              ref={ctaAnimation.ref}
              className={`flex flex-col items-center lg:items-start transform transition-all duration-700 ease-out delay-400 ${
                ctaAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-6"
              }`}
            >
              {/* Enhanced Dual CTA with Better Hierarchy */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  size="lg"
                  variant="gallifrey"
                  className="px-10 py-5 text-lg font-semibold tracking-wide group bg-gallifrey-charcoal hover:bg-gallifrey-charcoal/90 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 enterprise-cta"
                  asChild
                >
                  <a
                    href="#contact"
                    onClick={() => handleCTAClick("hero-secure-enterprise")}
                  >
                    {t('hero.cta')}
                    <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-5 text-lg font-medium tracking-wide group border-2 border-gallifrey-teal text-gallifrey-teal hover:bg-gallifrey-teal hover:text-white hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  asChild
                >
                  <a
                    href="#contact"
                    onClick={() => handleCTAClick("hero-security-assessment")}
                  >
                    {t('hero.secondaryCta')}
                    <Shield className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
              
              {/* Refined Security Trust Indicators */}
              <div className="mt-8 text-center lg:text-left">
                <p className="text-sm text-gallifrey-charcoal/50 mb-4 font-medium">{t('hero.trustIndicators.title')}</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {trustIndicators.map((indicator, index) => {
                    const Icon = indicator.icon;
                    return (
                      <div 
                        key={indicator.key}
                        className={`flex items-center gap-3 px-4 py-3 bg-gallifrey-teal/8 border border-gallifrey-teal/20 rounded-xl hover:bg-gallifrey-teal/12 hover:border-gallifrey-teal/30 transition-all duration-300 transform hover:scale-105 ${
                          ctaAnimation.isVisible 
                            ? `opacity-100 translate-y-0 transition-delay-[${600 + index * 100}ms]` 
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-gallifrey-teal" />
                        <span className="text-sm font-semibold text-gallifrey-teal">{indicator.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Premium Enterprise Metrics Dashboard */}
              <div 
                ref={metricsAnimation.ref}
                className={`mt-8 bg-gradient-to-br from-gallifrey-teal/5 via-gallifrey-teal/3 to-gallifrey-off-white border border-gallifrey-teal/15 rounded-2xl p-8 backdrop-blur-sm transform transition-all duration-700 ease-out delay-600 ${
                  metricsAnimation.isVisible 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 translate-y-8 scale-95"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                  <div className="group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-2 bg-gallifrey-teal/10 rounded-full mr-3">
                        <Shield className="w-6 h-6 text-gallifrey-teal" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-gallifrey-teal bg-gradient-to-r from-gallifrey-teal to-gallifrey-teal-dark bg-clip-text text-transparent">99.99%</div>
                    </div>
                    <div className="text-base font-semibold text-gallifrey-charcoal/80 mb-1">{t('hero.metrics.uptime')}</div>
                    <div className="text-sm text-gallifrey-charcoal/60">{t('hero.statusIndicators.secure')}</div>
                  </div>
                  <div className="group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-2 bg-gallifrey-teal/10 rounded-full mr-3">
                        <CheckCircle className="w-6 h-6 text-gallifrey-teal" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-gallifrey-teal bg-gradient-to-r from-gallifrey-teal to-gallifrey-teal-dark bg-clip-text text-transparent">0</div>
                    </div>
                    <div className="text-base font-semibold text-gallifrey-charcoal/80 mb-1">{t('hero.metrics.threats')}</div>
                    <div className="text-sm text-gallifrey-charcoal/60">{t('hero.statusIndicators.monitored')}</div>
                  </div>
                  <div className="group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-2 bg-gallifrey-teal/10 rounded-full mr-3">
                        <Award className="w-6 h-6 text-gallifrey-teal" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-gallifrey-teal bg-gradient-to-r from-gallifrey-teal to-gallifrey-teal-dark bg-clip-text text-transparent">70%</div>
                    </div>
                    <div className="text-base font-semibold text-gallifrey-charcoal/80 mb-1">{t('hero.metrics.savings')}</div>
                    <div className="text-sm text-gallifrey-charcoal/60">Average Enterprise ROI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Optimized Coin Animation */}
          <div className={`flex justify-center lg:justify-end transform transition-all duration-700 ease-out delay-300 ${
            headlineAnimation.isVisible 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 translate-y-12 scale-95"
          }`}>
            <div className="relative">
              <CoinAnimation 
                size="large"
                autoFlip={true} 
                flipInterval={5000} 
                scrollTrigger={true}
              />
              {/* Subtle glow effect for enterprise appeal */}
              <div className="absolute inset-0 bg-gradient-to-r from-gallifrey-teal/5 to-transparent rounded-full blur-3xl scale-150 opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});