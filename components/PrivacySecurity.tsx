import { Card, CardContent } from "./ui/card";
import { Database, Lock, Search, Shield, UserCheck } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

import { Badge } from "./ui/badge";

export function PrivacySecurity() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);
  const metricsAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: featuresRef, visibleItems: featuresVisible } = useStaggeredAnimation<HTMLDivElement>(2);

  const services = [
    {
      icon: <Shield className="w-8 h-8 text-accent" aria-hidden="true" />,
      title: "Data Privacy Protection",
      description: "Comprehensive privacy audits, GDPR/CCPA compliance implementation, and data cleanup services. We remove your information from data brokers and establish robust privacy controls.",
      features: [
        "Data Broker Removal",
        "GDPR/CCPA Compliance",
        "Privacy Impact Assessments",
        "Data Minimization Strategies"
      ]
    },
    {
      icon: <Lock className="w-8 h-8 text-accent" aria-hidden="true" />,
      title: "Security Engineering",
      description: "Military-grade security architecture with zero-trust principles. Penetration testing, fraud monitoring, and enterprise-level security implementations.",
      features: [
        "Zero-Trust Architecture",
        "Penetration Testing",
        "Security Audits",
        "Fraud Detection Systems"
      ]
    },
    {
      icon: <UserCheck className="w-8 h-8 text-accent" aria-hidden="true" />,
      title: "Reputation Management",
      description: "Strategic digital presence optimization and unwanted content removal. We help establish your authoritative online narrative while removing damaging information.",
      features: [
        "Content Removal Services",
        "SEO Reputation Repair",
        "Digital Presence Strategy",
        "Brand Protection Monitoring"
      ]
    }
  ];

  const trustMetrics = [
    { value: "47+", label: "Data Brokers Removed" },
    { value: "99.9%", label: "Security Uptime" },
    { value: "100%", label: "GDPR Compliance Rate" },
    { value: "24/7", label: "Security Monitoring" }
  ];

  return (
    <section id="privacy-security" className="py-24 px-4 bg-gradient-to-br from-secondary/20 to-secondary/5">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-20 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            Digital Privacy & Security
          </Badge>
          <h2 className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary">
            Protect Your Digital Identity &
            <span className="italic text-accent"> Own Your Narrative</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From data privacy protection to reputation management, we help you establish complete digital sovereignty.
            Remove unwanted information, secure your data, and build the online presence you deserve.
          </p>
        </div>

        {/* Services grid */}
        <div ref={servicesRef} className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust metrics */}
        <div
          ref={metricsAnimation.ref}
          className={`bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50 animate-fade-up animate-delay-200 ${metricsAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif font-medium text-primary mb-2">
              Proven Track Record
            </h3>
            <p className="text-muted-foreground">
              Trusted by businesses and individuals to protect their digital assets
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional security features */}
        <div ref={featuresRef} className="mt-16 grid md:grid-cols-2 gap-8">
          <div className={`flex items-start gap-4 animate-fade-up animate-delay-400 ${featuresVisible[0] ? 'visible' : ''}`}>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Data Sovereignty</h4>
              <p className="text-sm text-muted-foreground">
                Complete control over your data with custom hosting solutions and platform independence strategies.
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-4 animate-fade-up animate-delay-600 ${featuresVisible[1] ? 'visible' : ''}`}>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Continuous Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                24/7 monitoring of your digital footprint with automated alerts for new privacy threats or reputation risks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
