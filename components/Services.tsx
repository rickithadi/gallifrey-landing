import { Code, Shield, Target } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "AI-Resistant Digital Architecture",
      description: "Quantum-secure systems engineered to resist AI-powered attacks and become proprietary IP. Custom architecture built with AI threat modeling and zero technical debt. Every line of code includes anti-prompt-injection safeguards and deepfake detection, creating defensible competitive moats against emerging AI threats.",
      details: ["AI threat modeling & quantum-secure architecture", "Prompt injection & LLM attack prevention", "Deepfake detection & content authenticity verification", "AI-resistant integrations competitors cannot replicate"]
    },
    {
      icon: <Target className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Enterprise Threat Intelligence & Monitoring",
      description: "Advanced threat intelligence powered by AI monitoring that protects your enterprise reputation against sophisticated attacks. We detect AI-generated disinformation campaigns, deepfake operations, and synthetic content threats while maintaining your authentic corporate presence through continuous surveillance countermeasures.",
      details: ["AI-powered threat monitoring across 200+ sources", "Deepfake & synthetic content detection", "Machine learning threat analysis & automated response", "Corporate disinformation crisis protocols"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Enterprise AI Security & Governance",
      description: "Zero-incident AI compliance architecture that opens new markets. Our AI security framework meets the highest enterprise standards for AI governance, enabling partnerships with Fortune 500 clients and government contracts that require bulletproof AI-resistant digital infrastructure and regulatory compliance.",
      details: ["Zero AI security incidents track record", "AI governance & regulatory compliance", "Enterprise-grade AI threat mitigation", "Business continuity with AI risk coverage"]
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
            AI-Secure Digital Assets That
            <span className="italic text-accent"> Defend Against Future Threats</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Three strategic pillars that create AI-resistant competitive advantage and unlock enterprise opportunities while protecting against emerging digital threats.
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
