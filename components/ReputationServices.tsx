import { Shield, Target, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";
import { trackCTAClick } from "@/lib/analytics";
import { useCallback } from "react";

export function ReputationServices() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
  }, []);

  const assessmentFeatures = [
    "Platform Dependency Risk Score",
    "Digital Footprint Vulnerability Analysis", 
    "Reputation Threat Assessment",
    "De-platforming Risk Evaluation"
  ];

  const services = [
    {
      icon: <Zap className="w-6 h-6 text-gallifrey-teal" aria-hidden="true" />,
      title: "Free Digital Security Assessment",
      price: "FREE",
      duration: "15 minutes",
      description: "Discover your platform dependency risks and digital security posture. Like BrandYourself's risk scan, but focused on platform independence and robust digital presence.",
      features: assessmentFeatures,
      cta: "Get Free Assessment",
      ctaAction: "reputation-free-assessment"
    },
    {
      icon: <Target className="w-6 h-6 text-gallifrey-teal" aria-hidden="true" />,
      title: "Digital Strategy Analysis", 
      price: "$297",
      duration: "60 minutes",
      description: "Deep-dive consultation revealing your complete digital narrative alignment. Comprehensive platform audit with actionable independence roadmap.",
      features: [
        "Complete platform dependency audit",
        "Reputation risk mitigation strategy",
        "Digital independence implementation plan",
        "Crisis response protocol development"
      ],
      cta: "Book Consultation",
      ctaAction: "reputation-strategy-analysis"
    },
    {
      icon: <Shield className="w-6 h-6 text-gallifrey-teal" aria-hidden="true" />,
      title: "Enterprise Digital Protection",
      price: "From $10,000/month",
      duration: "Ongoing",
      description: "Complete organizational reputation management and crisis response. Like NetReputation's enterprise offering, but focused on platform independence and authentic narrative control.",
      features: [
        "24/7 reputation monitoring across 200+ sources",
        "Real-time crisis response protocols",
        "Executive digital protection services",
        "Platform-proof infrastructure implementation"
      ],
      cta: "Schedule Enterprise Consultation",
      ctaAction: "reputation-enterprise-consultation"
    }
  ];

  return (
    <section id="reputation-services" className="py-20 px-4 bg-gallifrey-white/50" aria-labelledby="reputation-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`mb-20 text-center animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.1em] text-gallifrey-charcoal/60 uppercase mb-4">
              Digital Security Services
            </p>
            <div className="w-12 h-px bg-gallifrey-teal mx-auto"></div>
          </div>

          <h2 id="reputation-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-gallifrey-charcoal max-w-4xl mx-auto tracking-tight">
            Reputation Management &
            <span className="italic text-gallifrey-teal"> Platform Independence</span>
          </h2>

          <p className="text-lg text-gallifrey-charcoal/70 max-w-3xl mx-auto leading-relaxed">
            From free risk assessment to enterprise protection — discover your digital security posture and build robust platform-independent presence.
          </p>
        </div>

        {/* Services grid */}
        <div ref={servicesRef} className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group bg-white rounded-lg p-8 shadow-sm border border-gallifrey-charcoal/10 hover:border-gallifrey-teal/30 transition-all duration-300 animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              {/* Service header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gallifrey-teal/10 rounded-full flex items-center justify-center">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-medium text-gallifrey-charcoal tracking-tight">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-gallifrey-teal">
                      {service.price}
                    </span>
                    <span className="text-sm text-gallifrey-charcoal/60">
                      • {service.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gallifrey-charcoal/70 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-gallifrey-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gallifrey-charcoal/70">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                size="lg"
                variant={index === 0 ? "gallifrey" : index === 1 ? "gallifrey-outline" : "gallifrey-secondary"}
                className="w-full transition-all duration-300"
                onClick={() => handleCTAClick(service.ctaAction)}
              >
                {service.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="text-center">
          <p className="text-sm text-gallifrey-charcoal/60 mb-4">
            Trusted by 200+ high-profile individuals, privacy-conscious families, and independent creators
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-xs text-gallifrey-charcoal/70 mb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Zero Data Breaches</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gallifrey-teal rounded-full"></div>
              <span className="font-medium">ISO 27001 Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">GDPR/CCPA Ready</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">24/7 Monitoring</span>
            </div>
          </div>
          <div className="text-xs text-gallifrey-charcoal/50">
            <span>Founded 2019</span>
            <span className="mx-2">•</span>
            <span>Melbourne, Australia</span>
            <span className="mx-2">•</span>
            <span>Platform-independent solutions</span>
          </div>
        </div>
      </div>
    </section>
  );
}