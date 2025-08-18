import { ArrowRight, Check } from "lucide-react";

import { Button } from "./ui/button";

export function Pricing() {
  const packages = [
    {
      name: "Foundation",
      tagline: "Essential digital security",
      description: "Perfect for personal brands and small businesses establishing secure online presence",
      scope: "Ideal for: Solo professionals, small businesses, personal brands",
      features: [
        "Comprehensive security audit & cleanup",
        "Privacy protection & data removal",
        "Digital footprint assessment",
        "Basic digital sovereignty setup",
        "Reputation management fundamentals",
        "1-month support & monitoring"
      ],
      timeline: "1-2 weeks",
      cta: "Get Foundation Quote",
      investment: "Four-figure investment"
    },
    {
      name: "Professional",
      tagline: "Complete digital transformation",
      description: "Comprehensive solutions for established businesses and professional services",
      scope: "Ideal for: Growing businesses, professional services, established brands",
      features: [
        "Custom business dashboards",
        "Advanced security implementation",
        "Multi-platform integration",
        "Digital process optimization",
        "Performance & conversion optimization",
        "Strategic digital sovereignty planning",
        "3-month partnership & support"
      ],
      timeline: "2-4 weeks",
      cta: "Discuss Professional Package",
      popular: true,
      investment: "Mid four to five-figure investment"
    },
    {
      name: "Enterprise",
      tagline: "Total digital sovereignty",
      description: "Full-scale solutions for organizations requiring maximum security and custom development",
      scope: "Ideal for: Large organizations, high-security needs, complex requirements",
      features: [
        "Custom web applications & systems",
        "Enterprise infrastructure architecture",
        "24/7 security monitoring & response",
        "Dedicated development team",
        "Complete digitalization suite",
        "Ongoing strategic consulting",
        "White-glove concierge service"
      ],
      timeline: "4-12 weeks",
      cta: "Explore Enterprise Solutions",
      investment: "Five+ figure strategic investment"
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
            Strategic partnerships for
            <span className="italic text-accent"> exceptional outcomes</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Every engagement is customized to your specific requirements and goals. Our partnerships typically begin in the four-figure range, scaling with complexity and scope.
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
                <h3 className="font-serif text-2xl font-medium mb-1 text-primary">
                  {pkg.name}
                </h3>
                <p className="text-accent font-medium text-sm mb-3">
                  {pkg.tagline}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {pkg.description}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {pkg.scope}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-muted-foreground/80 uppercase tracking-wider">
                    Timeline: {pkg.timeline}
                  </span>
                  <span className="text-xs text-accent font-medium">
                    {pkg.investment}
                  </span>
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

        {/* Investment guidance */}
        <div className="text-center border-t border-border/50 pt-16">
          <h3 className="text-xl font-serif font-medium mb-4 text-primary">
            Custom solutions for unique challenges
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Investment levels vary based on complexity, scope, and strategic objectives. Every engagement begins with a comprehensive discovery process to ensure perfect alignment.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-primary mb-1">Discovery Call</div>
                <div className="text-muted-foreground">Complimentary 30-minute strategy session</div>
              </div>
              <div>
                <div className="font-medium text-primary mb-1">Custom Proposal</div>
                <div className="text-muted-foreground">Detailed scope, timeline & investment</div>
              </div>
              <div>
                <div className="font-medium text-primary mb-1">Flexible Terms</div>
                <div className="text-muted-foreground">Milestone-based payments available</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              Schedule Discovery Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
              View Success Stories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
