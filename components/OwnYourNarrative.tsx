import { ArrowRight, CheckCircle, Crown, Eye, Globe, Home, Lock, Shield, Star, TrendingUp, Users, X, Zap } from "lucide-react";

import { Button } from "./ui/button";

export function OwnYourNarrative() {
  const ownershipAdvantages = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Complete Control",
      description: "Your website, your rules. No algorithm changes or policy updates affecting your business.",
      benefit: "Predictable, stable digital presence"
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Professional Credibility",
      description: "Custom domains and professional design signal quality and trustworthiness to clients.",
      benefit: "Higher conversion rates and premium pricing"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Direct Relationships",
      description: "Build genuine connections with your audience without platform intermediaries.",
      benefit: "Higher lifetime customer value"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Ownership",
      description: "Your customer data, analytics, and insights belong to you, not a platform.",
      benefit: "Better business decisions and privacy"
    }
  ];

  const servicePillars = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Professional Website",
      subtitle: "Custom Development That You Own",
      description: "Your own professional website with custom domain, hosting, and complete ownership. No monthly platform fees, no algorithm changes affecting your business.",
      features: [
        "Custom domain and professional hosting",
        "Mobile-responsive design",
        "SEO optimization included",
        "Complete source code ownership"
      ],
      pricing: "From $500",
      highlight: "Low Barrier to Entry"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Business Growth",
      subtitle: "Advanced Custom Development",
      description: "Sophisticated web applications with custom functionality, e-commerce, and advanced features that grow with your business needs.",
      features: [
        "Custom web applications",
        "E-commerce integration",
        "Advanced functionality",
        "Scalable architecture"
      ],
      pricing: "From $2,500",
      highlight: "Professional Growth"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Digital Privacy",
      subtitle: "Data Protection & Security",
      description: "Protect your family's digital footprint with data broker removal and privacy-first website architecture that keeps your information secure.",
      features: [
        "Data broker removal service",
        "Privacy-first website design",
        "Secure hosting and SSL",
        "GDPR compliance setup"
      ],
      pricing: "From $1,200",
      highlight: "Complete Privacy Protection"
    }
  ];

  const testimonials = [
    {
      category: "Small Business Owner",
      name: "Sarah Chen",
      business: "Chen Family Bakery",
      quote: "Our custom website increased local orders by 340% in 6 months. The pixel-perfect design makes us look like a premium brand.",
      metric: "340% increase in local orders",
      avatar: "SC"
    },
    {
      category: "Privacy-Conscious Parent",
      name: "Michael Rodriguez",
      location: "Melbourne, VIC",
      quote: "They removed our family's data from 47 data brokers and built us a secure family website. Finally, we own our digital story.",
      metric: "47 data brokers cleaned",
      avatar: "MR"
    },
    {
      category: "Content Creator",
      name: "Emma Thompson",
      platform: "Former Instagram Influencer",
      quote: "After losing 50K followers to algorithm changes, I built my own platform. Now I reach more people than ever before.",
      metric: "Platform independence achieved",
      avatar: "ET"
    },
    {
      category: "Local Professional",
      name: "Dr. James Wilson",
      business: "Wilson Dental Practice",
      quote: "The custom design and SEO work brought us 200+ new patients. Every detail was crafted to perfection.",
      metric: "200+ new patients acquired",
      avatar: "JW"
    }
  ];

  const trustMetrics = [
    { number: "47", label: "Data Brokers Removed", icon: <Shield className="w-5 h-5" /> },
    { number: "$2.3M", label: "Revenue Generated for Clients", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "99.9%", label: "Website Uptime Guarantee", icon: <Zap className="w-5 h-5" /> },
    { number: "100%", label: "Client Satisfaction Rate", icon: <Star className="w-5 h-5" /> }
  ];

  const developmentProcess = [
    {
      number: "01",
      title: "Discovery & Strategy",
      description: "We understand your business goals and create a custom development plan that fits your budget and timeline.",
      icon: <Eye className="w-6 h-6" />
    },
    {
      number: "02",
      title: "Design & Development",
      description: "Professional website development with modern design, mobile responsiveness, and SEO optimization built-in.",
      icon: <Home className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Launch & Ownership",
      description: "Deploy your website with your own domain and hosting. You receive all source code and complete ownership.",
      icon: <Crown className="w-6 h-6" />
    },
    {
      number: "04",
      title: "Growth & Support",
      description: "Ongoing support and enhancement options to grow your digital presence as your business expands.",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <section id="own-your-narrative" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Apple-inspired clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-teal-500/5"></div>

      <div className="relative">
        {/* Hero Section - Apple Style */}
        <div className="py-32 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            {/* Clean identifier */}
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
              <p className="text-sm font-medium tracking-wider text-slate-600 uppercase">
                Digital Sovereignty
              </p>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
            </div>

            {/* Apple-style headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-8 text-slate-900">
              Stop Being
              <br />
              <span className="font-semibold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                The Product
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-light text-slate-600 leading-relaxed max-w-4xl mx-auto mb-12">
              Professional websites and digital presence that you own completely. Starting at just $500.
              <br />
              <span className="font-medium text-slate-900">Custom-crafted. Obsessively detailed. Completely yours.</span>
            </p>

            {/* Clean CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button size="lg" className="px-12 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-12 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-full">
                View Our Work
              </Button>
            </div>

            {/* Trust metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {trustMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="text-blue-600">
                      {metric.icon}
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                    {metric.number}
                  </div>
                  <div className="text-sm text-slate-600">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Advantages - Clean Layout */}
        <div className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                The Professional Advantage of
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"> Ownership</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                When you own your digital presence, you gain control, credibility, and competitive advantages that platforms simply can't provide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ownershipAdvantages.map((advantage, index) => (
                <div key={index} className="group">
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 h-full hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                      <div className="text-blue-600">
                        {advantage.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {advantage.title}
                    </h3>

                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {advantage.description}
                    </p>

                    <p className="text-sm font-medium text-green-600">
                      ✓ {advantage.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Pillars - Apple-inspired Cards */}
        <div className="py-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                Your Path to
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"> Digital Independence</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Three pillars of digital sovereignty, each crafted with obsessive attention to pixel-perfect detail.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {servicePillars.map((pillar, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 h-full hover:shadow-2xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-1">
                    {/* Header */}
                    <div className="mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white">
                          {pillar.icon}
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                          {pillar.highlight}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {pillar.title}
                      </h3>

                      <h4 className="text-lg font-medium text-slate-600 mb-4">
                        {pillar.subtitle}
                      </h4>

                      <p className="text-slate-600 leading-relaxed mb-6">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <ul className="space-y-3">
                        {pillar.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-900">
                          {pillar.pricing}
                        </span>
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials - Clean Grid */}
        <div className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                Real Results from
                <span className="font-semibold text-slate-900"> Real People</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Families and businesses who chose digital independence over platform dependency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 h-full hover:shadow-lg hover:bg-white transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {testimonial.business || testimonial.location || testimonial.platform}
                        </div>
                        <div className="text-xs text-blue-600 font-medium uppercase tracking-wider mt-1">
                          {testimonial.category}
                        </div>
                      </div>
                    </div>

                    <blockquote className="text-slate-700 leading-relaxed mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="text-sm font-semibold text-green-600">
                      ✓ {testimonial.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development Process - Clean Steps */}
        <div className="py-24 px-4 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                Our
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"> Development Process</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Professional website development in four strategic steps, designed to fit your budget and timeline.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {developmentProcess.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-blue-200 transition-colors">
                      <div className="text-blue-600">
                        {step.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA - Apple-inspired */}
        <div className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                Ready to
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"> Own Your Story?</span>
              </h2>

              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Build a pixel-perfect website that works for you, not against you.
                Own your content, own your audience, own your future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="px-12 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Book Your Digital Independence Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="px-12 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-full">
                  View Portfolio
                </Button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Full Ownership Guaranteed
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-500" />
                  Pixel-Perfect Design
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Military-Grade Security
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
