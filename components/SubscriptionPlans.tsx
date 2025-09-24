import { Check, ArrowRight, Crown, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";
import { trackCTAClick } from "@/lib/analytics";
import { useCallback } from "react";

export function SubscriptionPlans() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: plansRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
  }, []);

  const plans = [
    {
      icon: <Zap className="w-8 h-8 text-gallifrey-teal" />,
      name: "Digital Security",
      subtitle: "Personal Reputation Management",
      price: "$1,000",
      period: "/month",
      description: "For high-profile individuals seeking robust digital presence and reputation protection. Enterprise-grade security for personal brands.",
      features: [
        "Real-time reputation monitoring across 200+ sources",
        "Monthly digital security assessment & report",
        "Crisis response protocol (24-hour activation)",
        "Platform independence consulting",
        "Negative content suppression strategies",
        "Personal brand narrative alignment",
        "Privacy protection & data broker removal",
        "Quarterly strategy optimization sessions"
      ],
      cta: "Start Digital Security",
      ctaAction: "subscription-digital-security",
      popular: false,
      badge: null
    },
    {
      icon: <Crown className="w-8 h-8 text-gallifrey-teal" />,
      name: "Digital Strategy",
      subtitle: "Professional Authority Control",
      price: "$2,500",
      period: "/month", 
      description: "For business leaders and professionals requiring comprehensive narrative control and market authority positioning.",
      features: [
        "Everything in Digital Security, plus:",
        "Professional network reputation management",
        "Industry authority content strategy",
        "Executive protection protocols",
        "Competitive narrative positioning",
        "Media relations crisis management",
        "Search result optimization & control",
        "Bi-weekly strategic consultation calls",
        "Custom crisis communication templates",
        "LinkedIn & professional platform optimization"
      ],
      cta: "Claim Digital Strategy",
      ctaAction: "subscription-digital-strategy",
      popular: true,
      badge: "Most Popular"
    },
    {
      icon: <Shield className="w-8 h-8 text-gallifrey-teal" />,
      name: "Enterprise Protection",
      subtitle: "Organizational Security Framework",
      price: "From $10,000",
      period: "/month",
      description: "Complete organizational reputation management for healthcare, finance, and enterprise clients requiring compliance-grade protection.",
      features: [
        "Everything in Digital Strategy, plus:",
        "Multi-stakeholder reputation monitoring",
        "HIPAA/SOC2 compliant infrastructure",
        "Legal compliance & regulatory support",
        "Executive team digital protection",
        "Crisis communication war room",
        "Custom threat intelligence reports",
        "Dedicated account management team",
        "Integration with existing security infrastructure",
        "Board-level reporting & analytics",
        "Enterprise-grade SLA & liability coverage"
      ],
      cta: "Schedule Enterprise Consultation",
      ctaAction: "subscription-enterprise-protection",
      popular: false,
      badge: "Enterprise"
    }
  ];

  return (
    <section id="subscription-plans" className="py-20 px-4" aria-labelledby="plans-heading">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`mb-20 text-center animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.1em] text-gallifrey-charcoal/60 uppercase mb-4">
              Recurring Revenue Services
            </p>
            <div className="w-12 h-px bg-gallifrey-teal mx-auto"></div>
          </div>

          <h2 id="plans-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-gallifrey-charcoal max-w-4xl mx-auto tracking-tight">
            Monthly Digital Protection
            <span className="italic text-gallifrey-teal"> Subscription Plans</span>
          </h2>

          <p className="text-lg text-gallifrey-charcoal/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Ongoing reputation management and platform independence protection. Cancel anytime, but your digital security deserves consistent attention.
          </p>

          <div className="inline-flex items-center gap-2 bg-gallifrey-teal/10 text-gallifrey-charcoal px-4 py-2 rounded-full text-sm">
            <Crown className="w-4 h-4 text-gallifrey-teal" />
            <span>Premium positioning: Superior to BrandYourself • More authentic than NetReputation</span>
          </div>
        </div>

        {/* Plans grid */}
        <div ref={plansRef} className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 animate-fade-up ${
                plan.popular 
                  ? 'border-gallifrey-teal scale-105 shadow-xl' 
                  : 'border-gallifrey-charcoal/10 hover:border-gallifrey-teal/30 hover:scale-102'
              } ${visibleItems[index] ? 'visible' : ''}`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gallifrey-teal text-white px-4 py-2 rounded-full text-sm font-medium">
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gallifrey-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {plan.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-gallifrey-charcoal mb-2">
                  {plan.name}
                </h3>
                <p className="text-gallifrey-charcoal/60 text-sm mb-4">
                  {plan.subtitle}
                </p>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-4xl font-bold text-gallifrey-charcoal">
                    {plan.price}
                  </span>
                  <span className="text-gallifrey-charcoal/60">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gallifrey-charcoal/70 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex} 
                    className={`flex items-start gap-3 ${
                      feature.startsWith('Everything in') 
                        ? 'font-medium text-gallifrey-teal' 
                        : ''
                    }`}
                  >
                    <Check className="w-5 h-5 text-gallifrey-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gallifrey-charcoal/80 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                size="lg"
                variant={plan.popular ? "gallifrey" : "outline"}
                className={`w-full transition-all duration-300 ${
                  plan.popular 
                    ? '' 
                    : 'border-gallifrey-charcoal/20 group-hover:bg-gallifrey-teal group-hover:text-white group-hover:border-gallifrey-teal'
                }`}
                onClick={() => handleCTAClick(plan.ctaAction)}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>

        {/* Trust signals and comparison */}
        <div className="bg-gallifrey-teal/5 rounded-2xl p-8 text-center">
          <h3 className="font-heading text-xl font-medium text-gallifrey-charcoal mb-4">
            Why Choose Gallifrey Over Competitors?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-medium text-gallifrey-charcoal mb-2">
                vs. BrandYourself ($99-$799/month)
              </div>
              <p className="text-gallifrey-charcoal/70">
                We focus on platform independence, not just search optimization. True digital sovereignty vs. superficial reputation management.
              </p>
            </div>
            <div>
              <div className="font-medium text-gallifrey-charcoal mb-2">
                vs. NetReputation ($3K-$15K)
              </div>
              <p className="text-gallifrey-charcoal/70">
                Holistic security approach combining reputation with platform independence. Prevention-focused, not just crisis response.
              </p>
            </div>
            <div>
              <div className="font-medium text-gallifrey-charcoal mb-2">
                Our Unique Value
              </div>
              <p className="text-gallifrey-charcoal/70">
                Digital security philosophy meets enterprise-grade protection. Authentic presence aligned with your strategic objectives and business goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}