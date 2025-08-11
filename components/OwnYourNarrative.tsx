import { ArrowRight, Globe, Monitor, Smartphone } from "lucide-react";

import { Button } from "./ui/button";

export function OwnYourNarrative() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Custom shopping experience with integrated payments and inventory management",
      tech: ["Next.js", "Stripe", "PostgreSQL"],
      category: "E-commerce"
    },
    {
      title: "SaaS Dashboard",
      description: "Analytics platform with real-time data visualization and user management",
      tech: ["React", "D3.js", "Node.js"],
      category: "SaaS"
    },
    {
      title: "Professional Portfolio",
      description: "Personal brand website with content management and contact integration",
      tech: ["Next.js", "Sanity CMS", "Vercel"],
      category: "Portfolio"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "We start with a 30-minute consultation to understand your goals, audience, and technical requirements."
    },
    {
      step: "02",
      title: "Strategy",
      description: "Detailed proposal with timeline, security plan, and design direction tailored to your needs."
    },
    {
      step: "03",
      title: "Development",
      description: "Iterative development with regular check-ins and transparent progress updates."
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Secure deployment with ongoing maintenance and support as your business grows."
    }
  ];

  return (
    <section id="work" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Selected Work
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl">
            Digital experiences that
            <span className="italic text-accent"> perform and protect</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            From personal portfolios to enterprise platforms, we build with the same attention to security,
            performance, and user experience regardless of project size.
          </p>
        </div>

        {/* Project showcase */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {projects.map((project, index) => (
            <div key={index} className="group">
              <div className="bg-background border border-border/50 rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium mb-3 text-primary group-hover:text-accent transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process section */}
        <div className="border-t border-border/50 pt-20">
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-primary">
              How we work together
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              A transparent, collaborative process designed to deliver results without surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-medium">{item.step}</span>
                </div>
                <h4 className="font-serif text-lg font-medium mb-2 text-primary">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to start your project? Let's discuss your requirements and create something exceptional together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
                Start your project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
                View more work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
