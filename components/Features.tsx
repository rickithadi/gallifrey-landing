import { BarChart3, Code2, Database, Rocket, Shield } from "lucide-react";
import { Card, CardContent } from "./ui/card";

import { ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Features() {
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

  const processSteps = [
    {
      number: "01",
      title: "Discovery & Strategy",
      description: "Understanding your goals, audience, and technical requirements. Security assessment if needed.",
      icon: <Database className="w-6 h-6 text-accent" />
    },
    {
      number: "02",
      title: "Design & Planning",
      description: "Detailed proposal with timeline, secure architecture design, and creative direction tailored to your needs.",
      icon: <Code2 className="w-6 h-6 text-accent" />
    },
    {
      number: "03",
      title: "Development & Testing",
      description: "Iterative development with security built-in, regular check-ins, and transparent progress updates.",
      icon: <Shield className="w-6 h-6 text-accent" />
    },
    {
      number: "04",
      title: "Launch & Support",
      description: "Secure deployment with ongoing maintenance and support as your business grows.",
      icon: <Rocket className="w-6 h-6 text-accent" />
    }
  ];

  return (
    <section id="process" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            Technical Excellence
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 text-primary font-heading font-medium">
            How We Work Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A transparent, collaborative process designed to deliver exceptional results with security built-in from day one.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Process Steps */}
          <div>
            <h3 className="text-2xl mb-8 text-primary font-heading font-medium">Our Process</h3>
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-accent font-medium">{step.number}</span>
                    </div>
                    {index < processSteps.length - 1 && <div className="w-px h-16 bg-border"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {step.icon}
                      <h4 className="font-serif text-lg font-medium text-primary">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Capabilities */}
          <div>
            <h3 className="text-2xl mb-8 text-primary font-heading font-medium">Technical Capabilities</h3>
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

        {/* Call to action */}
        <div className="text-center border-t border-border/50 pt-16">
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ready to start your project? Let&apos;s discuss your requirements and create something exceptional together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              Start your project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
              View more work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
