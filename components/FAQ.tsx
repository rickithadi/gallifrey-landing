import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { useState } from "react";
import { useTranslation } from 'next-i18next';

export function FAQ() {
  const { t } = useTranslation('faq');
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqsData = t('questions', { returnObjects: true });
  const faqs = Array.isArray(faqsData) ? faqsData as Array<{
    question: string;
    answer: string;
  }> : [];

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
              {t('section.label')}
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 id="faq-heading" className="text-3xl md:text-5xl font-heading font-light leading-tight mb-6 text-primary tracking-tight">
            {t('section.title')}
            <span className="italic text-accent font-bold tracking-wide">{t('section.titleHighlight')}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('section.subtitle')}
          </p>
        </div>

        {/* FAQ List */}
        {faqs.length > 0 && (
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
        )}

        {/* Still have questions CTA */}
        <div className="text-center mt-16 p-8 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-heading text-xl font-bold text-primary mb-3 tracking-wide">
            {t('stillHaveQuestions.title')}
          </h3>
          <p className="text-muted-foreground mb-6 tracking-wide leading-relaxed">
            {t('stillHaveQuestions.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              {t('stillHaveQuestions.sendMessage')}
            </button>
            <a
              href="https://calendly.com/rickithadi/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
            >
              {t('stillHaveQuestions.bookConsultation')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}