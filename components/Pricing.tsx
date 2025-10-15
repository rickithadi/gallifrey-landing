import { ArrowRight, Check, MessageSquare, FileText, Code, Users, Info } from "lucide-react";

import { Button } from "./ui/button";
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

// Simple tooltip component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

export function Pricing() {
  const { t } = useTranslation('pricing');
  
  const packagesData = t('packages', { returnObjects: true });
  const packages = Array.isArray(packagesData) ? (packagesData as Array<{
    name: string;
    tagline: string;
    description: string;
    scope: string;
    timeline: string;
    cta: string;
    investment: string;
    features: string[];
    popular?: boolean;
  }>).map((pkg, index) => ({
    ...pkg,
    popular: index === 1 // Ubuntu Operations package is popular
  })) : [];

  // Floor pricing for tooltips
  const floorPricing = [
    "Starting from $2,500/month", // Moksha Foundation
    "Starting from $8,000/month", // Ubuntu Operations  
    "Starting from $15,000/month" // Dharma Enterprise
  ];

  return (
    <section id="pricing" className="py-24 px-4" aria-labelledby="pricing-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
              {t('section.label')}
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-heading font-light leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            {t('section.title')}
            <span className="italic text-accent font-medium">{t('section.titleHighlight')}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t('section.subtitle')}
          </p>
        </div>

        {/* Pricing grid */}
        {packages.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg, index) => (
            <div key={index} className={`relative bg-background border rounded-lg p-8 ${pkg.popular ? 'border-accent shadow-lg scale-105' : 'border-border/50'} hover:shadow-lg transition-all duration-300`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {t('popularLabel')}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading text-2xl font-light mb-1 text-primary tracking-tight">
                  {pkg.name}
                </h3>
                <p className="text-accent font-medium text-sm mb-3">
                  {pkg.tagline}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {pkg.description}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {pkg.scope}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-muted-foreground/80 uppercase tracking-wider">
                    {t('timelineLabel')} {pkg.timeline}
                  </span>
                  <Tooltip content={floorPricing[index]}>
                    <span className="text-xs text-accent font-medium flex items-center gap-1">
                      {pkg.investment}
                      <Info className="w-3 h-3 opacity-60" />
                    </span>
                  </Tooltip>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full ${pkg.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90'} transition-colors`}
              >
                {pkg.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
        )}

        {/* Strategic Partnership Methodology */}
        <div className="text-center border-t border-border/50 pt-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              {t('partnership.label')}
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h3 className="text-3xl md:text-4xl font-heading font-medium leading-tight mb-6 text-primary">
            {t('partnership.title')}
            <span className="italic text-accent">{t('partnership.titleHighlight')}</span>
          </h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('partnership.subtitle')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
            {(() => {
              const stepsData = t('partnership.steps', { returnObjects: true });
              const steps = Array.isArray(stepsData) ? stepsData as Array<{
                title: string;
                description: string;
                details: string[];
              }> : [];
              return steps.map((step, index) => {
              const icons = [MessageSquare, FileText, Code, Users];
              const IconComponent = icons[index];
              
              return (
                <div key={index} className="text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-heading text-lg font-medium text-primary mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <ul className="text-xs text-muted-foreground/80 space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>• {detail}</li>
                    ))}
                  </ul>
                </div>
              );
            });
            })()}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              {t('buttons.scheduleCall', { ns: 'common' })}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
              {t('buttons.viewStories', { ns: 'common' })}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
