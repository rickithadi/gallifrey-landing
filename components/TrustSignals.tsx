import { Award, CheckCircle, MapPin, Shield, Star, Target, Zap } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function TrustSignals() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: credentialsRef, visibleItems: credentialsVisible } = useStaggeredAnimation<HTMLDivElement>(6);
  const { ref: valuesRef, visibleItems: valuesVisible } = useStaggeredAnimation<HTMLDivElement>(4);

  const credentials = [
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Enterprise Security",
      subtitle: "Zero-Trust Architecture",
      description: "Military-grade security with comprehensive threat monitoring"
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "Compliance Excellence",
      subtitle: "GDPR & Australian Standards",
      description: "Privacy-by-design implementation and regulatory compliance"
    },
    {
      icon: <Target className="w-6 h-6 text-accent" />,
      title: "Strategic Consulting",
      subtitle: "Digital Footprint Assessment Focus",
      description: "Platform independence and competitive positioning expertise"
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Performance Guarantee",
      subtitle: "99.9% Uptime Assurance",
      description: "Enterprise-grade infrastructure and continuous monitoring"
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Melbourne Expertise",
      subtitle: "Local Market Knowledge",
      description: "Deep understanding of Australian business and regulatory landscape"
    },
    {
      icon: <Star className="w-6 h-6 text-accent" />,
      title: "Proven Results",
      subtitle: "Zero Security Incidents",
      description: "18+ months of perfect security record across all client engagements"
    }
  ];

  const premiumCommitments = [
    {
      icon: <CheckCircle className="w-6 h-6 text-accent" />,
      title: "No Vendor Lock-in Guarantee",
      description: "Every solution maintains your strategic independence and switching power"
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Security-First Architecture",
      description: "Military-grade security as the foundation of every engagement"
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "Strategic Partnership Approach",
      description: "Long-term relationship focus with ongoing strategic consultation"
    },
    {
      icon: <Target className="w-6 h-6 text-accent" />,
      title: "Measurable Business Outcomes",
      description: "Clear ROI metrics and competitive advantage measurement"
    }
  ];

  const securityStandards = [
    "ISO 27001 Aligned",
    "OWASP Compliant",
    "SOC 2 Framework",
    "Zero Trust Architecture",
    "Australian Privacy Principles",
    "GDPR Certified"
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-secondary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-6">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Premium Digital Consulting Standards
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif font-medium leading-tight mb-4 text-primary">
            Trusted Excellence in
            <span className="italic text-accent"> Strategic Security</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our commitment to premium consulting standards ensures every engagement delivers 
            measurable competitive advantages through enterprise-grade security and strategic thinking.
          </p>
        </div>

        {/* Credentials Grid */}
        <div ref={credentialsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {credentials.map((credential, index) => (
            <div
              key={index}
              className={`group text-center p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300 animate-fade-up ${credentialsVisible[index] ? 'visible' : ''}`}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                {credential.icon}
              </div>
              
              <h3 className="font-medium mb-1 text-primary text-sm">
                {credential.title}
              </h3>
              
              <p className="text-xs font-medium text-accent mb-2">
                {credential.subtitle}
              </p>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {credential.description}
              </p>
            </div>
          ))}
        </div>

        {/* Premium Commitments */}
        <div className="bg-accent/5 rounded-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif font-medium leading-tight mb-3 text-primary">
              Our Premium Commitment to Your Success
            </h3>
            <p className="text-sm text-muted-foreground">
              Four core principles that guide every strategic engagement and ensure competitive advantage.
            </p>
          </div>

          <div ref={valuesRef} className="grid lg:grid-cols-2 gap-6">
            {premiumCommitments.map((commitment, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg animate-fade-up ${valuesVisible[index] ? 'visible' : ''}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {commitment.icon}
                </div>
                <div>
                  <h4 className="font-medium text-primary mb-1 text-sm">
                    {commitment.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {commitment.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Standards & Metrics */}
        <div className="text-center">
          <h3 className="text-lg font-serif font-medium text-primary mb-6">
            Security & Compliance Standards
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {securityStandards.map((standard, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full"
              >
                <span className="text-xs font-medium text-accent">{standard}</span>
              </div>
            ))}
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center mb-4">
              <div>
                <div className="text-2xl font-bold text-accent mb-1">100%</div>
                <div className="text-xs text-muted-foreground">Security Compliance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">99.9%</div>
                <div className="text-xs text-muted-foreground">Infrastructure Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">0</div>
                <div className="text-xs text-muted-foreground">Security Incidents</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Strategic Guarantee:</span> Every solution maintains your digital independence 
                and strengthens your competitive positioning in the Australian market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}