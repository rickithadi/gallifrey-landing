import { Code, Shield, Target } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Precision-Engineered Digital Assets",
      description: "Bespoke systems engineered to become proprietary IP. Custom architecture built to enterprise specifications with zero technical debt. Every line of code is an asset that appreciates over time, creating defensible competitive moats.",
      details: ["Custom architecture becomes proprietary IP", "Zero technical debt from day one", "Enterprise-grade scalability without vendor lock-in", "Unique integrations that competitors cannot replicate"]
    },
    {
      icon: <Target className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Complete Market Authority Through Search",
      description: "Strategic narrative control and content dominance that generates enterprise leads 24/7. We remove negative content, eliminate data broker exposure, and push your preferred narrative across all digital channels to establish definitive market authority.",
      details: ["Data broker removal from 100+ sources", "Negative content removal and suppression", "Strategic narrative positioning across search results", "24/7 enterprise lead generation through authority content"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Enterprise Security & Business Continuity",
      description: "Zero-incident compliance architecture that opens new markets. Our security framework meets the highest enterprise standards, enabling partnerships with Fortune 500 clients and government contracts that require bulletproof digital infrastructure.",
      details: ["Zero-incident security track record", "Enterprise compliance that opens new markets", "Fortune 500-grade risk mitigation", "Business continuity guarantees with liability coverage"]
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
            Enterprise Digital Assets That
            <span className="italic text-accent"> Generate Competitive Advantage</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Three strategic pillars that create measurable competitive advantage and unlock enterprise opportunities.
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
