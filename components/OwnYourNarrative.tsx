import { ArrowRight, CheckCircle, Globe, Home, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function OwnYourNarrative() {
  const features = [
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, text: "Bespoke, brand-aligned design" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, text: "Mobile-first, SEO-optimized layout" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, text: "HTTPS, SSL, and core security features" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, text: "Privacy-compliant contact forms" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, text: "Social integration without ownership loss" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, text: "Fast, reliable hosting & maintenance" }
  ];

  const workflowSteps = [
    { number: "01", title: "Free 30min Site Kickoff Call", description: "Discover your vision and goals" },
    { number: "02", title: "Scoped Proposal & Design Mock", description: "Privacy plan and visual direction" },
    { number: "03", title: "Development & Launch", description: "Go live in 1-2 weeks for small builds" },
    { number: "04", title: "Scale & Expand", description: "Add payments, CMS, integrations as needed" }
  ];

  return (
    <section id="narrative" className="py-24 px-4 bg-gradient-to-br from-background via-gallifrey-gray/10 to-accent/5">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div>
              <Badge className="mb-8 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors duration-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Personal Sites & Digital Identity
              </Badge>

              <h2 className="text-4xl md:text-6xl mb-8">
                <span className="font-heading text-primary">Own Your</span>{" "}
                <span className="font-serif bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent italic">Narrative</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm border border-accent/20 rounded-2xl p-6">
                <p className="text-xl text-muted-foreground font-body leading-relaxed">
                  <strong className="text-primary font-semibold">A personal site is your digital home.</strong> It&apos;s the antidote to &quot;renting&quot; your voice on social platforms.
                  Why let Instagram or LinkedIn own your story when you can control your narrative?
                </p>
              </div>

              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                From microsite to masterpiece — start lean with a personal brand presence, then layer on
                subscriptions, payments, and custom logic as you grow. Your digital fortress begins with your story.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/50 transition-colors duration-300">
                  {feature.icon}
                  <span className="text-muted-foreground font-body">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 group">
                Build My Digital Home
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-brand hover:shadow-brand-lg transition-all duration-300">
                View Personal Site Examples
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

            <Card className="relative bg-gradient-to-br from-card/80 to-accent/5 border-accent/20 shadow-brand-xl backdrop-blur-sm overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center shadow-brand">
                    <Home className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-2xl text-primary">Your Digital TARDIS</CardTitle>
                    <p className="text-accent font-medium font-body">Secure, custom, ready to regenerate</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 relative z-10">
                {/* Feature icons */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="group flex flex-col items-center gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-brand transition-all duration-300">
                    <Globe className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm text-center font-medium">Your Domain</span>
                  </div>
                  <div className="group flex flex-col items-center gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-brand transition-all duration-300">
                    <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm text-center font-medium">Privacy First</span>
                  </div>
                  <div className="group flex flex-col items-center gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-brand transition-all duration-300">
                    <Zap className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm text-center font-medium">Fast & Secure</span>
                  </div>
                </div>

                {/* Workflow */}
                <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                  <h4 className="font-heading font-semibold text-lg mb-6 text-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Quick-Start Workflow
                  </h4>
                  <div className="space-y-4">
                    {workflowSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {step.number}
                        </div>
                        <div>
                          <p className="font-medium text-primary">{step.title}</p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing badge */}
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-accent/20 to-primary/20 text-primary border-accent/30 px-4 py-2">
                    <Users className="w-3 h-3 mr-1" />
                    Starting at $500 • Enterprise-grade security • Boutique care
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
