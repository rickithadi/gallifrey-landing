import { Award, CheckCircle, MapPin, Shield, Star, Target, Zap } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function TrustAndSecurity() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: featuresRef, visibleItems: featuresVisible } = useStaggeredAnimation<HTMLDivElement>(6);

  const uniqueApproach = [
    {
      icon: <Target className="w-6 h-6 text-accent" />,
      title: "You Own Everything",
      description: "Complete ownership of your code, your data, and your digital assets. No vendor lock-in, no dependencies on platforms that can change their terms overnight. Your investment is truly yours."
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Security as Your Advantage", 
      description: "While competitors worry about data breaches and compliance headaches, you operate with confidence. Enterprise-grade security built from day one becomes your competitive moat."
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "Premium Market Position",
      description: "GDPR compliance and data sovereignty aren't just checkboxes - they position you as the premium, trustworthy choice. Win clients who value privacy and professionalism."
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Melbourne Advantage",
      description: "Local expertise that understands Australian business culture, privacy laws, and market dynamics. Plus the responsiveness and accountability that comes with working locally."
    },
    {
      icon: <Star className="w-6 h-6 text-accent" />,
      title: "Built to Scale With You",
      description: "Your digital infrastructure grows and evolves as your business does. AI-assisted optimization ensures peak performance as you scale. No rebuilding from scratch, no platform migrations - just continuous enhancement of what already works perfectly."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Performance That Impresses",
      description: "Blazing-fast loading times, pixel-perfect design, and flawless user experiences that make your brand look exceptional. Your website becomes a powerful sales and credibility tool."
    }
  ];


  const stats = [
    { value: "0", label: "Security Incidents" },
    { value: "100%", label: "Custom Security Frameworks" },
    { value: "GDPR", label: "Compliant by Design" },
    { value: "24/7", label: "Security Monitoring" }
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
            <p className="text-sm font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
              Why Choose Us
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary tracking-tight">
            Built for Your Success &
            <span className="italic text-accent"> Digital Independence</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your business deserves digital solutions that amplify your strengths and protect your interests. 
            We craft bespoke, security-first websites and systems using AI-accelerated development processes that give you complete control over your digital presence, 
            your data, and your competitive advantage.
          </p>
        </div>

        {/* Unique Approach */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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