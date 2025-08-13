import { ArrowRight, Code, Palette, Shield, Users } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

import { Button } from "./ui/button";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(4);

  const services = [
    {
      icon: <Palette className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Pixel-Perfect Design Systems",
      description: "Custom-coded design systems with mathematical precision. Every element positioned purposefully, every interaction crafted to perfection. No templates, no compromises.",
      details: ["Bespoke Visual Identity", "Custom Component Libraries", "Precision Typography Systems"]
    },
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Hand-Crafted Development",
      description: "Obsessively detailed code architecture built from scratch. Every line optimized for performance, every function designed for elegance and maintainability.",
      details: ["Custom Code Architecture", "Performance Optimization", "Clean Code Principles"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Security-First Engineering",
      description: "Military-grade security woven into every pixel and line of code. GDPR compliance, data encryption, and privacy protection built from the foundation up.",
      details: ["Zero-Trust Architecture", "Privacy by Design", "Penetration Testing"]
    },
    {
      icon: <Users className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Artisan-Level Craftsmanship",
      description: "White-glove service with obsessive attention to detail. Every project treated as a masterpiece, every client relationship built on trust and excellence.",
      details: ["Personal Attention", "Quality Assurance", "Lifetime Support"]
    }
  ];

  return (
    <section id="services" className="py-24 px-4" aria-labelledby="services-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`mb-20 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Our Approach
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="services-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl">
            We craft pixel-perfect experiences with
            <span className="italic text-accent"> obsessive attention to detail</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Every project begins with custom design systems built from scratch. We position every pixel with mathematical precision because your brand deserves perfection, not templates.
          </p>
        </div>

        {/* Services grid */}
        <div ref={servicesRef} className="grid md:grid-cols-2 gap-12 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <div className="w-1 h-1 bg-accent rounded-full"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
