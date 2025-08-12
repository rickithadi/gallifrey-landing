import { ArrowRight, Clock, Mail, MessageCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-4" aria-labelledby="contact-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <header className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Get in Touch
            </p>
            <div className="w-12 h-px bg-accent" role="presentation"></div>
          </div>

          <h2 id="contact-heading" className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary max-w-4xl">
            Let&apos;s build something
            <span className="italic text-accent"> exceptional together</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Ready to start your project? Schedule a 30-minute consultation to discuss your requirements,
            timeline, and how we can help bring your vision to life.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-background border border-border/50 rounded-lg p-8">
              <form className="space-y-6" aria-label="Contact form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-primary">Name *</label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="h-11 border-border/50 focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-primary">Email *</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-11 border-border/50 focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-primary">Company</label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      className="h-11 border-border/50 focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="budget" className="block text-sm font-medium text-primary">Budget Range</label>
                    <Select>
                      <SelectTrigger className="h-11 border-border/50 focus:border-accent focus:ring-accent/20">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essential">$500 - $1,500 (Essential)</SelectItem>
                        <SelectItem value="professional">$1,500 - $5,000 (Professional)</SelectItem>
                        <SelectItem value="enterprise">$5,000+ (Enterprise)</SelectItem>
                        <SelectItem value="unsure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="project" className="block text-sm font-medium text-primary">Project Type</label>
                  <Select>
                    <SelectTrigger className="h-11 border-border/50 focus:border-accent focus:ring-accent/20">
                      <SelectValue placeholder="What do you need?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Business Website</SelectItem>
                      <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                      <SelectItem value="webapp">Web Application</SelectItem>
                      <SelectItem value="portfolio">Portfolio/Personal Site</SelectItem>
                      <SelectItem value="consulting">Strategy Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-primary">Project Details *</label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                    rows={6}
                    className="border-border/50 focus:border-accent focus:ring-accent/20 resize-none"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="mt-1 w-4 h-4 text-accent border-border rounded focus:ring-accent/20"
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the privacy policy and understand that my information will be handled securely
                    and used only for project communication.
                  </label>
                </div>

                <Button className="bg-primary hover:bg-primary/90 px-8 py-3 group">
                  Send message
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                Direct Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Email</p>
                    <p className="text-sm text-muted-foreground">hello@gallifreyconsulting.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Consultation</p>
                    <p className="text-sm text-muted-foreground">Free 30-minute strategy call</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-8">
              <h4 className="font-serif text-lg font-medium mb-4 text-primary">
                What to expect
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full mt-2"></div>
                  <span>Personal response within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full mt-2"></div>
                  <span>Detailed project proposal and timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full mt-2"></div>
                  <span>Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full mt-2"></div>
                  <span>Security and privacy consultation included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
