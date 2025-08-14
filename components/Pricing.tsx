import { ArrowRight, Check } from "lucide-react";

import { Button } from "./ui/button";

export function Pricing() {
  const packages = [
    {
      name: "Essential",
      price: "$800",
      description: "Perfect for consultations, reputation management, and privacy cleanup",
      features: [
        "Initial consultation & strategy",
        "Reputation management audit",
        "Privacy cleanup & data removal",
        "Basic security hardening",
        "Digital footprint assessment",
        "1 month support included"
      ],
      timeline: "1-2 weeks",
      cta: "Get started"
    },
    {
      name: "Professional",
      price: "$2,500–5,000",
      description: "Comprehensive digital solutions with business dashboards and digitalization",
      features: [
        "Custom business dashboards",
        "Digital transformation strategy",
        "Multi-platform integration",
        "Advanced security hardening",
        "Performance optimization",
        "Business process digitalization",
        "3 months support included"
      ],
      timeline: "2-4 weeks",
      cta: "Start your project",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$8,000+",
      description: "Full-scale development with comprehensive digitalization and hardening",
      features: [
        "Custom web applications",
        "Enterprise business dashboards",
        "Complete digitalization suite",
        "Advanced security hardening",
        "Cloud infrastructure setup",
        "24/7 monitoring & support",
        "Dedicated development team"
      ],
      timeline: "4-12 weeks",
      cta: "Let&apos;s discuss"
    }
  ];

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Investment
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl">
            Transparent pricing for
            <span className="italic text-accent"> exceptional work</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            No hidden fees, no surprises. Every project includes security, performance optimization, and ongoing support. You only pay when you&apos;re completely satisfied.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg, index) => (
            <div key={index} className={`relative bg-background border rounded-lg p-8 ${pkg.popular ? 'border-accent shadow-lg scale-105' : 'border-border/50'} hover:shadow-lg transition-all duration-300`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-serif text-2xl font-medium mb-2 text-primary">
                  {pkg.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-xs text-muted-foreground/80 uppercase tracking-wider mb-4">
                  Timeline: {pkg.timeline}
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

        {/* Additional info */}
        <div className="text-center border-t border-border/50 pt-16">
          <h3 className="text-xl font-serif font-medium mb-4 text-primary">
            Need something different?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every project is unique. Let&apos;s discuss your specific requirements and create a custom proposal
            that fits your budget and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              Schedule consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
              View case studies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
