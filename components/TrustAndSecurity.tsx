import { Award, MapPin, Shield, Star, Target, Zap } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function TrustAndSecurity() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: featuresRef, visibleItems: featuresVisible } = useStaggeredAnimation<HTMLDivElement>(6);

  const uniqueApproach = [
    {
      icon: <Target className="w-6 h-6 text-accent" />,
      title: "Self-Healing Infrastructure",
      description: "AI-powered systems that automatically detect, diagnose, and repair issues before they impact your business. Zero-touch operations with 99.99% uptime guarantee."
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Autonomous Security Operations", 
      description: "Ubuntu/Kali-powered SOC with AI threat hunting, automated response, and predictive vulnerability management. 24/7 protection without human intervention."
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "Intelligent Cost Optimization",
      description: "AI algorithms continuously optimize your cloud spending, resource allocation, and infrastructure efficiency. Average 70% cost reduction achieved."
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Multi-Cloud AI Orchestration",
      description: "Seamless management across AWS, Azure, and GCP with intelligent failover, load balancing, and performance optimization. Global scale, local efficiency."
    },
    {
      icon: <Star className="w-6 h-6 text-accent" />,
      title: "Predictive Scaling Architecture",
      description: "Machine learning algorithms predict demand patterns and automatically scale resources. Never over-provision or under-perform again."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Zero-Downtime Guarantee",
      description: "AI-powered redundancy and instant failover systems ensure continuous operation. Self-recovering data protection with autonomous disaster recovery."
    }
  ];


  const stats = [
    { value: "99.99%", label: "Uptime Achieved" },
    { value: "70%", label: "Cost Reduction" },
    { value: "0.3s", label: "Incident Response" },
    { value: "24/7", label: "Autonomous Operations" }
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
            <span className="italic text-accent"> Autonomous Infrastructure</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Global enterprises choose us for self-healing, AI-powered infrastructure that reduces operational costs by 70% while achieving 99.99% uptime. Experience the flow state of zero-touch operations.
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