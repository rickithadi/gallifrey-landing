import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, MessageCircle, Clock, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6 text-primary">
            Ready to Build Your Digital Fortress?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Let's craft your secure, strategic digital presence. Get in touch for a free 30-minute consultation 
            and discover how we can fortify your business online.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-accent">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade security • Boutique-level care • Personal relationships</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Start Your Digital Transformation</CardTitle>
                <p className="text-muted-foreground">
                  Tell us about your vision and we'll craft a bespoke proposal within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm mb-2 text-primary">Name *</label>
                      <Input id="name" placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm mb-2 text-primary">Email *</label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm mb-2 text-primary">Company/Organization</label>
                      <Input id="company" placeholder="Your company name" />
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm mb-2 text-primary">Project Budget</label>
                      <Select>
                        <SelectTrigger>
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
                  
                  <div>
                    <label htmlFor="project" className="block text-sm mb-2 text-primary">Project Type</label>
                    <Select>
                      <SelectTrigger>
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
                  
                  <div>
                    <label htmlFor="message" className="block text-sm mb-2 text-primary">Project Details *</label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your vision, goals, timeline, and any specific requirements. What story do you want your digital presence to tell?"
                      rows={5} 
                    />
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="privacy" className="mt-1" />
                    <label htmlFor="privacy" className="text-xs text-muted-foreground">
                      I understand that Gallifrey Consulting follows privacy-by-design principles and will handle my data in compliance with GDPR and CCPA regulations. 
                      This information will only be used to provide project proposals and communication.
                    </label>
                  </div>
                  
                  <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                    Send Message & Request Quote
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground mb-2">hello@gallifreyconsulting.com</p>
                    <p className="text-xs text-muted-foreground">Secure, encrypted communication</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-8 h-8 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Free Consultation</h3>
                    <p className="text-sm text-muted-foreground mb-2">30-minute strategy call</p>
                    <p className="text-xs text-muted-foreground">Discover your digital opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Response Time</h3>
                    <p className="text-sm text-muted-foreground mb-2">Within 24 hours</p>
                    <p className="text-xs text-muted-foreground">Personal attention, not automated responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg border border-accent/10">
              <h4 className="font-semibold text-primary mb-3">Our Promise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• No jargon-heavy proposals</li>
                <li>• Clear, transparent pricing</li>
                <li>• Privacy-first approach to your data</li>
                <li>• Ongoing partnership mindset</li>
                <li>• Pay only if satisfied flexibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}