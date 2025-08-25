import { BarChart3, Database, Shield, Code, Zap, Globe } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

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

  const featuredCapabilities = [
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: "Security-First Architecture",
      description: "Every project built with enterprise-grade security from day one, not as an afterthought.",
      highlights: ["Zero-trust implementation", "Advanced threat protection", "Compliance automation"]
    },
    {
      icon: <Code className="w-8 h-8 text-accent" />,
      title: "Custom Development Excellence",
      description: "Bespoke solutions crafted to your exact specifications with mathematical precision.",
      highlights: ["Hand-coded perfection", "Scalable architecture", "Future-proof technology"]
    },
    {
      icon: <Zap className="w-8 h-8 text-accent" />,
      title: "Performance Optimization",
      description: "Lightning-fast websites that deliver exceptional user experiences and search rankings.",
      highlights: ["Core Web Vitals optimization", "90+ PageSpeed scores", "Sub-3-second load times"]
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            Technical Excellence
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 text-primary font-heading font-medium">
            Enterprise-Grade Capabilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced technical capabilities that set your digital presence apart from the competition.
          </p>
        </div>

        {/* Featured Capabilities Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {featuredCapabilities.map((feature, index) => (
            <Card key={index} className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  {feature.icon}
                  <h3 className="font-semibold text-primary text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Stack Overview */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl mb-8 text-primary font-heading font-medium">Enterprise Technology Stack</h3>
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-8 h-8 text-accent" />
                  <div>
                    <h4 className="font-semibold text-primary">Modern Architecture</h4>
                    <p className="text-sm text-muted-foreground">Built with scalable, future-proof technologies</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl mb-8 text-primary font-heading font-medium">Performance Guarantees</h3>
            <div className="space-y-6">
              <Card className="bg-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-accent" />
                    <h4 className="font-semibold text-primary">Speed & Performance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Every site optimized for Core Web Vitals, achieving industry-leading performance metrics.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent mb-1">90+</div>
                      <div className="text-xs text-muted-foreground">PageSpeed Score</div>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent mb-1">&lt;3s</div>
                      <div className="text-xs text-muted-foreground">Load Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-accent" />
                    <h4 className="font-semibold text-primary">Global Accessibility</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    WCAG 2.1 AA compliant designs ensuring your content reaches the widest possible audience.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-accent" />
                    <h4 className="font-semibold text-primary">Security Assurance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive security testing and ongoing monitoring to protect your business and users.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
