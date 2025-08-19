import { Code, Palette, Shield, Users } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(4);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Bespoke Web Development",
      description: "Hand-crafted websites and applications built from scratch with obsessive attention to detail. No templates, no WordPress, no shortcuts. We leverage AI-assisted development to accelerate delivery while maintaining the human expertise that creates truly custom, security-first solutions.",
      details: ["AI-Enhanced Custom Development", "Security-First Architecture", "Human-Guided Precision"]
    },
    {
      icon: <Palette className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Custom Design Systems",
      description: "Meticulously crafted visual identities and design systems with mathematical precision. Every pixel positioned purposefully, every interaction designed to perfection. Bespoke typography, custom iconography, and cohesive brand experiences that set you apart.",
      details: ["Bespoke Visual Identity", "Mathematical Precision Design", "Custom Component Libraries"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Privacy & Security Services",
      description: "Military-grade security and privacy protection woven into every aspect of your digital presence. GDPR compliance, data encryption, security audits, and comprehensive privacy protection. Your data sovereignty is our priority.",
      details: ["GDPR Compliance & Privacy", "Security Audits & Protection", "Data Encryption & Control"]
    },
    {
      icon: <Users className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Strategic Digital Consulting", 
      description: "White-glove consultation on technology decisions, AI integration strategy, and digital transformation. Personal attention to your unique challenges with strategic guidance that leverages emerging technologies while protecting your independence and competitive advantage.",
      details: ["AI Integration Strategy", "Platform Independence Consulting", "Future-Proof Technology Planning"]
    }
  ];

  return (
    <section id="services" className="py-16 px-4" aria-labelledby="services-heading">
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

          <h2 id="services-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            Development, Design &
            <span className="italic text-accent"> Consulting Services</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            We build custom websites, design systems, and provide data security and privacy consulting.
            Combining human expertise with AI-enhanced development - no templates, no shortcuts, everything built specifically for your business.
          </p>
        </div>

        {/* Services grid */}
        <div ref={servicesRef} className="grid md:grid-cols-2 gap-12 mb-20">
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
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary tracking-tight">
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
