import { Code, Shield, Target } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Quantum-Secure Architecture",
      description: "Sophisticated systems that transform digital vulnerabilities into competitive advantages. Custom-engineered architecture with proprietary threat modeling that creates defensible business moats. Elegant protection that becomes your intellectual property.",
      details: ["Proprietary threat modeling & quantum-secure foundations", "Advanced prompt injection & LLM attack mitigation", "Sophisticated content authenticity & deepfake protection", "Exclusive integrations that create competitive barriers"]
    },
    {
      icon: <Target className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Intelligent Threat Monitoring",
      description: "Sophisticated surveillance meets privacy protection. Advanced intelligence systems that detect sophisticated attacks while maintaining your authentic presence. We monitor the monitors, ensuring absolute authority over your digital narrative.",
      details: ["Comprehensive threat intelligence across global sources", "Advanced synthetic content & deepfake detection", "Intelligent threat analysis & automated countermeasures", "Sophisticated crisis response & narrative protection"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "AI Governance & Compliance",
      description: "Uncompromising standards that open enterprise markets. Sophisticated governance frameworks that meet the highest regulatory requirements while maintaining operational elegance. Your competitive advantage through absolute compliance authority.",
      details: ["Uncompromising security track record & excellence", "Sophisticated AI governance & regulatory mastery", "Enterprise-grade threat mitigation & risk management", "Business continuity with comprehensive risk coverage"]
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
Absolute Authority Over Your Digital Domain,
            <span className="italic text-accent"> Where Surveillance Meets Privacy</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
Sophisticated protection architecture that transforms surveillance risks into competitive advantages. Where others see threats, we engineer absolute authority.
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
