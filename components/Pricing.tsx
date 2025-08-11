import { ArrowRight, Check, Clock, Shield, Sparkles, Star, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Starter One-Pager",
      price: "~$500",
      period: "one-time",
      subtitle: "Perfect for personal brands & micro-businesses",
      description: "Custom design, HTTPS by default, basic SEO, privacy policy & TOS",
      features: [
        "Custom responsive design",
        "HTTPS security by default",
        "Basic SEO optimization",
        "Privacy policy & TOS",
        "Contact form integration",
        "1 month support",
        "GDPR compliance ready"
      ],
      popular: false,
      cta: "Start Your Digital Home",
      badge: "Most Affordable",
      timeline: "1-2 weeks",
      ideal: "Personal brands, creatives, micro-businesses"
    },
    {
      name: "Growth Site",
      price: "$1,500–3,000",
      period: "project-based",
      subtitle: "Ideal for growing businesses & e-commerce",
      description: "Multi-page, CMS-driven, payments, analytics, A/B testing capabilities",
      features: [
        "Multi-page custom website",
        "CMS integration (headless)",
        "Payment gateway setup",
        "Advanced SEO & schema markup",
        "Analytics & performance tracking",
        "A/B testing framework",
        "3 months support & monitoring",
        "Performance optimization"
      ],
      popular: true,
      cta: "Scale Your Business",
      badge: "Most Popular",
      timeline: "2-4 weeks",
      ideal: "Growing businesses, e-commerce, content sites"
    },
    {
      name: "Enterprise & Custom Retainer",
      price: "$5,000+",
      period: "ongoing partnership",
      subtitle: "Full-scale web applications & federal-grade reliability",
      description: "JS/TS web apps, complex gateway integrations, cloud deployments",
      features: [
        "Full custom web applications",
        "Complex payment & fraud detection",
        "TypeScript SDKs & APIs",
        "Cloud infrastructure deployment",
        "Federal-grade security compliance",
        "24/7 monitoring & support",
        "Dedicated project manager",
        "Monthly strategy & performance reviews"
      ],
      popular: false,
      cta: "Partner With Us",
      badge: "Enterprise",
      timeline: "4-12 weeks",
      ideal: "Large organizations, complex applications"
    }
  ];

  return (
    <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-gallifrey-gray/20 via-background to-primary/5">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl md:text-6xl mb-8 text-primary">
            Transparent Pricing, <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Exceptional Value</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 font-body leading-relaxed">
            From personal digital homes to enterprise fortresses. Choose the package that fits your needs —
            all include our commitment to security, privacy, and excellence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Shield className="w-4 h-4 text-accent" />
              <span>Enterprise-Grade Security</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Zap className="w-4 h-4 text-accent" />
              <span>Pay Only If Satisfied</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Boutique-Level Care</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`group relative ${plan.popular ? 'border-accent shadow-brand-xl scale-105 bg-card' : 'border-border/50 bg-card/80'} backdrop-blur-sm hover:shadow-brand-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
              {/* Gradient overlay for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5"></div>
              )}

              <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.popular ? 'bg-accent text-accent-foreground shadow-brand' : 'bg-secondary text-secondary-foreground'} flex items-center gap-1 z-10`}>
                <Star className="w-3 h-3" />
                {plan.badge}
              </Badge>

              <CardHeader className="text-center pb-6 relative z-10">
                <CardTitle className="font-heading text-2xl text-primary mb-4 group-hover:text-accent transition-colors duration-300">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.period !== "ongoing partnership" && <span className="text-muted-foreground text-sm">/{plan.period}</span>}
                </div>
                <p className="text-accent font-semibold mb-3 font-body">{plan.subtitle}</p>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">{plan.description}</p>

                {/* Timeline and ideal for */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{plan.timeline}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3 text-accent" />
                    <span>{plan.ideal}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-body leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className={`w-full group/btn ${plan.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-brand-lg hover:shadow-brand-xl' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand hover:shadow-brand-lg'} transition-all duration-300 font-body font-medium`}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>

                {plan.popular && (
                  <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground bg-accent/10 px-3 py-1 rounded-full inline-block">
                      Includes free 30min strategy call
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto shadow-brand-lg">
            <p className="text-xl text-muted-foreground mb-6 font-body leading-relaxed">
              <span className="text-accent font-semibold bg-accent/10 px-3 py-1 rounded-lg">Flexible arrangements.</span> We adapt to your budget and timeline.
            </p>
            <p className="text-muted-foreground mb-6 font-body">
              Need something custom? Let&apos;s talk about a bespoke solution that fits your unique requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand hover:shadow-brand-lg transition-all duration-300">
                Schedule Custom Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                View Portfolio & Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
