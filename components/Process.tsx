import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Process() {
  const processSteps = [
    {
      number: "01",
      title: "Discovery & Strategy",
      description: "Understanding your goals, audience, and technical requirements. Security assessment if needed."
    },
    {
      number: "02",
      title: "Design & Planning",
      description: "Detailed proposal with timeline, secure architecture design, and creative direction tailored to your needs."
    },
    {
      number: "03",
      title: "Development & Testing",
      description: "Iterative development with security built-in, regular check-ins, and transparent progress updates."
    },
    {
      number: "04",
      title: "Launch & Support",
      description: "Secure deployment with ongoing maintenance and support as your business grows."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="border-t border-border/50 pt-20">
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-primary">
              How we work together
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              A transparent, collaborative process designed to deliver exceptional results with security built-in from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-medium">{step.number}</span>
                </div>
                <h4 className="font-serif text-lg font-medium mb-2 text-primary">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

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
