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
      answer: "We're digital security specialists who build custom websites, design systems, and provide data security consulting with AI-enhanced development workflows. Unlike typical agencies that use templates or WordPress, we hand-code everything from scratch with enterprise-grade security built in from day one. You get complete ownership of your code, data, and digital assets – no vendor lock-in, no dependencies on platforms that can change their terms. We treat every project as a strategic investment in your digital independence, not just another website."
    },
    {
      question: "How do you determine project investment levels?",
      answer: "Every project begins with a detailed discovery consultation to understand your specific needs, timeline, and goals. Investment levels depend on scope and complexity: simple custom websites might start around $3,000-5,000, while comprehensive design systems with security consulting can range $5,000-15,000+. Complex enterprise solutions with ongoing security partnership are quoted individually. We provide transparent, fixed-price quotes after understanding your requirements – no hourly billing or surprise costs."
    },
    {
      question: "Do you work with clients outside of Melbourne?",
      answer: "Yes, while we're proudly Melbourne-based, we serve clients across Australia and internationally. Our digital-first approach means we can deliver exceptional results regardless of location, with clear communication and strategic project management."
    },
    {
      question: "What is your approach to digital sovereignty and privacy protection?",
      answer: "Digital sovereignty means you control your digital destiny. We help businesses achieve complete data ownership and platform independence through custom-built solutions that never rely on third-party platforms that can change terms overnight. Our services include GDPR compliance implementation, data broker removal, privacy-by-design architecture, and creating systems that grow with your business without vendor lock-in. You own your code, your data, and your competitive advantage – forever."
    },
    {
      question: "What security measures do you implement?",
      answer: "Security is built into every aspect of our development process, not added as an afterthought. We implement enterprise-grade measures including: zero-trust architecture, end-to-end encryption, secure authentication systems, comprehensive penetration testing, GDPR/CCPA compliance protocols, and secure hosting infrastructure. Every project includes ongoing security monitoring and regular updates. We've maintained a perfect security record with zero incidents across all client projects because security starts from the first line of code, not the last."
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
      answer: "We choose the best technology for each project based on your specific needs, not what's trendy. Our expertise includes modern frameworks like Next.js and React for dynamic websites, Node.js for backend systems, various database solutions (PostgreSQL, MongoDB), cloud infrastructure (AWS, Vercel), and comprehensive security tools. We leverage AI-assisted development tools to accelerate delivery while maintaining code quality. We prioritize technologies that give you long-term stability, performance, and security rather than flashy features that might become obsolete. Every technical choice is explained and documented so you understand your investment."
    },
    {
      question: "Can you help with existing websites and systems?",
      answer: "Absolutely. We provide comprehensive audits of existing websites and digital systems, identifying security vulnerabilities, performance bottlenecks, and privacy compliance gaps. Services include security hardening, speed optimization, GDPR compliance implementation, data sovereignty upgrades, and migration planning. Sometimes we can enhance your current system; other times we'll recommend a strategic rebuild to give you better long-term value. Either way, we'll give you honest, expert advice about the best path forward for your specific situation."
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
            <p className="text-sm font-medium tracking-[0.08em] text-muted-foreground uppercase mb-4">
              Frequently Asked Questions
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight mb-6 text-primary tracking-tight">
            Everything you need to know about
            <span className="italic text-accent font-medium"> working with us</span>
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