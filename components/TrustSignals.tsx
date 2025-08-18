import { Award, Globe, Lock, MapPin, Shield, Users } from "lucide-react";

export function TrustSignals() {
  const trustBadges = [
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Enterprise Security",
      description: "Military-grade infrastructure"
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "GDPR Compliant",
      description: "Privacy by design certified"
    },
    {
      icon: <Lock className="w-6 h-6 text-accent" />,
      title: "SSL Secured",
      description: "End-to-end encryption"
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Melbourne Based",
      description: "Local expertise, global reach"
    },
    {
      icon: <Users className="w-6 h-6 text-accent" />,
      title: "100% Satisfaction",
      description: "Guaranteed results"
    },
    {
      icon: <Globe className="w-6 h-6 text-accent" />,
      title: "24/7 Monitoring",
      description: "Always protected"
    }
  ];

  return (
    <div className="bg-muted/20 border-t border-border/50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by businesses across Melbourne and beyond
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className="text-center p-4 rounded-lg hover:bg-background/50 transition-colors"
            >
              <div className="flex justify-center mb-3">
                {badge.icon}
              </div>
              <div className="text-xs font-medium text-primary mb-1">
                {badge.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {badge.description}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
            <span>🔒 ISO 27001 Security Standards</span>
            <span>•</span>
            <span>🇦🇺 Australian Privacy Compliant</span>
            <span>•</span>
            <span>⚡ 99.9% Uptime Guarantee</span>
            <span>•</span>
            <span>🛡️ Zero-Trust Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
}