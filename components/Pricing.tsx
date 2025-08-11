import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check, Star, Shield, Zap } from "lucide-react";

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
      badge: "Most Affordable"
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
      badge: "Most Popular"
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
      badge: "Enterprise"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6 text-primary">
            Transparent Pricing, Exceptional Value
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From personal digital homes to enterprise fortresses. Choose the package that fits your needs — 
            all include our commitment to security, privacy, and excellence.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Enterprise-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Pay Only If Satisfied</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-accent shadow-2xl scale-105 bg-card' : 'border-border bg-card'} hover:shadow-xl transition-all duration-300`}>
              <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.popular ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'} flex items-center gap-1`}>
                <Star className="w-3 h-3" />
                {plan.badge}
              </Badge>
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-primary mb-2">{plan.name}</CardTitle>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  {plan.period !== "ongoing partnership" && <span className="text-muted-foreground text-sm">/{plan.period}</span>}
                </div>
                <p className="text-sm font-medium text-accent mb-2">{plan.subtitle}</p>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                  {plan.cta}
                </Button>
                
                {plan.popular && (
                  <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground">
                      Includes free 30min strategy call
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-4">
            <span className="text-accent font-semibold">Flexible arrangements.</span> We adapt to your budget and timeline.
          </p>
          <p className="text-sm text-muted-foreground">
            Need something custom? Let's talk about a bespoke solution that fits your unique requirements.
          </p>
        </div>
      </div>
    </section>
  );
}