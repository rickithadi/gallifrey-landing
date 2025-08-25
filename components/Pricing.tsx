import { ArrowRight, Check, MessageSquare, FileText, Code, Users } from "lucide-react";

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
        "Data broker removal from 50+ sources",
        "SEO reputation monitoring & brand protection",
        "Digital footprint assessment & control",
        "Enterprise security implementation",
        "Privacy protection & GDPR compliance",
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
        "Comprehensive data broker removal",
        "SEO reputation management & monitoring",
        "Multi-platform integration & cleanup",
        "AI-enhanced digital process optimization",
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
        "AI-integrated enterprise infrastructure",
        "Enterprise-grade security & privacy cleanup",
        "Advanced SEO reputation & narrative control",
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
    <section id="pricing" className="py-24 px-4" aria-labelledby="pricing-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
              Investment
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-heading font-light leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            Strategic partnerships for
            <span className="italic text-accent font-medium"> exceptional outcomes</span>
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
                <h3 className="font-heading text-2xl font-light mb-1 text-primary tracking-tight">
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

        {/* Strategic Partnership Methodology */}
        <div className="text-center border-t border-border/50 pt-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Partnership Process
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h3 className="text-3xl md:text-4xl font-heading font-medium leading-tight mb-6 text-primary">
            From Discovery to
            <span className="italic text-accent"> Long-term Success</span>
          </h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Our proven methodology combines strategic discovery, technical excellence, and ongoing partnership to deliver measurable outcomes that grow with your business.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
            <div className="text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-heading text-lg font-medium text-primary mb-2">Strategic Discovery</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Comprehensive 30-minute strategy session analyzing your infrastructure, objectives, and competitive positioning
              </p>
              <ul className="text-xs text-muted-foreground/80 space-y-1">
                <li>• Goals & requirements analysis</li>
                <li>• Strategic assessment</li>
                <li>• Risk & opportunity mapping</li>
                <li>• Investment alignment</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-heading text-lg font-medium text-primary mb-2">Custom Proposal</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Detailed architecture design balancing security, scalability, and business requirements with transparent pricing
              </p>
              <ul className="text-xs text-muted-foreground/80 space-y-1">
                <li>• Technical architecture</li>
                <li>• Security framework</li>
                <li>• Timeline & milestones</li>
                <li>• Flexible payment terms</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-heading text-lg font-medium text-primary mb-2">Expert Implementation</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Agile development with continuous security validation, regular updates, and iterative refinement
              </p>
              <ul className="text-xs text-muted-foreground/80 space-y-1">
                <li>• Custom development</li>
                <li>• Security implementation</li>
                <li>• Testing & optimization</li>
                <li>• Performance validation</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-heading text-lg font-medium text-primary mb-2">Ongoing Partnership</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Strategic support, security monitoring, and infrastructure evolution as your business grows
              </p>
              <ul className="text-xs text-muted-foreground/80 space-y-1">
                <li>• Continuous monitoring</li>
                <li>• Strategic consultation</li>
                <li>• Evolution planning</li>
                <li>• Incident response</li>
              </ul>
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
