import { Card, CardContent } from "./ui/card";
import { Quote, Star, Shield, Target } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Testimonials() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: testimonialsRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      company: "Melbourne Fintech",
      content: "Custom website and application development that transformed how we serve clients. The performance improvements were immediate and significant.",
      rating: 5,
      result: "340% performance improvement",
      avatar: "SC",
      metrics: ["Custom application architecture", "Optimized performance", "Enhanced user experience"]
    },
    {
      name: "Michael Rodriguez", 
      role: "Managing Partner",
      company: "Rodriguez Legal",
      content: "Complete SEO optimization and digital reputation management. We now dominate search results for legal services in Melbourne with 5x more qualified leads.",
      rating: 5,
      result: "5x increase in qualified leads",
      avatar: "MR",
      metrics: ["Page 1 search rankings", "Brand authority established", "Reputation protection"]
    },
    {
      name: "Emma Thompson",
      role: "Creative Director",
      company: "Lifestyle Brand Collective",
      content: "Enterprise security implementation gave us complete peace of mind. GDPR compliance and data protection that protects both our business and clients.",
      rating: 5,
      result: "Zero security incidents",
      avatar: "ET",
      metrics: ["GDPR compliance", "Data protection", "Enterprise security"]
    }
  ];

  const stats = [
    { value: "340%", label: "Average Organic Traffic Increase" },
    { value: "87%", label: "Page 1 Keyword Rankings" },
    { value: "5.2x", label: "Average Lead Generation Boost" },
    { value: "245%", label: "Average Revenue Growth" }
  ];

  return (
    <section id="testimonials" className="py-24 px-4 bg-gradient-to-br from-secondary/10 to-background" aria-labelledby="testimonials-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-20 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Trusted by Leaders
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary max-w-4xl mx-auto">
            Proven
            <span className="italic text-accent"> Results</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Melbourne businesses see measurable growth through our secure, custom websites and digital protection services.
          </p>
        </div>

        {/* Stats grid */}
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

        {/* Testimonials grid */}
        <div ref={testimonialsRef} className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-accent/50 mb-4" />
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Result highlight */}
                  <div className="bg-accent/10 rounded-lg p-4 mb-6">
                    <div className="text-sm font-medium text-accent mb-3">
                      {testimonial.result}
                    </div>
                    <div className="space-y-1">
                      {testimonial.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-accent rounded-full"></div>
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-primary">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-muted-foreground/80">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust signals */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by Melbourne businesses across industries
          </p>
          
          {/* Client types */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
              <div className="text-sm font-medium text-primary mb-2">Legal Firms</div>
              <div className="text-xs text-muted-foreground">GDPR compliance & reputation management</div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
              <div className="text-sm font-medium text-primary mb-2">Financial Services</div>
              <div className="text-xs text-muted-foreground">Enterprise security & custom platforms</div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
              <div className="text-sm font-medium text-primary mb-2">Healthcare Providers</div>
              <div className="text-xs text-muted-foreground">Privacy protection & secure systems</div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
              <div className="text-sm font-medium text-primary mb-2">Creative Agencies</div>
              <div className="text-xs text-muted-foreground">Custom development & brand protection</div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
              <h4 className="font-medium text-primary mb-3">Security Guarantee</h4>
              <div className="text-sm text-muted-foreground">
                Zero security incidents across all client projects. Enterprise-grade protection built in from day one.
              </div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <Target className="w-8 h-8 text-accent mx-auto mb-3" />
              <h4 className="font-medium text-primary mb-3">Results Guarantee</h4>
              <div className="text-sm text-muted-foreground">
                Measurable improvements in performance, security, and search rankings or we keep working until we get them.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}