import { ArrowRight, Code, Palette, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Button } from "./ui/button";

export function Services() {
  const pillars = [
    {
      icon: <Shield className="w-12 h-12 text-accent" />,
      title: "Security First",
      subtitle: "Zero-Trust Architecture",
      description: "Every build audited, tested, and production-hardened. We integrate PCI-DSS compliance, encrypt customer data, and protect payment flows with enterprise-grade security protocols.",
      features: ["PCI-DSS Compliance", "Zero-Trust Patterns", "Pentesting Included"]
    },
    {
      icon: <Palette className="w-12 h-12 text-accent" />,
      title: "Bespoke Craftsmanship",
      subtitle: "No Templates, Pure Custom",
      description: "100% custom UI, code, and integrations tailored to your brand. Every pixel crafted with intention, every interaction designed for conversion and user delight.",
      features: ["Custom Design Systems", "Brand-Aligned UI", "Conversion Optimization"]
    },
    {
      icon: <Code className="w-12 h-12 text-accent" />,
      title: "Design Excellence",
      subtitle: "Conversion-Focused Beauty",
      description: "Clean, minimalist design that converts. We blend aesthetic excellence with strategic UX, creating digital experiences that are both beautiful and business-driving.",
      features: ["Performance Optimized", "Mobile-First Design", "Accessibility Compliant"]
    },
    {
      icon: <Users className="w-12 h-12 text-accent" />,
      title: "Trust & Transparency",
      subtitle: "Partnership Over Projects",
      description: "Open budgets, clear roadmaps, milestone updates. We build lasting relationships through honest communication and ongoing support that adapts to your evolving needs.",
      features: ["Open Communication", "Flexible Arrangements", "Ongoing Support"]
    }
  ];

  return (
    <section id="services" className="py-24 px-4 bg-gradient-to-br from-gallifrey-gray/20 via-background to-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl mb-8">
            <span className="font-heading text-primary">The Four Pillars of</span>{" "}
            <span className="font-serif text-gradient-brand italic">Digital Trust</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-6 font-body leading-relaxed">
            Our core values guide every decision, blending reliability with creativity.
            We don&apos;t just build websites—we engineer digital fortresses with a human touch.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {pillars.map((pillar, index) => (
            <Card key={index} className="group border-0 shadow-brand-lg hover:shadow-brand-xl bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 overflow-hidden relative">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-brand">
                    {pillar.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="font-heading text-2xl mb-2 text-primary group-hover:text-accent transition-colors duration-300">
                      {pillar.title}
                    </CardTitle>
                    <p className="text-accent font-semibold mb-3 font-body">{pillar.subtitle}</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed font-body mb-6">{pillar.description}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="ghost" className="text-accent hover:text-accent-foreground hover:bg-accent p-0 h-auto font-medium">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto shadow-brand-lg">
            <p className="text-xl text-muted-foreground mb-6 font-body leading-relaxed">
              <span className="text-accent font-semibold bg-accent/10 px-3 py-1 rounded-lg">Your idea-to-secure-launch partner</span> —
              fostering ongoing relationships through bespoke processes that adapt to your evolving needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand hover:shadow-brand-lg transition-all duration-300">
                Explore Our Process
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
