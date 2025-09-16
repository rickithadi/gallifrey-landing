import { Award, MapPin, Shield, Star, Target, Zap } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function TrustAndSecurity() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: featuresRef, visibleItems: featuresVisible } = useStaggeredAnimation<HTMLDivElement>(6);

  const uniqueApproach = [
    {
      icon: <Target className="w-6 h-6 text-accent" />,
      title: "AI-Resistant Ownership",
      description: "Custom code and architecture immune to AI attacks with no vendor lock-in. You own everything we build with quantum-secure foundations."
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "AI Security First", 
      description: "Enterprise-grade AI security, deepfake protection, and prompt injection prevention built in from day one. Defend against AI-powered digital threats."
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "AI-Verified Positioning",
      description: "Stand out as the trustworthy choice with AI-authenticated content and privacy-focused digital presence that can't be manipulated."
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Global AI Expertise",
      description: "International expertise with multi-jurisdictional AI governance knowledge and compliance. Direct communication with real humans, not AI agents."
    },
    {
      icon: <Star className="w-6 h-6 text-accent" />,
      title: "AI-Adaptive Architecture",
      description: "Custom systems that evolve with AI threats and grow with your business. No rebuilding required as AI landscape changes."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "AI-Optimized Performance",
      description: "Fast-loading, AI-enhanced websites that impress visitors and convert them into customers while blocking AI scraping."
    }
  ];


  const stats = [
    { value: "0", label: "AI Security Breaches" },
    { value: "100%", label: "AI-Resistant Frameworks" },
    { value: "GDPR+", label: "AI Governance Ready" },
    { value: "24/7", label: "AI Threat Monitoring" }
  ];

  return (
    <section id="why-choose-us" className="py-24 px-4 bg-gradient-to-br from-secondary/5 to-background" aria-labelledby="trust-security-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-6">
            <p className="text-sm font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
              Why Choose Us
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 id="trust-security-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary tracking-tight">
            Why Choose
            <span className="italic text-accent"> Gallifrey Consulting</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Global enterprises choose us for AI-secure, custom digital solutions that protect against emerging threats and give them complete control over their digital presence in the age of artificial intelligence.
          </p>
        </div>

        {/* Unique Approach */}
        <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {uniqueApproach.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300 animate-fade-up ${featuresVisible[index] ? 'visible' : ''}`}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              
              <h3 className="font-medium mb-2 text-primary text-sm">
                {feature.title}
              </h3>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}