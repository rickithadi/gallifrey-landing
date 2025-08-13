import { ArrowRight, Briefcase, Code, Globe, Palette, Shield, Sparkles, Users, Zap } from "lucide-react";

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
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-orange-50/20"></div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-orange-100/60 backdrop-blur-sm rounded-full border border-orange-200/50">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">DIGITAL PRESENCE AUDIT</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal leading-tight mb-6 text-gray-900">
              What do people find when they{" "}
              <span className="text-orange-600 font-medium">Google your name</span>?
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              In 30 seconds, potential clients, investors, and partners will judge your expertise based on what appears in search results. Are you confident in what they'll discover?
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Audit My Digital Presence
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                Free Brand Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The 30-Second Test Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900">
                The 30-Second Test That Determines Your Success
              </h2>
              <p className="text-lg text-gray-600">
                Before anyone becomes your client, investor, or partner, they Google you. What story are your search results telling?
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Try This Right Now:</h3>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-orange-500 mb-6">
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                      <span>Open an incognito browser window</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                      <span>Google your full name + your industry</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                      <span>Look at the first page of results</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                      <span>Ask yourself: "Would I hire this person?"</span>
                    </li>
                  </ol>
                </div>
                <p className="text-gray-600 mb-6">
                  <strong>Be honest:</strong> Do you look like the obvious expert choice, or just another option among many?
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                  Fix My Search Results
                </Button>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">What Most Entrepreneurs Find:</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-1">Scattered Social Media</h4>
                        <p className="text-sm text-gray-600">Random LinkedIn posts, old Facebook content, inconsistent messaging across platforms</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-1">Outdated Information</h4>
                        <p className="text-sm text-gray-600">Old job titles, previous companies, achievements from years ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-1">Personal Content</h4>
                        <p className="text-sm text-gray-600">Family photos, personal opinions, content that doesn't build professional authority</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-1">Competitor Results</h4>
                        <p className="text-sm text-gray-600">Other people with your name, competitors appearing in your results</p>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900">
                The Hidden Cost of Poor Search Results
              </h2>
              <p className="text-lg text-gray-600">
                Every day, opportunities slip away because your digital presence doesn't reflect your true expertise
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Lost Client Opportunities</h3>
                <p className="text-gray-600 text-sm">Premium clients choose competitors who "look more established" in search results</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Missed Partnerships</h3>
                <p className="text-gray-600 text-sm">Strategic partners can't find evidence of your expertise when they research you</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Undervalued Pricing</h3>
                <p className="text-gray-600 text-sm">Can't command premium rates when search results don't establish authority</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Speaking Opportunities</h3>
                <p className="text-gray-600 text-sm">Event organizers pass you over for speakers with stronger digital presence</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">The Reality Check:</h3>
              <p className="text-gray-600 mb-6 text-lg">
                <strong>You don't own your digital presence—the platforms do.</strong><br />
                Google, LinkedIn, and social media algorithms decide how you appear to the world.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-orange-500 max-w-2xl mx-auto">
                <p className="text-gray-900 font-semibold mb-2 italic">
                  "I had no idea how unprofessional my search results looked until a potential investor mentioned they almost didn't take the meeting."
                </p>
                <p className="text-gray-600 text-sm">— Tech Entrepreneur, now Personal Brand Empire client</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-normal mb-6 text-gray-900">
              Our Mission: Digital Independence
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe your brand deserves a home it owns, not a rented room on someone else's platform.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900">
                Website Services
              </h2>
              <p className="text-lg text-gray-600">
                Professional websites designed for creators, entrepreneurs, and businesses who want to own their digital presence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Personal Website Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                    <Globe className="w-8 h-8 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">From $1,500</span>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Personal Website</h3>
                <p className="text-gray-600 mb-6">
                  Showcase your work and story with a professional website that you own. Perfect for consultants and freelancers.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Custom domain & hosting setup</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Mobile-responsive design</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Contact & content management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">SEO optimization</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                  Get Started
                </Button>
              </div>

              {/* Creator Platform Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                    <Zap className="w-8 h-8 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-orange-600 uppercase tracking-wider">From $3,500</span>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Creator Platform</h3>
                <p className="text-gray-600 mb-6">
                  Everything you need to build your audience with special features for content creators and influencers.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Everything in Personal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Email list management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Member management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Analytics & insights</span>
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Most Popular
                </Button>
              </div>

              {/* Portfolio & Blog Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                    <Palette className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">From $2,500</span>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Portfolio & Blog</h3>
                <p className="text-gray-600 mb-6">
                  Showcase your work and share your thoughts with a beautiful portfolio and blog platform.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Everything in Personal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Portfolio showcase</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Blog with categories</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Comment system</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  Get Started
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
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900">
                How we bring your vision to life
              </h2>
              <p className="text-lg text-gray-600">
                A streamlined process designed for creators, entrepreneurs, and growing businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl font-semibold text-purple-600">01</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Quick Start</h3>
                <p className="text-sm text-gray-600">
                  Share your vision with us. We'll help you choose the perfect package for your needs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl font-semibold text-purple-600">02</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Design & Build</h3>
                <p className="text-sm text-gray-600">
                  We create your custom website with your feedback every step of the way.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl font-semibold text-purple-600">03</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Review & Refine</h3>
                <p className="text-sm text-gray-600">
                  Perfect every detail together until your site exceeds expectations.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl font-semibold text-purple-600">04</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Launch & Support</h3>
                <p className="text-sm text-gray-600">
                  Go live with confidence and ongoing support for your success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Form */}
      <section id="contact" className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900">
                Let's build something{" "}
                <span className="text-purple-600 font-medium italic">exceptional</span>{" "}
                together
              </h2>
              <p className="text-lg text-gray-600">
                Ready to start your project? Schedule a 30-minute consultation to discuss your requirements, timeline, and how we can help bring your vision to life.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a project type</option>
                      <option value="personal">Personal Website</option>
                      <option value="creator">Creator Platform</option>
                      <option value="portfolio">Portfolio & Blog</option>
                      <option value="custom">Custom Project</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your budget</option>
                      <option value="1500-2500">$1,500 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000+">$10,000+</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    * I agree to the privacy policy and understand my information will be handled securely and not shared with third parties.
                  </p>
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  >
                    Schedule a Call
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
            <h2 className="text-3xl md:text-4xl font-normal mb-6 text-gray-900">
              Direct Contact
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Email</h3>
                <p className="text-gray-600">hello@gallifrey.consulting</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Response Time</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
