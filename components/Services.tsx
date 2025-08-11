import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Palette, Code, Users } from "lucide-react";

export function Services() {
  const pillars = [
    {
      icon: <Shield className="w-10 h-10 text-accent" />,
      title: "Security First",
      subtitle: "Zero-Trust Architecture",
      description: "Every build audited, tested, and production-hardened. We integrate PCI-DSS compliance, encrypt customer data, and protect payment flows with enterprise-grade security protocols."
    },
    {
      icon: <Palette className="w-10 h-10 text-accent" />,
      title: "Bespoke Craftsmanship",
      subtitle: "No Templates, Pure Custom",
      description: "100% custom UI, code, and integrations tailored to your brand. Every pixel crafted with intention, every interaction designed for conversion and user delight."
    },
    {
      icon: <Code className="w-10 h-10 text-accent" />,
      title: "Design Excellence",
      subtitle: "Conversion-Focused Beauty",
      description: "Clean, minimalist design that converts. We blend aesthetic excellence with strategic UX, creating digital experiences that are both beautiful and business-driving."
    },
    {
      icon: <Users className="w-10 h-10 text-accent" />,
      title: "Trust & Transparency",
      subtitle: "Partnership Over Projects",
      description: "Open budgets, clear roadmaps, milestone updates. We build lasting relationships through honest communication and ongoing support that adapts to your evolving needs."
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6 text-primary">
            The Four Pillars of Digital Trust
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our core values guide every decision, blending reliability with creativity. 
            We don't just build websites—we engineer digital fortresses with a human touch.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <CardTitle className="text-lg mb-1">{pillar.title}</CardTitle>
                <p className="text-sm text-accent font-medium">{pillar.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            <span className="text-accent font-semibold">Your idea-to-secure-launch partner</span> — 
            fostering ongoing relationships through bespoke processes that adapt to your evolving needs.
          </p>
        </div>
      </div>
    </section>
  );
}