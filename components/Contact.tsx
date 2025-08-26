import { AlertCircle, ArrowRight, Calendar, CheckCircle, Clock, Mail, MessageCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "@formspree/react";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { useState } from "react";

export function Contact() {
  const headerAnimation = useScrollAnimation<HTMLElement>();
  const formAnimation = useScrollAnimation<HTMLDivElement>();
  const sidebarAnimation = useScrollAnimation<HTMLDivElement>();

  const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_ID || 'mgvzdpqo');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    project: "",
    message: "",
    privacy: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.privacy) {
      return;
    }
    await handleSubmit(e);
    if (state.succeeded) {
      setFormData({
        name: "",
        email: "",
        company: "",
        budget: "",
        project: "",
        message: "",
        privacy: false
      });
    }
  };

  if (state.succeeded) {
    return (
      <section id="contact" className="py-24 px-4" aria-labelledby="contact-heading">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-medium text-primary mb-4">
              Thank you for your message!
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We&apos;ve received your inquiry and will get back to you within 24 hours.
              In the meantime, feel free to schedule a direct consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="px-6"
              >
                Send Another Message
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6"
                asChild
              >
                <a href="https://calendly.com/rickithadi/30min" target="_blank" rel="noopener noreferrer">
                  Schedule a Call
                  <Calendar className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 px-4" aria-labelledby="contact-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <header
          ref={headerAnimation.ref}
          className={`mb-20 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Get in Touch
            </p>
            <div className="w-12 h-px bg-accent" role="presentation"></div>
          </div>

          <h2 id="contact-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-6 text-primary max-w-4xl">
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
          <div
            ref={formAnimation.ref}
            className={`lg:col-span-2 animate-fade-up animate-delay-200 ${formAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="bg-background border border-border/50 rounded-lg p-8">
              {state.errors && Object.keys(state.errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">There was an error sending your message</p>
                    <p className="text-sm text-red-600">Please try again or contact us directly at hello@gallifreyconsulting.com</p>
                  </div>
                </div>
              )}
              <form onSubmit={onSubmit} className="space-y-6" aria-label="Contact form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-primary">Name *</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      className="h-11 border-border/50 focus:border-accent focus:ring-accent/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-primary">Email *</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className="h-11 border-border/50 focus:border-accent focus:ring-accent/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-primary">Company</label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Your company name"
                      className="h-11 border-border/50 focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="budget" className="block text-sm font-medium text-primary">Budget Range</label>
                    <Select name="budget" value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger className="h-11 border-border/50 focus:border-accent focus:ring-accent/20">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="foundation">Foundation Package</SelectItem>
                        <SelectItem value="professional">Professional Package</SelectItem>
                        <SelectItem value="enterprise">Enterprise Package</SelectItem>
                        <SelectItem value="unsure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="project" className="block text-sm font-medium text-primary">Project Type</label>
                  <Select name="project" value={formData.project} onValueChange={(value) => handleInputChange("project", value)}>
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
                    name="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                    rows={6}
                    className="border-border/50 focus:border-accent focus:ring-accent/20 resize-none"
                    required
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={(e) => handleInputChange("privacy", e.target.checked)}
                    className="mt-1 w-4 h-4 text-accent border-border rounded focus:ring-accent/20"
                    required
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the privacy policy and understand that my information will be handled securely
                    and used only for project communication. *
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="gallifrey"
                  disabled={state.submitting || !formData.privacy}
                  className="px-8 py-4 text-base min-h-[48px] group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact info */}
          <div
            ref={sidebarAnimation.ref}
            className={`space-y-8 animate-fade-up animate-delay-400 ${sidebarAnimation.isVisible ? 'visible' : ''}`}
          >
            {/* Schedule Call CTA */}
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-serif text-lg font-medium text-primary mb-2">
                  Skip the form?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a 30-minute consultation directly
                </p>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                asChild
              >
                <a href="https://calendly.com/rickithadi/30min" target="_blank" rel="noopener noreferrer">
                  Schedule a Call
                  <Calendar className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

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
