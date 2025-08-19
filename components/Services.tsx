import { Code, Palette, Shield, Users } from "lucide-react";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";

export function Services() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: servicesRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(4);

  const services = [
    {
      icon: <Code className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Artisanal Web Development",
      description: "Every website meticulously crafted from blank canvas to pixel-perfect completion. Bespoke HTML, CSS, and JavaScript architectures built with purposeful precision. No templates, no builders, no compromises—just pure custom development where every element serves both form and function with mathematical exactness.",
      details: ["100% Custom Code Architecture", "Pixel-Perfect Design Implementation", "Mathematical Precision Layouts"]
    },
    {
      icon: <Palette className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Bespoke Design Systems",
      description: "Bespoke visual languages built from foundational principles. Every typeface selection, color palette, and spacing system designed with intentional precision. Custom iconography, meticulously balanced layouts, and sophisticated component libraries that elevate your brand above the template-driven masses.",
      details: ["Curated Typography Systems", "Custom Iconography & Illustrations", "Precision-Crafted Component Libraries"]
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Privacy, Security & SEO Services",
      description: "Control your digital narrative both ways - build positive SEO presence while removing negative exposure through comprehensive security and privacy cleanup. We remove data from brokers, implement enterprise security, GDPR compliance, and optimize your digital reputation to protect and promote your organization's interests.",
      details: ["Data Broker Removal & Security Audits", "SEO Reputation Management & Brand Protection", "GDPR Compliance & Digital Narrative Control"]
    },
    {
      icon: <Users className="w-6 h-6 text-accent" aria-hidden="true" />,
      title: "Strategic Digital Consulting", 
      description: "Bespoke consulting tailored to your specific industry challenges and growth objectives. Custom-designed technology strategies, curated tool recommendations, and personally crafted implementation roadmaps. No cookie-cutter solutions—just thoughtful, strategic guidance built around your unique business architecture.",
      details: ["Custom Technology Architecture", "Curated Tool Integration", "Personalized Growth Strategies"]
    }
  ];

  return (
    <section id="services" className="py-16 px-4" aria-labelledby="services-heading" role="main">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`mb-20 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.1em] text-muted-foreground uppercase mb-4">
              What We Do
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="services-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl tracking-tight">
            Development, Design &
            <span className="italic text-accent"> Consulting Services</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Every solution meticulously handcrafted from first principles. Custom code architecture, bespoke design systems, and comprehensive digital narrative control—all built with the precision and attention to detail that only comes from artisanal development practices.
            Zero shortcuts, zero templates, zero compromises.
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
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary tracking-tight">
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
