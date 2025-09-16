import { Flower, Shield, Heart, Brain, Eye, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/useScrollAnimation";
import { trackCTAClick } from "@/lib/analytics";
import { useCallback } from "react";

export function DigitalSavasthya() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const { ref: conceptsRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(5);

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
  }, []);

  const savasthyaElements = [
    {
      icon: <Heart className="w-8 h-8 text-gallifrey-teal" />,
      title: "Authentic Presence",
      sanskrit: "Svarūpa",
      description: "Your true digital self, aligned with your core values and authentic narrative. Not performing for algorithms, but expressing your genuine dharma online.",
      modernApplication: "Platform-independent content strategy that reflects your real values, not what Big Tech rewards."
    },
    {
      icon: <Shield className="w-8 h-8 text-gallifrey-teal" />,
      title: "Digital Protection",
      sanskrit: "Rakṣaṇa", 
      description: "Comprehensive security that guards your reputation, privacy, and platform independence. Like a digital immune system protecting your online wellness.",
      modernApplication: "Real-time monitoring, crisis response protocols, and reputation threat mitigation across all digital touchpoints."
    },
    {
      icon: <Brain className="w-8 h-8 text-gallifrey-teal" />,
      title: "Narrative Wisdom",
      sanskrit: "Viveka",
      description: "The discernment to craft your story with strategic intelligence. Understanding how your digital footprint shapes opportunities and relationships.",
      modernApplication: "Data-driven reputation optimization that maintains authenticity while maximizing professional opportunities."
    },
    {
      icon: <Eye className="w-8 h-8 text-gallifrey-teal" />,
      title: "Conscious Visibility",
      sanskrit: "Sākṣin",
      description: "Intentional presence that serves your goals rather than feeding surveillance capitalism. Being seen for who you truly are, not who algorithms think you should be.",
      modernApplication: "Strategic content placement and search optimization that amplifies your authentic message without platform dependency."
    },
    {
      icon: <Flower className="w-8 h-8 text-gallifrey-teal" />,
      title: "Digital Liberation",
      sanskrit: "Mokṣa",
      description: "Freedom from Big Tech dependency and platform prison. True digital sovereignty where you own your audience, content, and revenue streams.",
      modernApplication: "Complete platform independence with owned media, direct relationships, and crisis-proof digital infrastructure."
    }
  ];

  return (
    <section id="digital-savasthya" className="py-20 px-4 bg-gradient-to-b from-gallifrey-white to-gallifrey-white/50" aria-labelledby="savasthya-heading">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div
          ref={headerAnimation.ref}
          className={`mb-20 text-center animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-[0.1em] text-gallifrey-charcoal/60 uppercase mb-4">
              Ancient Wisdom, Modern Application
            </p>
            <div className="w-12 h-px bg-gallifrey-teal mx-auto"></div>
          </div>

          <h2 id="savasthya-heading" className="text-3xl md:text-5xl font-heading font-medium leading-tight mb-8 text-gallifrey-charcoal max-w-4xl mx-auto tracking-tight">
            Understanding Digital
            <span className="italic text-gallifrey-teal"> Savasthya</span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed">
            <p className="text-gallifrey-charcoal/80">
              <span className="font-medium italic">Savasthya</span> (स्वास्थ्य) is the Sanskrit word for &ldquo;health&rdquo; or &ldquo;wellness,&rdquo; literally meaning 
              <span className="text-gallifrey-teal font-medium"> &ldquo;to be rooted in oneself.&rdquo;</span> In Ayurveda, true health requires balance 
              across all dimensions of being — physical, mental, and spiritual.
            </p>
            
            <p className="text-gallifrey-charcoal/80">
              <span className="font-medium">Digital Savasthya</span> applies this ancient wisdom to modern online existence. It&rsquo;s about achieving 
              authentic digital wellness where your online presence aligns with your true self, protected from external manipulation 
              and platform dependency.
            </p>

            <div className="bg-gallifrey-teal/10 rounded-2xl p-6 text-gallifrey-charcoal">
              <p className="font-medium mb-2">Like Ayurvedic medicine treats root causes, not just symptoms:</p>
              <p className="italic">Digital Savasthya addresses platform dependency and reputation vulnerabilities at their source, 
              creating sustainable digital wellness that serves your authentic dharma.</p>
            </div>
          </div>
        </div>

        {/* Five Elements of Digital Savasthya */}
        <div ref={conceptsRef} className="space-y-12 mb-20">
          {savasthyaElements.map((element, index) => (
            <div
              key={index}
              className={`group animate-fade-up ${visibleItems[index] ? 'visible' : ''}`}
            >
              <div className={`flex flex-col lg:flex-row gap-8 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Icon and Title */}
                <div className="lg:w-1/3 text-center lg:text-left">
                  <div className={`w-16 h-16 bg-gallifrey-teal/10 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4 ${index % 2 === 1 ? 'lg:ml-auto lg:mr-0' : ''}`}>
                    {element.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-gallifrey-charcoal mb-2">
                    {element.title}
                  </h3>
                  <p className="text-gallifrey-teal font-medium text-lg italic mb-4">
                    {element.sanskrit}
                  </p>
                </div>

                {/* Content */}
                <div className="lg:w-2/3 space-y-4">
                  <div className="bg-white rounded-xl p-6 border border-gallifrey-charcoal/10 group-hover:border-gallifrey-teal/30 transition-all duration-300">
                    <h4 className="font-medium text-gallifrey-charcoal mb-3">Ancient Wisdom:</h4>
                    <p className="text-gallifrey-charcoal/80 leading-relaxed mb-4">
                      {element.description}
                    </p>
                    
                    <h4 className="font-medium text-gallifrey-charcoal mb-3">Modern Application:</h4>
                    <p className="text-gallifrey-charcoal/80 leading-relaxed">
                      {element.modernApplication}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assessment CTA */}
        <div className="bg-gradient-to-r from-gallifrey-teal/10 to-gallifrey-teal/5 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <Flower className="w-12 h-12 text-gallifrey-teal mx-auto mb-6" />
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-gallifrey-charcoal mb-4">
              Discover Your Digital Savasthya Score
            </h3>
            <p className="text-lg text-gallifrey-charcoal/70 mb-8 leading-relaxed">
              How rooted are you in your authentic digital self? Our free assessment reveals your platform dependency risks 
              and provides a personalized roadmap to digital wellness and independence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="gallifrey"
                className="px-8 py-3 font-medium"
                onClick={() => handleCTAClick('digital-savasthya-assessment')}
              >
                Get Free Digital Savasthya Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-sm text-gallifrey-charcoal/60">
                Takes 15 minutes • No commitment required
              </p>
            </div>
          </div>
        </div>

        {/* Educational resources */}
        <div className="mt-16 text-center">
          <h3 className="font-heading text-xl font-medium text-gallifrey-charcoal mb-6">
            Learn More About Digital Wellness
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white rounded-lg p-6 border border-gallifrey-charcoal/10">
              <h4 className="font-medium text-gallifrey-charcoal mb-2">Platform Independence Guide</h4>
              <p className="text-gallifrey-charcoal/70">
                Step-by-step roadmap to breaking free from Big Tech dependency and owning your digital presence.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gallifrey-charcoal/10">
              <h4 className="font-medium text-gallifrey-charcoal mb-2">Reputation Protection Protocols</h4>
              <p className="text-gallifrey-charcoal/70">
                Crisis prevention strategies and response frameworks for maintaining authentic digital presence.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gallifrey-charcoal/10">
              <h4 className="font-medium text-gallifrey-charcoal mb-2">Digital Dharma Workbook</h4>
              <p className="text-gallifrey-charcoal/70">
                Practical exercises for aligning your online presence with your authentic values and life purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}