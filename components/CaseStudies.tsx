import { ArrowRight, Shield, TrendingUp, Award, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

interface Metric {
  value: string;
  label: string;
  description?: string;
}

interface Testimonial {
  quote: string;
  author: string;
}

interface CaseStudy {
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  primaryMetric: Metric;
  secondaryMetrics?: Metric[];
  testimonial?: Testimonial;
  tags?: string[];
  client?: string;
  cta?: string;
}

export function CaseStudies() {
  const { t } = useTranslation('case-studies');
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: casesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const featuredCases = t('homepage.featured', { returnObjects: true });
  const cases = Array.isArray(featuredCases) ? featuredCases : [];

  const renderMetricIcon = (label: string) => {
    const iconProps = "w-5 h-5 text-accent";
    if (label.includes('Uptime') || label.includes('Security')) return <Shield className={iconProps} />;
    if (label.includes('Cost') || label.includes('Savings')) return <DollarSign className={iconProps} />;
    if (label.includes('Compliance')) return <CheckCircle className={iconProps} />;
    if (label.includes('Operations') || label.includes('Efficiency')) return <TrendingUp className={iconProps} />;
    if (label.includes('Breaches')) return <Shield className={iconProps} />;
    return <Award className={iconProps} />;
  };

  return (
    <section id="case-studies" className="py-24 px-4" aria-labelledby="case-studies-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`mb-20 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.1em] text-muted-foreground uppercase mb-4">
              {t('section.label')}
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="case-studies-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            {t('section.title')}
            <span className="italic text-accent">{t('section.titleHighlight')}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t('section.subtitle')}
          </p>
        </div>

        {/* Case Studies Grid */}
        <div ref={casesRef} className="grid lg:grid-cols-3 gap-8 mb-16">
          {cases.map((caseStudy: CaseStudy, index: number) => (
            <div
              key={index}
              className={`group animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent/30 h-full">
                {/* Header */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseStudy.tags?.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-heading text-xl font-medium mb-2 text-primary group-hover:text-accent transition-colors tracking-tight">
                    {caseStudy.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{caseStudy.client}</span> • {caseStudy.industry}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {caseStudy.challenge.length > 120 
                        ? `${caseStudy.challenge.substring(0, 120)}...` 
                        : caseStudy.challenge
                      }
                    </p>
                    <p className="text-sm text-primary font-medium leading-relaxed">
                      {caseStudy.solution.length > 100 
                        ? `${caseStudy.solution.substring(0, 100)}...` 
                        : caseStudy.solution
                      }
                    </p>
                  </div>

                  {/* Primary Metric */}
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      {renderMetricIcon(caseStudy.primaryMetric?.label || '')}
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {caseStudy.primaryMetric?.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {caseStudy.primaryMetric?.label}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {caseStudy.primaryMetric?.description}
                    </p>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {caseStudy.secondaryMetrics?.map((metric: Metric, metricIndex: number) => (
                      <div key={metricIndex} className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-accent mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial Preview */}
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground italic leading-relaxed mb-2">
                      &ldquo;{caseStudy.testimonial?.quote && caseStudy.testimonial.quote.length > 80 
                        ? `${caseStudy.testimonial.quote.substring(0, 80)}...` 
                        : caseStudy.testimonial?.quote}&rdquo;
                    </p>
                    <div className="text-xs text-primary font-medium">
                      {caseStudy.testimonial?.author}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                  >
                    {caseStudy.cta}
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center border-t border-border/50 pt-16">
          <h3 className="text-2xl md:text-3xl font-heading font-medium mb-4 text-primary">
            {t('cta.title')}
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              {t('cta.primaryButton')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50"
              asChild
            >
              <Link href="/case-studies">
                {t('cta.secondaryButton')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}