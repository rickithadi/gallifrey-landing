import { ArrowRight, Globe, Palette, Sparkles, Zap } from "lucide-react";

import { Button } from "./ui/button";
import { useState } from "react";

export function OwnYourNarrative() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ email, name, projectType, budget, message });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-oyn-stone-100 via-oyn-stone-50 to-oyn-stone-50">
        <div className="absolute inset-0 bg-gradient-to-br from-oyn-stone-100/30 via-transparent to-oyn-orange-100/10"></div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-oyn-orange-100/50 backdrop-blur-sm rounded-full border border-oyn-orange-200">
              <Sparkles className="w-4 h-4 text-oyn-orange-600" />
              <span className="text-sm font-medium text-oyn-stone-700">FOR AMBITIOUS ENTREPRENEURS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-light leading-tight mb-6 text-oyn-stone-800">
              For ambitious entrepreneurs who refuse to let{" "}
              <span className="text-oyn-orange-600 font-medium">social platforms</span>{" "}
              control their story
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-oyn-stone-600 mb-12 max-w-3xl mx-auto leading-relaxed font-body">
              Your expertise deserves a home you own. We help thoughtful business owners create sophisticated digital presences that reflect their true authority—without the noise of social media.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-oyn-stone-300 text-oyn-stone-700 hover:bg-oyn-stone-100 rounded-lg transition-all duration-300"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Digital Independence Matters */}
      <section className="py-20 bg-oyn-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 text-oyn-stone-800">
                Why Digital Independence Matters
              </h2>
              <p className="text-lg text-oyn-stone-600 leading-relaxed">
                When you build on someone else&apos;s platform, you&apos;re building their business, not yours.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-heading font-medium mb-6 text-oyn-stone-800">The Platform Reality:</h3>
                <div className="bg-oyn-stone-100 p-6 rounded-lg border-l-4 border-oyn-orange-600 mb-6">
                  <div className="space-y-4 text-oyn-stone-600">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">•</span>
                      <span>Algorithm changes can eliminate your reach overnight</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">•</span>
                      <span>Platform rules change without your input or consent</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">•</span>
                      <span>Your content and audience can disappear instantly</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">•</span>
                      <span>You&apos;re competing for attention in an endless feed</span>
                    </div>
                  </div>
                </div>
                <p className="text-oyn-stone-600 mb-6 leading-relaxed">
                  We&apos;re not here to criticize social media—it has its place. But your business deserves a foundation you control.
                </p>
                <Button className="bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300">
                  Learn About Our Approach
                </Button>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-medium mb-6 text-oyn-stone-800">What Ownership Looks Like:</h3>
                <div className="space-y-4">
                  <div className="bg-oyn-orange-50 p-5 rounded-lg border-l-4 border-oyn-orange-600">
                    <div className="flex items-start gap-3">
                      <span className="text-oyn-orange-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-oyn-orange-600 mb-1">Your Domain, Your Rules</h4>
                        <p className="text-sm text-oyn-stone-600">Complete control over your content, design, and user experience</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-oyn-orange-50 p-5 rounded-lg border-l-4 border-oyn-orange-600">
                    <div className="flex items-start gap-3">
                      <span className="text-oyn-orange-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-oyn-orange-600 mb-1">Direct Relationships</h4>
                        <p className="text-sm text-oyn-stone-600">Build genuine connections without algorithmic interference</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-oyn-orange-50 p-5 rounded-lg border-l-4 border-oyn-orange-600">
                    <div className="flex items-start gap-3">
                      <span className="text-oyn-orange-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-oyn-orange-600 mb-1">Long-term Value</h4>
                        <p className="text-sm text-oyn-stone-600">Every visitor and subscriber builds your business, not someone else&apos;s</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-oyn-orange-50 p-5 rounded-lg border-l-4 border-oyn-orange-600">
                    <div className="flex items-start gap-3">
                      <span className="text-oyn-orange-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-oyn-orange-600 mb-1">Professional Credibility</h4>
                        <p className="text-sm text-oyn-stone-600">A sophisticated presence that commands respect and premium pricing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden Cost Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 text-oyn-stone-800">
                The Hidden Cost of Poor Search Results
              </h2>
              <p className="text-lg text-oyn-stone-600">
                Every day, opportunities slip away because your digital presence doesn&apos;t reflect your true expertise
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Lost Client Opportunities</h3>
                <p className="text-oyn-stone-600 text-sm">Premium clients choose competitors who &ldquo;look more established&rdquo; in search results</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Missed Partnerships</h3>
                <p className="text-oyn-stone-600 text-sm">Strategic partners can&apos;t find evidence of your expertise when they research you</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Undervalued Pricing</h3>
                <p className="text-oyn-stone-600 text-sm">Can&apos;t command premium rates when search results don&apos;t establish authority</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Speaking Opportunities</h3>
                <p className="text-oyn-stone-600 text-sm">Event organizers pass you over for speakers with stronger digital presence</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-oyn-stone-200 text-center shadow-sm">
              <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">The Reality Check:</h3>
              <p className="text-oyn-stone-600 mb-6 text-lg">
                <strong>You don&apos;t own your digital presence—the platforms do.</strong><br />
                Google, LinkedIn, and social media algorithms decide how you appear to the world.
              </p>
              <div className="bg-oyn-stone-50 p-6 rounded-lg border-l-4 border-oyn-orange-600 max-w-2xl mx-auto">
                <p className="text-oyn-stone-800 font-semibold mb-2 italic">
                  &ldquo;I had no idea how unprofessional my search results looked until a potential investor mentioned they almost didn&apos;t take the meeting.&rdquo;
                </p>
                <p className="text-oyn-stone-600 text-sm">— Tech Entrepreneur, now Personal Brand Empire client</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-oyn-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-6 text-oyn-stone-800">
              Our Mission: Digital Independence
            </h2>
            <p className="text-lg text-oyn-stone-600 leading-relaxed">
              We believe your brand deserves a home it owns, not a rented room on someone else&apos;s platform.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-oyn-stone-100 to-oyn-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 text-oyn-stone-800">
                Professional Website Services
              </h2>
              <p className="text-lg text-oyn-stone-600 leading-relaxed">
                Thoughtfully designed websites for entrepreneurs who value quality, ownership, and authentic connection with their audience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Personal Website Card */}
              <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-oyn-stone-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-oyn-orange-50 rounded-lg mb-4">
                    <Globe className="w-8 h-8 text-oyn-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-oyn-orange-600 uppercase tracking-wider">From $500</span>
                </div>

                <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">Personal Website</h3>
                <p className="text-oyn-stone-600 mb-6 leading-relaxed">
                  Essential digital presence for consultants and freelancers. A sophisticated foundation that establishes credibility and begins building your owned audience.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Custom design reflecting your professional brand</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Mobile-responsive and fast-loading</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Professional hosting and domain setup</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Complete ownership and source code access</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-oyn-orange-300 text-oyn-orange-600 hover:bg-oyn-orange-50 rounded-lg">
                  Get Started
                </Button>
              </div>

              {/* Custom Platform Card */}
              <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-oyn-orange-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-oyn-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-oyn-orange-50 rounded-lg mb-4">
                    <Zap className="w-8 h-8 text-oyn-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-oyn-orange-600 uppercase tracking-wider">From $2,500</span>
                </div>

                <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">Custom Platform</h3>
                <p className="text-oyn-stone-600 mb-6 leading-relaxed">
                  Tailored business solutions with custom functionality designed for your specific workflow, plus strategic positioning that ensures you appear first when clients seek your expertise.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Everything in Personal Website</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Bespoke functionality development</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Strategic search engine positioning</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Integration with existing business tools</span>
                  </div>
                </div>

                <Button className="w-full bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white rounded-lg">
                  Start Your Project
                </Button>
              </div>

              {/* Portfolio & Blog Card */}
              <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-oyn-stone-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-oyn-orange-50 rounded-lg mb-4">
                    <Palette className="w-8 h-8 text-oyn-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-oyn-orange-600 uppercase tracking-wider">From $5,000</span>
                </div>

                <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">Authority Platform</h3>
                <p className="text-oyn-stone-600 mb-6 leading-relaxed">
                  Showcase exceptional work and establish thought leadership through sophisticated content presentation and strategic positioning as the definitive expert in your field.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Sophisticated portfolio presentation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Authority-building content strategy</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Advanced search engine positioning</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-oyn-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-oyn-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-oyn-stone-600">Thought leadership publishing platform</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-oyn-orange-300 text-oyn-orange-600 hover:bg-oyn-orange-50 rounded-lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 text-oyn-stone-800">
                How We Create Something Meaningful Together
              </h2>
              <p className="text-lg text-oyn-stone-600 leading-relaxed">
                A thoughtful process designed for discerning entrepreneurs who value both efficiency and excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-oyn-orange-50 rounded-lg mb-4">
                  <span className="text-2xl font-heading font-medium text-oyn-orange-600">01</span>
                </div>
                <h3 className="text-lg font-heading font-medium mb-2 text-oyn-stone-800">Discovery & Vision</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed">
                  We begin with meaningful conversation about your business goals and the digital experience you envision. No lengthy questionnaires—just strategic dialogue.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-oyn-orange-50 rounded-lg mb-4">
                  <span className="text-2xl font-heading font-medium text-oyn-orange-600">02</span>
                </div>
                <h3 className="text-lg font-heading font-medium mb-2 text-oyn-stone-800">Rapid Development</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed">
                  Launch quickly with core functionality, then evolve thoughtfully as your business develops. You&apos;re not locked into version 1.0.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-lg mb-4">
                  <span className="text-2xl font-heading font-medium text-amber-600">03</span>
                </div>
                <h3 className="text-lg font-heading font-medium mb-2 text-oyn-stone-800">Complete Customization</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed">
                  When you&apos;re ready for something entirely bespoke—functionality that gives you competitive advantages and positions you as the premium choice.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-oyn-stone-100 rounded-lg mb-4">
                  <span className="text-2xl font-heading font-medium text-oyn-stone-600">04</span>
                </div>
                <h3 className="text-lg font-heading font-medium mb-2 text-oyn-stone-800">Ongoing Partnership</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed">
                  Your success is our success. We provide ongoing support and strategic guidance as your business grows and evolves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Form */}
      <section id="contact" className="py-20 bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 text-oyn-stone-800">
                Ready to Own Your Digital Future?
              </h2>
              <p className="text-lg text-oyn-stone-600 leading-relaxed">
                Let&apos;s discuss how a sophisticated digital presence can elevate your business positioning and client relationships.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm border border-oyn-stone-200">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-oyn-stone-600 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-oyn-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oyn-orange-600 focus:border-transparent bg-white"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-oyn-stone-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-oyn-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oyn-orange-600 focus:border-transparent bg-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-oyn-stone-600 mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 border border-oyn-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oyn-orange-600 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">What are you looking for?</option>
                      <option value="personal">Personal Website ($500+)</option>
                      <option value="custom">Custom Platform ($2,500+)</option>
                      <option value="authority">Authority Platform ($5,000+)</option>
                      <option value="consultation">Just exploring options</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-oyn-stone-600 mb-2">
                      Timeline
                    </label>
                    <select
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 border border-oyn-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oyn-orange-600 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">When do you need this?</option>
                      <option value="asap">As soon as possible</option>
                      <option value="month">Within a month</option>
                      <option value="quarter">Next 2-3 months</option>
                      <option value="exploring">Just exploring for now</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-oyn-stone-600 mb-2">
                    Tell Us About Your Vision
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-oyn-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oyn-orange-600 focus:border-transparent bg-white"
                    placeholder="Share your business goals, what you&apos;d like your website to accomplish, and any specific ideas you have in mind..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-sm text-oyn-stone-600">
                    Typically, we respond within 24 hours with initial thoughts and next steps.
                  </p>
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white rounded-lg transition-all duration-300"
                  >
                    Begin the Conversation
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-6 text-oyn-stone-800">
              Get In Touch
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-oyn-stone-100 rounded-lg p-6">
                <h3 className="text-lg font-heading font-medium mb-2 text-oyn-stone-800">Email</h3>
                <p className="text-oyn-stone-600">hello@gallifrey.consulting</p>
              </div>
              <div className="bg-oyn-stone-100 rounded-lg p-6">
                <h3 className="text-lg font-heading font-medium mb-2 text-oyn-stone-800">Response Time</h3>
                <p className="text-oyn-stone-600">We&apos;ll get back to you within 24 hours</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-oyn-stone-600 leading-relaxed">
                <em>Building digital independence for discerning entrepreneurs</em>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
