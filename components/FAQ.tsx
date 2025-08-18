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
      question: "What makes Gallifrey Consulting different from other development agencies?",
      answer: "We're not just developers – we're digital security specialists who approach every project with enterprise-grade security, pixel-perfect design precision, and complete digital sovereignty principles. Every solution is custom-built from scratch, never using templates or compromising on quality."
    },
    {
      question: "How do you determine project investment levels?",
      answer: "Our partnerships typically begin with a comprehensive discovery process to understand your specific requirements, scope, and strategic objectives. Investment levels vary based on complexity, timeline, and desired outcomes. Foundation projects typically start in the four-figure range, while enterprise solutions scale based on requirements."
    },
    {
      question: "Do you work with clients outside of Melbourne?",
      answer: "Yes, while we're proudly Melbourne-based, we serve clients across Australia and internationally. Our digital-first approach means we can deliver exceptional results regardless of location, with clear communication and strategic project management."
    },
    {
      question: "What is your approach to digital sovereignty and privacy protection?",
      answer: "We believe in complete data ownership and platform independence. Our digital sovereignty services include removing your information from data brokers, implementing privacy-by-design architecture, and creating custom solutions that ensure you're never dependent on third-party platforms that could change terms or disappear."
    },
    {
      question: "What security measures do you implement?",
      answer: "Every project includes enterprise-grade security from the foundation up: zero-trust architecture, comprehensive penetration testing, GDPR/CCPA compliance implementation, secure hosting infrastructure, and ongoing security monitoring. Security isn't an add-on – it's built into everything we create."
    },
    {
      question: "How long do projects typically take?",
      answer: "Timeline varies by complexity and scope. Foundation projects typically take 1-2 weeks, Professional packages 2-4 weeks, and Enterprise solutions 4-12 weeks. We provide detailed timelines during the discovery phase and maintain transparent communication throughout the process."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Absolutely. All partnerships include ongoing support, security monitoring, and maintenance. Foundation includes 1 month, Professional includes 3 months, and Enterprise includes comprehensive ongoing strategic support. We build long-term relationships, not just websites."
    },
    {
      question: "What technologies and frameworks do you use?",
      answer: "We're technology-agnostic and choose the best tools for each specific project. Our expertise spans modern frameworks (Next.js, React, Node.js), robust databases, cloud infrastructure (AWS, Vercel), and cutting-edge security implementations. Every technical decision is made based on your specific requirements and long-term goals."
    },
    {
      question: "Can you help with existing websites and systems?",
      answer: "Yes, we provide comprehensive audits and improvements for existing digital infrastructure. This includes security hardening, performance optimization, privacy compliance implementation, and digital sovereignty upgrades. We can work with your current systems or recommend strategic rebuilds when necessary."
    },
    {
      question: "What happens during the discovery consultation?",
      answer: "Our 30-minute discovery call covers your current challenges, strategic objectives, technical requirements, timeline expectations, and success metrics. We'll discuss your digital sovereignty goals, security concerns, and provide initial recommendations. There's no obligation – it's about ensuring we're the right fit for your vision."
    }
  ];

  return (
    <section id="faq" className="py-24 px-4 bg-gradient-to-br from-secondary/5 to-background">
      <div className="container mx-auto max-w-4xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Frequently Asked Questions
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary">
            Everything you need to know about
            <span className="italic text-accent"> working with us</span>
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
                <span className="font-medium text-primary pr-4">
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
                  className="px-6 pb-4 text-muted-foreground leading-relaxed animate-fade-up"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-16 p-8 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-serif text-xl font-medium text-primary mb-3">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
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