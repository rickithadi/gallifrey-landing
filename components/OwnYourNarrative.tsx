import { AlertTriangle, ArrowRight, Crown, Eye, Globe, Home, Lock, Shield, TrendingDown, Unlock, Users, X } from "lucide-react";

import { Button } from "./ui/button";

export function OwnYourNarrative() {
  const platformProblems = [
    {
      icon: <TrendingDown className="w-5 h-5" />,
      problem: "Algorithm Changes",
      description: "Your reach disappears overnight",
      company: "Meta, TikTok"
    },
    {
      icon: <X className="w-5 h-5" />,
      problem: "Account Suspensions",
      description: "Years of work deleted instantly",
      company: "Twitter, Instagram"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      problem: "Hidden from Search",
      description: "Invisible behind platform walls",
      company: "Facebook, LinkedIn"
    },
    {
      icon: <Users className="w-5 h-5" />,
      problem: "Audience Control",
      description: "Can&apos;t reach your own followers",
      company: "All Platforms"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      problem: "Policy Changes",
      description: "Rules change, you lose access",
      company: "YouTube, Twitter"
    }
  ];

  const platformVsOwned = [
    {
      trap: "Rent their space forever",
      freedom: "Own your digital home",
      icon: <Home className="w-6 h-6" />
    },
    {
      trap: "Algorithm controls your reach",
      freedom: "Direct access to your audience",
      icon: <Users className="w-6 h-6" />
    },
    {
      trap: "Invisible to Google search",
      freedom: "Found by customers searching",
      icon: <Eye className="w-6 h-6" />
    },
    {
      trap: "Data harvested and sold",
      freedom: "Your data stays private",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const independenceSteps = [
    {
      number: "01",
      title: "Your Digital Foundation",
      description: "Build a professional website that you own completely",
      icon: <Globe className="w-6 h-6" />
    },
    {
      number: "02",
      title: "Organic Visibility",
      description: "Get found by customers through search, not algorithms",
      icon: <Eye className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Privacy & Protection",
      description: "Keep your data and your audience's trust secure",
      icon: <Lock className="w-6 h-6" />
    }
  ];

  const personalBrandServices = [
    {
      title: "Personal Website",
      description: "A professional website that you own completely, designed to grow your audience and business",
      price: "From $1,500",
      timeline: "2-3 weeks",
      features: [
        "Custom domain & hosting setup",
        "SEO-optimized design",
        "Email list integration",
        "Analytics & insights"
      ],
      process: ["Strategy", "Design", "Launch"]
    },
    {
      title: "Creator Platform",
      description: "Monetize your expertise with secure payment processing and content delivery",
      price: "From $3,500",
      timeline: "4-6 weeks",
      features: [
        "Payment processing",
        "Course & content delivery",
        "Member management",
        "Revenue analytics"
      ],
      process: ["Planning", "Development", "Integration"]
    },
    {
      title: "Portfolio & Blog",
      description: "Showcase your work and share your expertise through professional content",
      price: "From $2,500",
      timeline: "3-4 weeks",
      features: [
        "Portfolio showcase",
        "Blog platform",
        "Contact & lead capture",
        "Social proof integration"
      ],
      process: ["Content Strategy", "Design", "Optimization"]
    }
  ];

  return (
    <section id="own-your-narrative" className="relative overflow-hidden">
      {/* Liberation gradient background */}
      <div className="absolute inset-0 narrative-gradient opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-orange/15 via-background to-gallifrey-teal/10"></div>

      <div className="relative py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Revolutionary header */}
          <div className="text-center mb-24">
            {/* Digital Independence identifier */}
            <div className="inline-flex items-center gap-3 mb-12">
              <Unlock className="w-5 h-5 text-gallifrey-orange" />
              <div className="w-8 h-px bg-gallifrey-orange"></div>
              <p className="text-sm font-medium tracking-wider narrative-text-gradient uppercase font-bold">
                Digital Sovereignty
              </p>
              <div className="w-8 h-px bg-gallifrey-orange"></div>
              <Crown className="w-5 h-5 text-gallifrey-orange" />
            </div>

            {/* Sophisticated headline */}
            <div className="mb-16">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[0.9] mb-8 text-primary">
                Stop Being The Product.
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent"> Own Your Digital Story.</span>
              </h1>
              <p className="text-xl md:text-2xl font-serif bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent leading-relaxed max-w-4xl mx-auto font-semibold">
                We build secure, stunning websites that amplify your voice and protect your audience.
              </p>
            </div>

            {/* Urgency messaging */}
            <div className="border-t border-gallifrey-orange/30 pt-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-gallifrey-orange" />
                <p className="text-lg font-semibold text-gallifrey-orange">
                  The Platform Trap is Real
                </p>
                <AlertTriangle className="w-5 h-5 text-gallifrey-orange" />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Every day, brilliant businesses lose customers to broken links, disappearing posts, and platform changes beyond their control.
              </p>
            </div>
          </div>

          {/* The Platform Trap - Corporate Control */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                The <span className="text-destructive">Platform Trap</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Big Tech companies profit by keeping you dependent. Here&apos;s how they control your business:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {platformProblems.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors border-2 border-destructive/20">
                    <div className="text-destructive">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2 text-primary">
                    {item.problem}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-destructive font-medium">
                    {item.company}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Big Tech vs Independence Comparison */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                <span className="text-destructive">Platform Dependency</span> vs <span className="text-gallifrey-orange">Digital Independence</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Stop renting space in someone else&apos;s digital empire. Build your own kingdom.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {platformVsOwned.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-destructive/5 to-gallifrey-orange/5 border border-gallifrey-orange/20 rounded-lg p-6 h-full hover:shadow-xl transition-all duration-300 narrative-glow">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-12 h-12 bg-gallifrey-orange/10 rounded-full flex items-center justify-center">
                        <div className="text-gallifrey-orange">
                          {item.icon}
                        </div>
                      </div>
                    </div>

                    {/* The Trap */}
                    <div className="mb-4 p-3 bg-destructive/10 rounded border-l-4 border-destructive">
                      <p className="text-sm font-medium text-destructive mb-1">❌ Big Tech Way:</p>
                      <p className="text-sm text-muted-foreground">{item.trap}</p>
                    </div>

                    {/* The Freedom */}
                    <div className="p-3 bg-gallifrey-orange/10 rounded border-l-4 border-gallifrey-orange">
                      <p className="text-sm font-medium text-gallifrey-orange mb-1">✅ Your Website:</p>
                      <p className="text-sm text-primary font-medium">{item.freedom}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Independence Mission */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-gallifrey-orange" />
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                  Your <span className="narrative-text-gradient">Digital Declaration of Independence</span>
                </h3>
                <Crown className="w-6 h-6 text-gallifrey-orange" />
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Stop being a digital tenant. Become a digital sovereign. Here&apos;s how we liberate your brand:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {independenceSteps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-gallifrey-orange/10 to-gallifrey-teal/5 backdrop-blur-sm border border-gallifrey-orange/30 rounded-lg p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-gallifrey-orange/50 narrative-glow">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gallifrey-orange/20 rounded-full flex items-center justify-center">
                        <div className="text-gallifrey-orange">
                          {item.icon}
                        </div>
                      </div>
                      <span className="text-2xl font-serif font-bold text-gallifrey-orange">
                        {item.number}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-bold mb-4 text-primary">
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

          {/* Website Services */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-primary">
                Website <span className="text-gallifrey-orange">Services</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Professional websites designed for creators, entrepreneurs, and businesses who want to own their digital presence.
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

                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-primary mb-3">What&apos;s Included:</h5>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-gallifrey-orange rounded-full flex-shrink-0 mt-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Process steps */}
                    <div className="border-t border-border/50 pt-4">
                      <h5 className="text-sm font-medium text-primary mb-3">Process:</h5>
                      <div className="flex gap-2">
                        {service.process.map((step, stepIndex) => (
                          <div key={stepIndex} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 flex-1 text-center">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liberation Process */}
          <div className="mb-24">
            <div className="border-t border-gallifrey-orange/20 pt-20">
              <div className="mb-12 text-center">
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-primary">
                  Your <span className="text-gallifrey-orange">Liberation Process</span>
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  From platform dependency to digital sovereignty in 4 strategic steps.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gallifrey-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gallifrey-orange/20 transition-colors border-2 border-gallifrey-orange/30">
                    <span className="text-gallifrey-orange font-bold text-lg">01</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2 text-primary">
                    Break Free
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Audit your platform dependencies and plan your digital independence strategy.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gallifrey-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gallifrey-orange/20 transition-colors border-2 border-gallifrey-orange/30">
                    <span className="text-gallifrey-orange font-bold text-lg">02</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2 text-primary">
                    Build Your Kingdom
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Design and develop your sovereign digital territory with full ownership.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gallifrey-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gallifrey-orange/20 transition-colors border-2 border-gallifrey-orange/30">
                    <span className="text-gallifrey-orange font-bold text-lg">03</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2 text-primary">
                    Secure & Fortify
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Implement bulletproof security and SEO to protect and amplify your reach.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gallifrey-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gallifrey-orange/20 transition-colors border-2 border-gallifrey-orange/30">
                    <span className="text-gallifrey-orange font-bold text-lg">04</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2 text-primary">
                    Rule Your Domain
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Launch your independent platform and never worry about algorithm changes again.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Ready to declare your digital independence? The revolution starts with one click.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="px-8 py-3 bg-gallifrey-orange hover:bg-gallifrey-orange/90 text-white font-bold narrative-glow">
                    Start Your Liberation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="px-8 py-3 border-2 border-gallifrey-orange/50 text-gallifrey-orange hover:bg-gallifrey-orange/10 font-medium">
                    See Success Stories
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Professional CTA */}
          <div className="relative">
            <div className="text-center bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-12">
              <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-primary">
                Ready to <span className="text-gallifrey-orange">Own Your Story?</span>
              </h3>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build a website that works for you, not against you. Own your content, own your audience, own your future.
              </p>

              {/* Clean CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="px-8 py-3 bg-gallifrey-orange hover:bg-gallifrey-orange/90 text-white font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3 border border-gallifrey-orange/50 text-gallifrey-orange hover:bg-gallifrey-orange/10">
                  Schedule a Call
                </Button>
              </div>

              {/* Simple trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gallifrey-orange" />
                  Full Ownership
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gallifrey-teal" />
                  SEO Optimized
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gallifrey-orange" />
                  Secure & Fast
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
