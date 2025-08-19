import { Card, CardContent } from "./ui/card";
import { Quote, Star } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Testimonials() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: testimonialsRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(3);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      company: "Melbourne Fintech",
      content: "The level of craftsmanship was extraordinary—bespoke development from the ground up, every design element positioned with mathematical precision. Their custom website and application suite transformed how we serve clients, with performance that leaves competitors behind.",
      rating: 5,
      result: "Custom digital platform + 340% performance boost",
      avatar: "SC",
      metrics: ["Bespoke application architecture", "Pixel-perfect design implementation", "Custom user experience flows"]
    },
    {
      name: "Michael Rodriguez", 
      role: "Managing Partner",
      company: "Rodriguez Legal",
      content: "Their comprehensive approach to digital narrative control was game-changing. Complete SEO optimization, brand authority establishment, and negative content suppression. We now dominate search results for legal services in Melbourne with 5x more qualified leads.",
      rating: 5,
      result: "5x qualified leads + Complete digital authority",
      avatar: "MR",
      metrics: ["Page 1 rankings for all target keywords", "Brand authority domination", "Negative content completely suppressed"]
    },
    {
      name: "Emma Thompson",
      role: "Creative Director",
      company: "Lifestyle Brand Collective",
      content: "The enterprise-grade security implementation gave us complete peace of mind. GDPR compliance, data protection, and privacy infrastructure that protects both our business and our clients. Security became our competitive advantage instead of a concern.",
      rating: 5,
      result: "Zero security incidents + Enterprise protection",
      avatar: "ET",
      metrics: ["GDPR compliance achieved", "Zero data breaches", "Enterprise security standards"]
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

          <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl mx-auto">
            Results that speak for
            <span className="italic text-accent"> themselves</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Measurable SEO growth and digital narrative control that drives real revenue impact. Each solution is meticulously crafted—sophisticated architecture that search engines reward and audiences trust, delivering both technical excellence and brand authority through precision-built digital experiences.
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

        {/* Trust indicators with SEO focus */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Delivering measurable SEO and business growth across industries
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h4 className="font-medium text-primary mb-3">SEO & Search Dominance</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Page 1 rankings for competitive keywords</div>
                <div>• Local SEO dominance in Melbourne</div>
                <div>• Negative content suppression & brand protection</div>
              </div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h4 className="font-medium text-primary mb-3">Business Growth & Revenue</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• 5x qualified lead generation increases</div>
                <div>• 275% average revenue growth</div>
                <div>• Complete digital narrative control</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}