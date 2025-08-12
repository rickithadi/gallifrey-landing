import { ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "./ui/button";

export function Work() {
  return (
    <section id="work" className="py-24 px-4" aria-labelledby="work-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Our Work
            </p>
            <div className="w-12 h-px bg-accent"></div>
          </div>

          <h2 id="work-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl">
            Projects that
            <span className="italic text-accent"> speak for themselves</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Every project is a partnership. Here&apos;s how we&apos;ve helped businesses build secure, performant digital experiences that drive real results.
          </p>
        </div>

        {/* TODO: Case Studies Grid */}
        {/*
        TODO: Add case studies here. Structure should include:

        1. Case Study Grid (3 columns on desktop, 1-2 on mobile)
        2. Each case study card should have:
           - Project hero image/screenshot
           - Client name and industry
           - Project title and brief description
           - Key technologies used (React, Next.js, etc.)
           - Key results/metrics (performance improvements, security features, etc.)
           - "View Project" or "Read Case Study" button
           - Optional: "Visit Live Site" button if public

        3. Categories to consider:
           - Security-first websites
           - Performance optimization projects
           - Custom web applications
           - E-commerce solutions
           - Portfolio/personal brand sites

        4. Content needed for each case study:
           - High-quality project screenshots
           - Client testimonials/quotes
           - Technical details and challenges solved
           - Before/after metrics (load times, security scores, etc.)
           - Project timeline and scope

        5. Interactive elements:
           - Hover effects on cards
           - Filter by project type/technology
           - "Load More" or pagination for additional projects
        */}

        <div className="mb-20">
          {/* Placeholder for case studies grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* TODO: Replace these placeholder cards with real case studies */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="group">
                <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent/30">
                  {/* TODO: Replace with actual project image */}
                  <div className="aspect-video bg-muted/30 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Project Screenshot {index}
                    </p>
                  </div>

                  <div className="p-6">
                    {/* TODO: Replace with actual project data */}
                    <div className="mb-4">
                      <p className="text-sm text-accent font-medium mb-2">
                        Client Industry • Project Type
                      </p>
                      <h3 className="font-serif text-xl font-medium mb-3 text-primary group-hover:text-accent transition-colors">
                        Project Title
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                        Brief description of the project, challenges solved, and key outcomes achieved.
                      </p>
                    </div>

                    {/* TODO: Add technology tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                        React
                      </span>
                      <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                        Next.js
                      </span>
                      <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                        Security
                      </span>
                    </div>

                    {/* TODO: Add project links */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Case Study
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                      <Button size="sm" variant="ghost" className="px-3">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center border-t border-border/50 pt-16">
          <h3 className="text-2xl font-serif font-medium mb-4 text-primary">
            Ready to start your project?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help you build something exceptional. Every great project starts with a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90">
              Start a project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 border-muted-foreground/20 hover:bg-muted/50">
              Schedule consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
