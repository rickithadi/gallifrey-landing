import { ArrowRight, CheckCircle, Clock, Mail, MessageCircle, Phone, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-br from-background via-gallifrey-gray/10 to-accent/5">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl md:text-6xl mb-8 text-primary">
            Ready to Build Your <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Digital Fortress?</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 font-body leading-relaxed">
            Let's craft your secure, strategic digital presence. Get in touch for a free 30-minute consultation
            and discover how we can fortify your business online.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Shield className="w-4 h-4 text-accent" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Boutique-level care</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Personal relationships</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-brand-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="font-heading text-3xl text-primary mb-4">Start Your Digital Transformation</CardTitle>
                <p className="text-lg text-muted-foreground font-body leading-relaxed">
                  Tell us about your vision and we'll craft a bespoke proposal within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-primary font-body">Name *</label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        className="h-12 border-border/50 focus:border-accent focus:ring-accent/20 bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-primary font-body">Email *</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 border-border/50 focus:border-accent focus:ring-accent/20 bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="block text-sm font-medium text-primary font-body">Company/Organization</label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        className="h-12 border-border/50 focus:border-accent focus:ring-accent/20 bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="budget" className="block text-sm font-medium text-primary font-body">Project Budget</label>
                      <Select>
                        <SelectTrigger className="h-12 border-border/50 focus:border-accent focus:ring-accent/20 bg-background/50 backdrop-blur-sm">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starter">$500 - $1,500 (Starter)</SelectItem>
                          <SelectItem value="growth">$1,500 - $5,000 (Growth)</SelectItem>
                          <SelectItem value="enterprise">$5,000+ (Enterprise)</SelectItem>
                          <SelectItem value="unsure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="project" className="block text-sm font-medium text-primary font-body">Project Type</label>
                    <Select>
                      <SelectTrigger className="h-12 border-border/50 focus:border-accent focus:ring-accent/20 bg-background/50 backdrop-blur-sm">
                        <SelectValue placeholder="What do you need?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Website/Brand</SelectItem>
                        <SelectItem value="business">Business Website</SelectItem>
                        <SelectItem value="ecommerce">E-commerce Solution</SelectItem>
                        <SelectItem value="webapp">Web Application</SelectItem>
                        <SelectItem value="security">Security Audit</SelectItem>
                        <SelectItem value="consulting">Strategy Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-primary font-body">Project Details *</label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your vision, goals, timeline, and any specific requirements. What story do you want your digital presence to tell?"
                      rows={6}
                      className="border-border/50 focus:border-accent focus:ring-accent/20 bg-background/50 backdrop-blur-sm resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-xl border border-accent/20">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="mt-1 w-4 h-4 text-accent border-accent/30 rounded focus:ring-accent/20"
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground font-body leading-relaxed">
                      I understand that Gallifrey Consulting follows privacy-by-design principles and will handle my data in compliance with GDPR and CCPA regulations.
                      This information will only be used to provide project proposals and communication.
                    </label>
                  </div>

                  <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 h-12 px-8 font-body font-medium group" size="lg">
                    Send Message & Request Quote
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 shadow-brand-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-primary mb-2">Email</h3>
                    <p className="text-muted-foreground mb-2 font-body">hello@gallifreyconsulting.com</p>
                    <p className="text-xs text-muted-foreground">Secure, encrypted communication</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-brand-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-primary mb-2">Free Consultation</h3>
                    <p className="text-muted-foreground mb-2 font-body">30-minute strategy call</p>
                    <p className="text-xs text-muted-foreground">Discover your digital opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-brand-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-primary mb-2">Response Time</h3>
                    <p className="text-muted-foreground mb-2 font-body">Within 24 hours</p>
                    <p className="text-xs text-muted-foreground">Personal attention, not automated responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl border border-accent/20 shadow-brand">
              <h4 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Our Promise
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-body">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  No jargon-heavy proposals
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  Clear, transparent pricing
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  Privacy-first approach to your data
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  Ongoing partnership mindset
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  Pay only if satisfied flexibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
