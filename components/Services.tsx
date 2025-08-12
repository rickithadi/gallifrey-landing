import { ArrowRight, Code, Palette, Shield, Users } from "lucide-react";

import { Button } from "./ui/button";

export function Services() {
  const services = [
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Security-First Development",
      description: "GDPR compliance, data encryption, and privacy protection built into every project from day one. No retrofitting, no compromises.",
      details: ["PCI-DSS Compliance", "Zero-Trust Architecture", "Penetration Testing"]
    },
    {
      icon: <Palette className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Custom Design Systems",
      description: "Bespoke UI components and design languages that reflect your brand identity. No templates, no shortcuts.",
      details: ["Brand-Aligned Design", "Component Libraries", "Design Tokens"]
    },
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Performance Engineering",
      description: "Fast, accessible, and SEO-optimized experiences that convert visitors into customers.",
      details: ["Core Web Vitals", "Accessibility (WCAG)", "Technical SEO"]
    },
    {
      icon: <Users className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Ongoing Partnership",
      description: "Transparent communication, flexible arrangements, and support that evolves with your business needs.",
      details: ["Open Communication", "Flexible Pricing", "Long-term Support"]
    }
  ];

  return (
    <section id="services" className="py-24 px-4" aria-labelledby="services-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Our Approach
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="services-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl">
            Digital experiences that protect your story and
            <span className="italic text-accent"> amplify your voice</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            We don't just build websites—we create digital sanctuaries where your brand can thrive
            without the fear of platform changes, algorithm updates, or disappearing content.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary">
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

        {/* Call to action */}
        <div className="text-center border-t border-border/50 pt-16">
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to build something that stands the test of time?
            Let&apos;s discuss your project over a 30-minute consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              Start a conversation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
              View our work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
