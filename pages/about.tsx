import { ArrowRight, Award, CheckCircle, Globe, Shield, Target, Users } from "lucide-react";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NextSeo } from 'next-seo';
import { useScrollAnimation, useStaggeredAnimation } from '@/lib/useScrollAnimation';

export default function AboutPage() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: valuesRef, visibleItems: valuesVisible } = useStaggeredAnimation<HTMLDivElement>(3);
  const { ref: processRef, visibleItems: processVisible } = useStaggeredAnimation<HTMLDivElement>(4);

  const coreValues = [
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: "Security First",
      description: "Every solution begins with enterprise-grade security architecture. We build from zero-trust principles because your digital assets deserve military-grade protection."
    },
    {
      icon: <Target className="w-8 h-8 text-accent" />,
      title: "Strategic Focus",
      description: "We're not order-takers. Every engagement begins with understanding your strategic objectives and ensuring technology serves your business goals, not the reverse."
    },
    {
      icon: <Globe className="w-8 h-8 text-accent" />,
      title: "Digital Sovereignty",
      description: "Platform independence isn't just technical—it's strategic. We ensure you control your digital destiny without dependence on external entities that could change terms overnight."
    }
  ];

  const methodology = [
    {
      phase: "Strategic Discovery",
      description: "Comprehensive analysis of current digital infrastructure, strategic objectives, and competitive positioning to identify optimization opportunities.",
      deliverables: ["Infrastructure audit", "Strategic assessment", "Risk analysis", "Opportunity mapping"]
    },
    {
      phase: "Architecture Design", 
      description: "Custom solution architecture balancing security, scalability, and business requirements with platform independence and future-proofing principles.",
      deliverables: ["Technical architecture", "Security framework", "Implementation roadmap", "Risk mitigation strategy"]
    },
    {
      phase: "Implementation",
      description: "Agile development with continuous security validation, stakeholder communication, and iterative refinement based on real-world performance data.",
      deliverables: ["Custom development", "Security implementation", "Testing protocols", "Performance optimization"]
    },
    {
      phase: "Strategic Partnership",
      description: "Ongoing strategic support, security monitoring, and infrastructure evolution to maintain competitive advantages as your business scales.",
      deliverables: ["Continuous monitoring", "Strategic consultation", "Evolution planning", "Incident response"]
    }
  ];

  const credentials = [
    "Enterprise Security Architecture",
    "Zero-Trust Implementation",
    "GDPR/Privacy Compliance",
    "Digital Sovereignty Strategy",
    "Platform Independence Planning",
    "Custom Development Excellence"
  ];

  return (
    <>
      <NextSeo
        title="About | Strategic Digital Consulting & Enterprise Security"
        description="Melbourne-based strategic digital consultancy specializing in enterprise security, digital sovereignty, and platform independence for Australian businesses."
        canonical="https://gallifrey.consulting/about"
        openGraph={{
          url: 'https://gallifrey.consulting/about',
          title: 'About | Strategic Digital Consulting & Enterprise Security',
          description: 'Melbourne-based strategic digital consultancy specializing in enterprise security and digital sovereignty.',
        }}
      />
      
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div 
            ref={headerAnimation.ref}
            className={`container mx-auto max-w-4xl text-center animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="mb-8">
              <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
                About Gallifrey Consulting
              </p>
              <div className="w-12 h-px bg-accent mx-auto"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary">
              Strategic Digital Consulting for
              <span className="italic text-accent"> Modern Business</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're a Melbourne-based strategic consultancy specializing in enterprise security, 
              digital sovereignty, and platform independence for businesses that refuse to compromise on digital excellence.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4 bg-gradient-to-br from-secondary/10 to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-medium leading-tight mb-6 text-primary">
                  Our Mission: Digital Independence Through Strategic Excellence
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In an era of increasing platform dependency and digital surveillance, 
                    Australian businesses need more than websites—they need digital sovereignty. 
                    We architect custom solutions that ensure your business controls its digital destiny.
                  </p>
                  <p>
                    Every engagement begins with a fundamental question: How do we build technology 
                    that amplifies your strategic advantages while maintaining complete independence 
                    from platforms that could change terms, pricing, or availability overnight?
                  </p>
                  <p>
                    Our approach combines enterprise-grade security, custom development excellence, 
                    and strategic business thinking to create antifragile digital infrastructure 
                    that grows stronger under market pressure.
                  </p>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-8">
                <h3 className="font-serif text-xl font-medium text-primary mb-6">
                  Strategic Differentiators
                </h3>
                <div className="space-y-4">
                  {credentials.map((credential, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{credential}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-medium leading-tight mb-6 text-primary">
                Core Values That Drive Every Decision
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                These principles guide our strategic approach and ensure every solution 
                serves your long-term competitive positioning.
              </p>
            </div>

            <div ref={valuesRef} className="grid lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className={`group text-center p-8 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-up ${valuesVisible[index] ? 'visible' : ''}`}
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-24 px-4 bg-gradient-to-br from-secondary/5 to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-medium leading-tight mb-6 text-primary">
                Strategic Engagement Methodology
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Our proven four-phase approach ensures strategic alignment, 
                technical excellence, and measurable business outcomes.
              </p>
            </div>

            <div ref={processRef} className="space-y-8">
              {methodology.map((phase, index) => (
                <div
                  key={index}
                  className={`border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm p-8 animate-fade-up ${processVisible[index] ? 'visible' : ''}`}
                >
                  <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <h3 className="font-serif text-xl font-medium text-primary">
                          {phase.phase}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-primary mb-3">Key Deliverables</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            <span className="text-sm text-muted-foreground">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team & Expertise */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-medium leading-tight mb-6 text-primary">
                Melbourne-Based Expertise, Global Perspective
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our strategic consultancy combines deep technical expertise with business acumen, 
                ensuring every solution serves your competitive positioning while maintaining the highest security standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-medium text-primary mb-3">
                    Technical Excellence
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Enterprise-grade security architecture, zero-trust implementation, 
                    and custom development capabilities that scale with your business growth.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl font-medium text-primary mb-3">
                    Strategic Thinking
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every technical decision considers your competitive landscape, 
                    growth objectives, and long-term strategic positioning.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-medium text-primary mb-3">
                    Australian Focus
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Deep understanding of Australian privacy laws, business culture, 
                    and regulatory requirements that affect digital strategy decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl font-medium text-primary mb-3">
                    Long-term Partnership
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We build relationships, not just systems. Ongoing strategic support 
                    ensures your digital infrastructure evolves with your business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="p-8 bg-accent/5 border border-accent/20 rounded-lg">
              <h3 className="font-serif text-xl font-medium text-primary mb-3">
                Ready to Discuss Your Strategic Requirements?
              </h3>
              <p className="text-muted-foreground mb-6">
                Schedule a discovery consultation to explore how our strategic approach 
                can strengthen your competitive positioning through digital excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://calendly.com/rickithadi/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Schedule Strategic Discovery
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Send Detailed Inquiry
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}