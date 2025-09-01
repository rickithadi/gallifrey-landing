import { ArrowRight, Globe, Palette, Zap, CheckCircle } from "lucide-react";

import { Button } from "./ui/button";
import { GoogleSearchSplitLayout as GoogleSearchAnimation } from "./GoogleSearchSplitLayout";
import { StickyCallToAction } from "./StickyCallToAction";
import { useState } from "react";
import { useForm } from "@formspree/react";

export function OwnYourNarrative() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [state, handleFormspreeSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_OYN_ID || 'mzzprpkq');

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle CTA clicks with analytics
  const handleCTAClick = (action: string, section: string) => {
    // Track conversion events
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as typeof window & { gtag: Function }).gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: `${action}_${section}`,
      });
    }
    
    if (action === 'start_project' || action === 'get_audit') {
      scrollToSection('contact');
    } else if (action === 'learn_more') {
      scrollToSection('services');
    } else if (action === 'view_work') {
      // Could link to case studies or portfolio
      window.open('/case-studies', '_blank');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData for Formspree
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('project_type', projectType);
    formData.append('budget', budget);
    formData.append('message', message);
    formData.append('form_type', 'Own Your Narrative Campaign');
    formData.append('_subject', `Own Your Narrative: ${projectType} inquiry from ${name}`);
    
    // Submit to Formspree
    await handleFormspreeSubmit(formData);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-oyn-stone-100 via-oyn-stone-50 to-oyn-stone-50">
        <div className="absolute inset-0 bg-gradient-to-br from-oyn-stone-100/30 via-transparent to-oyn-orange-100/10"></div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-medium leading-tight mb-6 text-oyn-stone-800">
              What happens when someone <span className="text-oyn-orange-600">Googles your business?</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-oyn-stone-600 mb-8 max-w-3xl mx-auto leading-relaxed font-body">
              Go ahead. Try it right now.
            </p>

            {/* Google Search Animation */}
            <GoogleSearchAnimation />

            {/* Value Proposition */}
            <div className="text-center max-w-4xl mx-auto mt-12 mb-12">
              <p className="text-lg md:text-xl text-oyn-stone-700 mb-4 leading-relaxed font-body">
                Professional digital presence that you own completely. <span className="font-semibold">Starting at just $500.</span>
              </p>
              
              <p className="text-md text-oyn-stone-600">
                Custom-crafted. Obsessively detailed. Completely yours.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => handleCTAClick('start_project', 'hero')}
                className="px-8 py-6 text-lg bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCTAClick('view_work', 'hero')}
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
                Take Control of Your Search Results
              </h2>
              <p className="text-lg text-oyn-stone-600 leading-relaxed">
                Right now, your customers are Googling you. They&apos;re seeing outdated social profiles, competitor ads, and random directory listings instead of your story.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-heading font-medium mb-6 text-oyn-stone-800">When you own your digital presence, you control what people find.</h3>
                <p className="text-lg text-oyn-stone-700 mb-6 font-semibold">Your website, your search results, your narrative.</p>
                <div className="bg-oyn-stone-100 p-6 rounded-lg border-l-4 border-oyn-orange-600 mb-6">
                  <div className="space-y-4 text-oyn-stone-600">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span><strong>Be the first result when people Google you</strong> - Control your professional image and search presence</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span><strong>Higher conversion rates and premium pricing</strong> - Custom domains and professional design signal quality and trustworthiness to clients</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span><strong>Higher lifetime customer value</strong> - Build genuine connections with your audience without platform intermediaries</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-oyn-orange-100 text-oyn-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span><strong>Better business decisions and privacy</strong> - Your customer data, analytics, and insights belong to you, not a platform</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleCTAClick('learn_more', 'value_prop')}
                  className="bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
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
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Deplatforming Risk</h3>
                <p className="text-oyn-stone-600 text-sm">Algorithm changes or account suspensions can eliminate your online presence overnight</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">📉</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Revenue Vulnerability</h3>
                <p className="text-oyn-stone-600 text-sm">Platform rule changes can cut your reach by 90% without warning, directly impacting income</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Lost Premium Pricing</h3>
                <p className="text-oyn-stone-600 text-sm">Poor search results make you look like a commodity, forcing you to compete on price</p>
              </div>

              <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow border border-oyn-stone-200">
                <div className="text-4xl mb-4">🏃</div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Customer Flight Risk</h3>
                <p className="text-oyn-stone-600 text-sm">Clients Google you after hearing about algorithm changes&mdash;what will they find?</p>
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
                  &ldquo;When Instagram changed their algorithm, my reach dropped 85% overnight. I lost $30K in revenue in three months. Never again will I depend on someone else&apos;s platform.&rdquo;
                </p>
                <p className="text-oyn-stone-600 text-sm">— Melbourne Fitness Coach, now owns her traffic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Promise Section */}
      <section className="py-20 bg-oyn-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-6 text-oyn-stone-800">
              The $500 Investment That Pays for Itself
            </h2>
            <p className="text-lg text-oyn-stone-600 leading-relaxed mb-8">
              Our smallest package typically generates its cost back within 30-60 days through improved lead quality and conversion rates.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-oyn-orange-600 mb-2">3-10x</div>
                <p className="text-sm text-oyn-stone-600">Return on investment within first year</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-oyn-orange-600 mb-2">25-40%</div>
                <p className="text-sm text-oyn-stone-600">Increase in conversion rates</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-oyn-orange-600 mb-2">60 days</div>
                <p className="text-sm text-oyn-stone-600">Average time to see ROI</p>
              </div>
            </div>
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
                  <span className="text-sm font-medium text-oyn-orange-600 uppercase tracking-wider">From $1000</span>
                </div>

                <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">Professional Website</h3>
                <p className="text-oyn-stone-600 mb-6 leading-relaxed">
                  Your own professional website with custom domain, hosting, and complete ownership. Be the first result when people Google your business.
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

                <Button 
                  variant="outline" 
                  onClick={() => handleCTAClick('start_project', 'personal_website')}
                  className="w-full border-oyn-orange-300 text-oyn-orange-600 hover:bg-oyn-orange-50 rounded-lg"
                >
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

                <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">Custom Applications</h3>
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

                <Button 
                  onClick={() => handleCTAClick('start_project', 'custom_platform')}
                  className="w-full bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white rounded-lg"
                >
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

                <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">Digital Privacy</h3>
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

                <Button 
                  variant="outline" 
                  onClick={() => handleCTAClick('learn_more', 'authority_platform')}
                  className="w-full border-oyn-orange-300 text-oyn-orange-600 hover:bg-oyn-orange-50 rounded-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liberation Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 text-oyn-stone-800">
                How We Turn Your Google Problem Into Profit
              </h2>
              <p className="text-lg text-oyn-stone-600 leading-relaxed">
                Three proven steps that transform weak search results into a premium business asset that generates leads while you sleep.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-oyn-orange-100 to-oyn-orange-50 rounded-xl mb-6 shadow-sm">
                  <span className="text-2xl font-heading font-bold text-oyn-orange-700">📊</span>
                </div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Search Audit & Strategy</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed mb-4">
                  We analyze what customers find when they Google you, identify missed revenue opportunities, and design a plan to capture those leads.
                </p>
                <div className="text-xs text-oyn-stone-500 bg-oyn-stone-50 p-3 rounded-lg">
                  <strong>Timeline:</strong> 1 week<br />
                  <strong>ROI Impact:</strong> Identify $2K-20K+ in lost opportunities
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-oyn-orange-100 to-oyn-orange-50 rounded-xl mb-6 shadow-sm">
                  <span className="text-2xl font-heading font-bold text-oyn-orange-700">🚀</span>
                </div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Premium Website Build</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed mb-4">
                  Launch a professional website that positions you as the premium choice, converts browsers into buyers, and justifies higher prices.
                </p>
                <div className="text-xs text-oyn-stone-500 bg-oyn-stone-50 p-3 rounded-lg">
                  <strong>Timeline:</strong> 2-3 weeks<br />
                  <strong>ROI Impact:</strong> 25-40% increase in conversion rates
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-oyn-orange-100 to-oyn-orange-50 rounded-xl mb-6 shadow-sm">
                  <span className="text-2xl font-heading font-bold text-oyn-orange-700">💰</span>
                </div>
                <h3 className="text-xl font-heading font-medium mb-3 text-oyn-stone-800">Revenue Growth</h3>
                <p className="text-sm text-oyn-stone-600 leading-relaxed mb-4">
                  Watch your business grow as qualified leads find you first, trust you more, and pay premium prices. Own your customer data and relationships.
                </p>
                <div className="text-xs text-oyn-stone-500 bg-oyn-stone-50 p-3 rounded-lg">
                  <strong>Timeline:</strong> Results within 30-90 days<br />
                  <strong>ROI Impact:</strong> 3-10x return on investment
                </div>
              </div>
            </div>

            {/* Campaign CTA */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-oyn-stone-50 to-oyn-orange-50 rounded-xl border border-oyn-orange-200">
              <h3 className="text-2xl font-heading font-medium mb-4 text-oyn-stone-800">
                Stop Losing Money to Poor Search Results
              </h3>
              <p className="text-oyn-stone-600 mb-6 max-w-2xl mx-auto">
                Every day you wait, qualified customers choose competitors who show up better in Google. Turn your search results into your biggest sales asset.
              </p>
              <div className="bg-white p-4 rounded-lg mb-6 inline-block">
                <p className="text-sm text-oyn-stone-500 mb-1">Average client sees ROI within:</p>
                <p className="text-2xl font-bold text-oyn-orange-600">60 days</p>
              </div>
              <br />
              <Button 
                onClick={() => handleCTAClick('get_audit', 'process_cta')}
                className="bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Your Revenue Audit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
              {/* Success State */}
              {state.succeeded ? (
                <div className="bg-white rounded-lg p-8 shadow-sm border border-oyn-stone-200 text-center">
                  <CheckCircle className="w-16 h-16 text-oyn-orange-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-heading font-medium text-oyn-stone-800 mb-4">
                    Thank you! We&apos;ll be in touch soon.
                  </h3>
                  <p className="text-oyn-stone-600 mb-8">
                    Your inquiry has been received. We&apos;ll review your project requirements and respond within 24 hours with next steps for your digital independence journey.
                  </p>
                  <Button
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setProjectType('');
                      setBudget('');
                      setMessage('');
                    }}
                    variant="outline"
                    className="border-oyn-orange-300 text-oyn-orange-600 hover:bg-oyn-orange-50"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm border border-oyn-stone-200">
                {/* Error handling */}
                {state.errors && Object.keys(state.errors).length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                    <p className="text-sm font-medium text-red-800 mb-1">There was an error submitting your inquiry</p>
                    <p className="text-sm text-red-600">Please try again or contact us directly at hello@gallifreyconsulting.com</p>
                  </div>
                )}
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
                      <option value="personal">Personal Website ($1000+)</option>
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
                    disabled={state.submitting}
                    className="px-8 py-3 bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {state.submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Begin the Conversation'
                    )}
                  </Button>
                </div>
              </form>
              )}
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
      
      {/* Sticky CTA */}
      <StickyCallToAction />
    </div>
  );
}
