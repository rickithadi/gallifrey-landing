import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Database, Users, Palette, Rocket, Shield, BarChart3 } from "lucide-react";

export function Features() {
  const processSteps = [
    {
      number: "01",
      title: "Discovery & Strategy",
      description: "Deep stakeholder interviews, technical & privacy audits, SEO baseline, competitive analysis → strategic roadmap.",
      icon: <Users className="w-6 h-6" />
    },
    {
      number: "02", 
      title: "UX/UI & Bespoke Design",
      description: "Research-driven wireframes → high-fidelity prototypes → custom style guides with consistent brand systems.",
      icon: <Palette className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Principled Engineering & Security",
      description: "Modern JS/TS architectures → PCI-DSS checkout flows → pentesting → zero-trust patterns for enterprise-grade security.",
      icon: <Shield className="w-6 h-6" />
    },
    {
      number: "04",
      title: "Launch, Support & Partnership",
      description: "24/7 monitoring → retainer-based sprints → feature development → performance tuning → fraud monitoring.",
      icon: <Rocket className="w-6 h-6" />
    }
  ];

  const capabilities = [
    "Modern JavaScript/TypeScript Architecture",
    "PCI-DSS Payment Security",
    "GDPR & CCPA Privacy Compliance",
    "Zero-Trust Security Patterns",
    "Performance & SEO Optimization",
    "24/7 Security Monitoring",
    "Fraud Detection Systems",
    "Custom API Development",
    "Database Design & Optimization",
    "Cloud Infrastructure Management"
  ];

  return (
    <section id="process" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            From Strategy to Partnership
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 text-primary">
            Our Bespoke Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Relationship-driven development with ongoing dialogue through dedicated channels. 
            We adapt iteratively based on your feedback and evolving business needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h3 className="text-2xl mb-8 text-primary">Development Process</h3>
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold mb-4">
                      {step.number}
                    </div>
                    {index < processSteps.length - 1 && <div className="w-px h-16 bg-border"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-accent">
                        {step.icon}
                      </div>
                      <h4 className="font-semibold text-primary">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl mb-8 text-primary">Technical Capabilities</h3>
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-8 h-8 text-accent" />
                  <div>
                    <h4 className="font-semibold text-primary">Enterprise-Grade Stack</h4>
                    <p className="text-sm text-muted-foreground">Built with modern, scalable technologies</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">Performance Guarantee</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Every site optimized for Core Web Vitals, achieving 90+ PageSpeed scores and sub-3-second load times.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}