import { Code, Shield, Target } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";
import { useTranslation } from 'next-i18next';

export function Services() {
  const { t } = useTranslation('services');
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: t('services.0.title'),
      description: t('services.0.description'),
      details: [
        t('services.0.details.0'),
        t('services.0.details.1'),
        t('services.0.details.2'),
        t('services.0.details.3')
      ]
    },
    {
      icon: <Target className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: t('services.1.title'),
      description: t('services.1.description'),
      details: [
        t('services.1.details.0'),
        t('services.1.details.1'),
        t('services.1.details.2'),
        t('services.1.details.3')
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: t('services.2.title'),
      description: t('services.2.description'),
      details: [
        t('services.2.details.0'),
        t('services.2.details.1'),
        t('services.2.details.2'),
        t('services.2.details.3')
      ]
    }
  ];

  return (
    <section id="services" className="py-16 px-4" aria-labelledby="services-heading" role="main">
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

          <h2 id="services-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            {t('section.title')}
            <span className="italic text-accent">{t('section.titleHighlight')}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t('section.subtitle')}
          </p>
        </div>

        {/* Services grid */}
        <div ref={servicesRef} className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-medium mb-3 text-primary tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <div className="w-1 h-1 bg-accent rounded-full"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
