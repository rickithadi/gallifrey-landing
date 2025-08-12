import { ArrowRight, Edit3, Eye, Globe, Heart, Lock, Shield, Users, Zap } from "lucide-react";

import { Button } from "./ui/button";

export function OwnYourNarrative() {
  const narrativeProblems = [
    {
      icon: <Edit3 className="w-5 h-5" />,
      problem: "Broken links",
      description: "and disappearing posts"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      problem: "Algorithm changes",
      description: "beyond your control"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      problem: "Platform rule changes",
      description: "that destroy years of work"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      problem: "Poor SEO",
      description: "hiding behind social walls"
    },
    {
      icon: <Users className="w-5 h-5" />,
      problem: "Zero ownership",
      description: "of your audience and content"
    }
  ];

  const digitalIndependence = [
    {
      number: "01",
      title: "Your Story, Your Space",
      description: "Stop paying rent to platforms that change the rules overnight",
      icon: <Globe className="w-6 h-6" />
    },
    {
      number: "02",
      title: "Found, Not Hidden",
      description: "Websites that Google loves and customers can actually discover",
      icon: <Eye className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Protected, Not Exposed",
      description: "Your data and your customers&apos; trust, safeguarded without compromise",
      icon: <Lock className="w-6 h-6" />
    }
  ];

  const personalBrandServices = [
    {
      title: "Personal Brand Liberation",
      description: "Break free from social media dependency with a website that truly represents you",
      price: "From $1,500",
      timeline: "2-3 weeks",
      successMetric: "90% reduction in platform dependency",
      features: [
        "Custom domain ownership & hosting setup",
        "SEO-optimized content architecture",
        "Direct audience connection tools",
        "Email list integration & automation",
        "Social media backup & migration",
        "Analytics & performance tracking"
      ],
      process: ["Discovery & Brand Audit", "Content Strategy", "Design & Development", "Launch & Training"]
    },
    {
      title: "Creator Economy Platform",
      description: "Monetize your expertise with secure payment integration and subscriber management",
      price: "From $3,500",
      timeline: "4-6 weeks",
      successMetric: "3x increase in direct revenue",
      features: [
        "Subscription billing & payment processing",
        "Course delivery & content protection",
        "Community features & member portals",
        "Analytics dashboard & revenue tracking",
        "Automated email sequences",
        "Mobile-responsive learning platform"
      ],
      process: ["Revenue Strategy", "Platform Architecture", "Payment Integration", "Content Migration"]
    },
    {
      title: "Digital Storytelling Hub",
      description: "Showcase your work, share your story, and build authentic connections",
      price: "From $2,500",
      timeline: "3-4 weeks",
      successMetric: "5x increase in direct inquiries",
      features: [
        "Portfolio showcase with case studies",
        "Blog platform with SEO optimization",
        "Contact integration & lead capture",
        "Social proof display & testimonials",
        "Media kit & press resources",
        "Speaking engagement booking system"
      ],
      process: ["Story Architecture", "Visual Design", "Content Creation", "SEO Optimization"]
    }
  ];

  return (
    <section id="own-your-narrative" className="relative overflow-hidden">
      {/* Distinct visual identity with warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-orange/5 via-background to-gallifrey-teal/5"></div>

      <div className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Campaign header with distinct styling */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gallifrey-orange"></div>
                <p className="text-sm font-medium tracking-wider text-gallifrey-orange uppercase">
                  Own Your Narrative Campaign
                </p>
                <div className="w-8 h-px bg-gallifrey-orange"></div>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-[0.9] mb-8">
              Your story is too important
              <br />
              <span className="italic text-gallifrey-orange">to be buried in someone else&apos;s algorithm</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              Every day, brilliant businesses lose customers to broken links, disappearing posts, and platform changes beyond their control.
            </p>
          </div>

          {/* The Platform Problem - Visual grid */}
          <div className="mb-24">
            <h3 className="text-2xl md:text-3xl font-serif font-medium text-center mb-12 text-primary">
              Every day, brilliant businesses lose customers to:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {narrativeProblems.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors">
                    <div className="text-destructive">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-medium mb-2 text-primary">
                    {item.problem}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Independence Mission */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-primary">
                Our Mission: <span className="text-gallifrey-orange">Digital Independence</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We believe your brand deserves a home it owns, not a rented room on someone else's platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {digitalIndependence.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-background/80 backdrop-blur-sm border border-gallifrey-orange/20 rounded-lg p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-gallifrey-orange/40">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gallifrey-orange/10 rounded-full flex items-center justify-center">
                        <div className="text-gallifrey-orange">
                          {item.icon}
                        </div>
                      </div>
                      <span className="text-2xl font-serif font-medium text-gallifrey-orange">
                        {item.number}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-medium mb-4 text-primary">
                      {item.title}
                    </h4>

                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Brand Services */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-primary">
                Personal Brand <span className="text-gallifrey-orange">Liberation Services</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Specialized offerings for creators, entrepreneurs, and personal brands ready to own their digital narrative.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {personalBrandServices.map((service, index) => (
                <div key={index} className="group">
                  <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300 hover:border-gallifrey-orange/30">
                    {/* Header with pricing and timeline */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-3 h-3 bg-gallifrey-orange rounded-full"></div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gallifrey-orange">{service.price}</div>
                          <div className="text-xs text-muted-foreground">{service.timeline}</div>
                        </div>
                      </div>

                      <h4 className="font-serif text-xl font-medium mb-3 text-primary group-hover:text-gallifrey-orange transition-colors">
                        {service.title}
                      </h4>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Success metric */}
                      <div className="bg-gallifrey-orange/5 border border-gallifrey-orange/20 rounded-lg p-3 mb-4">
                        <div className="text-xs font-medium text-gallifrey-orange uppercase tracking-wider mb-1">
                          Success Metric
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {service.successMetric}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-primary mb-3">What's Included:</h5>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Heart className="w-3 h-3 text-gallifrey-orange flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Process steps */}
                    <div className="border-t border-border/50 pt-4">
                      <h5 className="text-sm font-medium text-primary mb-3">Our Process:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {service.process.map((step, stepIndex) => (
                          <div key={stepIndex} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                            {stepIndex + 1}. {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empowerment CTA */}
          <div className="text-center bg-gradient-to-r from-gallifrey-orange/10 via-gallifrey-teal/10 to-gallifrey-orange/10 rounded-2xl p-12">
            <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-primary">
              Ready to <span className="text-gallifrey-orange">Own Your Narrative?</span>
            </h3>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop letting social platforms control your story. Build digital real estate you own completely.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-3 bg-gallifrey-orange hover:bg-gallifrey-orange/90 text-white">
                Start Your Liberation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 border-gallifrey-orange/30 text-gallifrey-orange hover:bg-gallifrey-orange/10">
                Free Strategy Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
