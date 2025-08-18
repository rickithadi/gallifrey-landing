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
      content: "Gallifrey transformed our digital infrastructure completely. The security improvements alone saved us from a potential breach that could have cost millions.",
      rating: 5,
      result: "Zero security incidents in 18 months",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez", 
      role: "Managing Partner",
      company: "Rodriguez Legal",
      content: "Their approach to digital sovereignty gave us complete control over our client data. The custom dashboard they built increased our operational efficiency by 40%.",
      rating: 5,
      result: "40% efficiency improvement",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Creative Director",
      company: "Lifestyle Brand Collective",
      content: "Working with Gallifrey was like having a dedicated CTO. They didn't just build our website – they architected our entire digital presence with military precision.",
      rating: 5,
      result: "3x conversion rate increase",
      avatar: "ET"
    }
  ];

  const stats = [
    { value: "100%", label: "Client Satisfaction" },
    { value: "47+", label: "Data Brokers Removed" },
    { value: "99.9%", label: "Security Uptime" },
    { value: "24/7", label: "Monitoring Coverage" }
  ];

  return (
    <section id="testimonials" className="py-24 px-4 bg-gradient-to-br from-secondary/10 to-background">
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

          <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl mx-auto">
            Results that speak for
            <span className="italic text-accent"> themselves</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From Melbourne startups to established enterprises, our clients trust us with their most critical digital infrastructure.
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
                  <div className="bg-accent/10 rounded-lg p-3 mb-6">
                    <div className="text-sm font-medium text-accent">
                      {testimonial.result}
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

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by businesses across Melbourne and beyond
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Industry badges - these would be real client logos */}
            <div className="px-4 py-2 border border-border/50 rounded-lg">
              <span className="text-sm font-medium">Fintech</span>
            </div>
            <div className="px-4 py-2 border border-border/50 rounded-lg">
              <span className="text-sm font-medium">Legal Services</span>
            </div>
            <div className="px-4 py-2 border border-border/50 rounded-lg">
              <span className="text-sm font-medium">Creative Agencies</span>
            </div>
            <div className="px-4 py-2 border border-border/50 rounded-lg">
              <span className="text-sm font-medium">Professional Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}