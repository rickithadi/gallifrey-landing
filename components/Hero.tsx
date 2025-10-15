import React, { Suspense, useCallback, useMemo } from "react";
import { ArrowRight, Shield, Award, CheckCircle, Play } from "lucide-react";
import { Button } from "./ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { PlaceholderAnimation } from "./PlaceholderAnimation";
import { PerformanceProfiler } from "./PerformanceProfiler";
import { GradientText } from "./GradientText";
import { CodeSnippet, GallifreyCodeSnippets } from "./CodeSnippet";
import dynamic from "next/dynamic";
import { useTranslation } from 'next-i18next';

// Use WorkOS-inspired background
const WorkOSBackground = dynamic(
  () => import("./WorkOSBackground").then(mod => ({ default: mod.WorkOSBackground })),
  { 
    ssr: false, 
    loading: () => <PlaceholderAnimation />
  }
);

export const Hero = React.memo(function Hero() {
  const { t } = useTranslation('home');
  
  
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
      className="relative min-h-screen px-4 overflow-hidden"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
      aria-labelledby="hero-heading"
      data-testid="hero-section-workos"
    >
      <PerformanceProfiler id="WorkOSBackground">
        <Suspense fallback={<PlaceholderAnimation />}>
          <WorkOSBackground className="opacity-60" />
        </Suspense>
      </PerformanceProfiler>

      <div className="container mx-auto max-w-7xl relative z-20">
        {/* WorkOS-Inspired Centered Layout */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
          
          {/* Client Logos / Trust Signals */}
          <div className="mb-12">
            <p className="text-sm text-gray-600 mb-6 font-medium">{t('hero.clientLogos.title')}</p>
            <div className="flex items-center justify-center gap-8 opacity-70">
              <div className="px-4 py-2 bg-gallifrey-teal/10 border border-gallifrey-teal/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-semibold text-gallifrey-charcoal">Enterprise</span>
              </div>
              <div className="px-4 py-2 bg-gallifrey-teal/10 border border-gallifrey-teal/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-semibold text-gallifrey-charcoal">Leading Brands</span>
              </div>
              <div className="px-4 py-2 bg-gallifrey-teal/10 border border-gallifrey-teal/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-semibold text-gallifrey-charcoal">Global Scale</span>
              </div>
            </div>
          </div>

          {/* Main Headline with Gradient Text */}
          <header className="mb-16 max-w-5xl">
            <h1
              ref={headlineAnimation.ref}
              id="hero-heading"
              className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-black leading-[1.1] tracking-tight mb-8 transform transition-all duration-700 ease-out ${
                headlineAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              }`}
            >
              <span className="text-gray-900">{t('hero.title')}</span>{' '}
              <GradientText
                colors={{
                  from: 'from-gallifrey-teal',
                  via: 'via-gallifrey-teal-dark',
                  to: 'to-blue-600'
                }}
                animate={headlineAnimation.isVisible}
                speed="medium"
                className="block mt-2"
              >
                {t('hero.titleHighlight')}
              </GradientText>
            </h1>
            
            <p className={`text-xl sm:text-2xl lg:text-3xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto transform transition-all duration-700 ease-out delay-300 ${
              headlineAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}>
              {t('hero.subtitle')}
            </p>
          </header>

          {/* Enhanced CTA Section */}
          <div
            ref={ctaAnimation.ref}
            className={`mb-16 transform transition-all duration-700 ease-out delay-500 ${
              ctaAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold group bg-gradient-to-r from-gallifrey-teal to-gallifrey-teal-dark hover:from-gallifrey-teal-dark hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-workos-pulse"
                asChild
              >
                <a
                  href="#contact"
                  onClick={() => handleCTAClick("hero-get-started")}
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-medium group border-2 border-gallifrey-teal text-gallifrey-teal hover:bg-gallifrey-teal hover:text-white hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <a
                  href="#demo"
                  onClick={() => handleCTAClick("hero-watch-demo")}
                >
                  <Play className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                  Watch Demo
                </a>
              </Button>
            </div>
            
            {/* Trust Indicators - Horizontal Layout */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustIndicators.map((indicator, index) => {
                const Icon = indicator.icon;
                return (
                  <div 
                    key={indicator.key}
                    className={`flex items-center gap-2 px-3 py-2 bg-gallifrey-teal/10 border border-gallifrey-teal/30 rounded-lg backdrop-blur-sm hover:bg-gallifrey-teal/20 transition-all duration-300 transform hover:scale-105 ${
                      ctaAnimation.isVisible 
                        ? `opacity-100 translate-y-0 transition-delay-[${700 + index * 100}ms]` 
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-gallifrey-teal" />
                    <span className="text-sm font-medium text-gray-700">{indicator.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Split Layout - Code + Metrics */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full max-w-6xl">
            
            {/* Left: Code Snippet */}
            <div 
              className={`transform transition-all duration-700 ease-out delay-700 ${
                ctaAnimation.isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-12 scale-95"
              }`}
            >
              <div className="animate-workos-float">
                <CodeSnippet
                  code={GallifreyCodeSnippets.infrastructure}
                  title="Gallifrey Infrastructure"
                  animated={ctaAnimation.isVisible}
                  animationDelay={1000}
                  className="text-left"
                />
              </div>
            </div>

            {/* Right: Enhanced Metrics */}
            <div 
              ref={metricsAnimation.ref}
              className={`bg-gradient-to-br from-gallifrey-teal/5 via-gallifrey-teal/3 to-transparent border border-gallifrey-teal/20 rounded-2xl p-8 backdrop-blur-sm transform transition-all duration-700 ease-out delay-800 ${
                metricsAnimation.isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-12 scale-95"
              }`}
            >
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gallifrey-charcoal mb-2">Infrastructure Performance</h3>
                  <p className="text-sm text-gallifrey-charcoal/70">Real-time enterprise metrics</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gallifrey-teal/10 rounded-lg">
                        <Shield className="w-5 h-5 text-gallifrey-teal" />
                      </div>
                      <span className="text-sm font-medium text-gallifrey-charcoal">Uptime</span>
                    </div>
                    <GradientText
                      colors={{
                        from: 'from-gallifrey-teal',
                        to: 'to-gallifrey-teal-dark'
                      }}
                      className="text-2xl font-black"
                    >
                      99.99%
                    </GradientText>
                  </div>
                  
                  <div className="flex justify-between items-center group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gallifrey-teal/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-gallifrey-teal" />
                      </div>
                      <span className="text-sm font-medium text-gallifrey-charcoal">Threats Blocked</span>
                    </div>
                    <GradientText
                      colors={{
                        from: 'from-gallifrey-teal',
                        to: 'to-blue-600'
                      }}
                      className="text-2xl font-black"
                    >
                      847
                    </GradientText>
                  </div>
                  
                  <div className="flex justify-between items-center group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gallifrey-teal/10 rounded-lg">
                        <Award className="w-5 h-5 text-gallifrey-teal" />
                      </div>
                      <span className="text-sm font-medium text-gallifrey-charcoal">Cost Savings</span>
                    </div>
                    <GradientText
                      colors={{
                        from: 'from-gallifrey-teal-dark',
                        to: 'to-blue-600'
                      }}
                      className="text-2xl font-black"
                    >
                      70%
                    </GradientText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});