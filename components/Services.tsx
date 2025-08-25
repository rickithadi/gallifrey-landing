import { Code, Palette, Shield, Users } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Secure Web Development",
      description: "Custom websites with enterprise security built in from day one. GDPR compliance, privacy protection, and platform independence designed into every project. No third-party dependencies that compromise your data security.",
      details: ["Custom coded with built-in security", "GDPR & privacy compliance by design", "No third-party tracking or dependencies", "Complete platform independence"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Digital Protection Services",
      description: "Comprehensive privacy cleanup and ongoing protection. We remove your data from brokers, monitor your digital reputation, and implement security measures to protect your business from digital threats.",
      details: ["Data broker removal from 100+ sources", "SEO reputation management & monitoring", "Privacy audit & security implementation", "Ongoing digital threat protection"]
    },
    {
      icon: <Users className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Strategic Consulting", 
      description: "Technology strategy and digital sovereignty planning tailored to your business. We help you achieve complete digital independence through custom architecture and strategic implementation roadmaps.",
      details: ["Digital sovereignty planning", "Custom technology architecture", "Strategic implementation roadmaps", "Ongoing security consultation"]
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
              What We Do
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="services-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            Security-First Web Development &
            <span className="italic text-accent"> Digital Protection</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Custom development with enterprise security built in from day one. We protect your business through secure websites, privacy compliance, and comprehensive digital protection services.
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
