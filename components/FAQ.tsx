import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { useState } from "react";

export function FAQ() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What distinguishes Gallifrey Consulting from other development agencies?",
      answer: "We specialize in security-first digital solutions, combining bespoke development with AI-enhanced workflows to deliver unparalleled results. Every website and system is meticulously hand-coded from the ground up—no templates, no WordPress dependencies, no compromises. Our approach ensures complete ownership of your digital assets, eliminating vendor lock-in and providing true platform independence. We view each engagement as a strategic partnership in building your digital sovereignty, not merely another project."
    },
    {
      question: "How do you structure investment levels for projects?",
      answer: "Each engagement commences with a comprehensive discovery consultation to thoroughly understand your objectives, timeline, and strategic requirements. Investment levels are calibrated based on project scope and complexity: foundational custom websites typically begin at $3,000-5,000, while comprehensive design systems with integrated security consulting range from $5,000-15,000+. Enterprise-scale solutions with ongoing strategic partnerships are individually assessed and quoted. We maintain complete transparency with fixed-price proposals—no hourly billing uncertainties or unexpected costs."
    },
    {
      question: "Do you serve clients beyond Melbourne?",
      answer: "Absolutely. While we're proudly headquartered in Melbourne, our expertise extends across Australia and internationally. Our sophisticated digital-first methodology enables seamless collaboration regardless of geographic location, supported by meticulous communication protocols and strategic project governance that ensure exceptional outcomes for every client."
    },
    {
      question: "How do you approach digital sovereignty and privacy protection?",
      answer: "Digital sovereignty represents complete autonomy over your digital presence and narrative control. We architect custom solutions that eliminate dependencies on third-party platforms while controlling how your organization appears online. Our comprehensive services encompass enterprise security implementation, GDPR compliance, systematic data broker removal from 200+ sources, SEO reputation management, privacy-by-design architecture, and scalable systems that evolve with your enterprise. The result: perpetual ownership of your code, data, reputation, and competitive intelligence—complete digital narrative control."
    },
    {
      question: "What security protocols do you implement?",
      answer: "Security is integral to our development methodology, embedded from conception rather than retrofitted. We deploy enterprise-grade safeguards including zero-trust architecture, end-to-end encryption, advanced authentication systems, comprehensive penetration testing, and full GDPR/CCPA compliance protocols. Our secure hosting infrastructure includes continuous monitoring and proactive updates. We maintain an unblemished security record with zero incidents across our entire client portfolio—a testament to our philosophy that security begins with the first line of code."
    },
    {
      question: "What are typical project timelines?",
      answer: "Project duration is calibrated to complexity and scope requirements. Foundation engagements typically span 1-2 weeks, Professional packages require 2-4 weeks, while Enterprise solutions encompass 4-12 weeks. During our discovery phase, we provide meticulously detailed timelines with milestone markers, maintaining transparent communication and regular progress updates throughout the entire engagement."
    },
    {
      question: "Do you provide ongoing support after project delivery?",
      answer: "Certainly. Every partnership includes comprehensive ongoing support, continuous security monitoring, and proactive maintenance. Foundation engagements include one month of support, Professional packages encompass three months, while Enterprise partnerships feature indefinite strategic support. We cultivate enduring relationships and long-term success, not merely transactional project delivery."
    },
    {
      question: "Which technologies and frameworks do you employ?",
      answer: "We select optimal technologies based on strategic requirements rather than industry trends. Our technical expertise encompasses modern frameworks including Next.js and React for dynamic applications, Node.js for robust backend systems, enterprise database solutions (PostgreSQL, MongoDB), cloud infrastructure (AWS, Vercel), and comprehensive security toolsets. We integrate AI-assisted development methodologies to accelerate delivery while maintaining exceptional code quality. Our technology choices prioritize long-term stability, performance optimization, and security over ephemeral features. Every technical decision is thoroughly documented and explained, ensuring complete transparency in your investment."
    },
    {
      question: "Can you enhance existing websites and digital systems?",
      answer: "Certainly. We conduct comprehensive audits of existing digital infrastructure, identifying security vulnerabilities, privacy exposures, performance bottlenecks, and compliance deficiencies. Our enhancement services include security fortification, data broker cleanup, performance optimization, GDPR compliance implementation, personal information removal, data sovereignty upgrades, and strategic migration planning. Depending on your current architecture, we may recommend targeted improvements or advise a complete strategic rebuild for optimal long-term value. In every case, we provide candid, expert guidance tailored to your specific circumstances and privacy objectives."
    },
    {
      question: "What occurs during the discovery consultation?",
      answer: "Our 30-minute discovery consultation comprehensively addresses your current challenges, strategic objectives, technical requirements, timeline expectations, and success metrics. We explore your digital sovereignty aspirations, security priorities, and provide preliminary strategic recommendations. This obligation-free consultation ensures optimal alignment between our capabilities and your vision, establishing the foundation for a successful partnership."
    }
  ];

  return (
    <section id="faq" className="py-24 px-4 bg-gradient-to-br from-secondary/5 to-background" aria-labelledby="faq-heading">
      <div className="container mx-auto max-w-4xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.08em] text-muted-foreground uppercase mb-4">
              Frequently Asked Questions
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 id="faq-heading" className="text-3xl md:text-5xl font-serif font-light leading-tight mb-6 text-primary tracking-tight">
            Everything you need to know about
            <span className="italic text-accent font-bold tracking-wide"> working with us</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a different question? <a href="#contact" className="text-accent hover:underline">Get in touch</a> and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors rounded-lg"
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-content-${index}`}
              >
                <span className="font-semibold text-primary pr-4 tracking-wide">
                  {faq.question}
                </span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div
                  id={`faq-content-${index}`}
                  className="px-6 pb-4 text-muted-foreground leading-relaxed tracking-wide"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-16 p-8 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-serif text-xl font-bold text-primary mb-3 tracking-wide">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6 tracking-wide leading-relaxed">
            Schedule a free 30-minute consultation to discuss your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              Send us a message
            </button>
            <a
              href="https://calendly.com/rickithadi/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
            >
              Book consultation call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}