import { ArrowRight, BarChart3, DollarSign, Shield, TrendingUp, Users } from "lucide-react";
import { GetStaticProps } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NextSeo } from 'next-seo';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
    icon: JSX.Element;
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  tags: string[];
  slug: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Digital Sovereignty Transformation for Legal Practice',
    client: 'Rodriguez Legal Partners',
    industry: 'Legal Services',
    challenge: 'A growing legal practice needed complete data sovereignty to meet client confidentiality requirements while scaling operations efficiently. Their existing cloud-dependent infrastructure created compliance risks and operational vulnerabilities.',
    solution: 'Implemented comprehensive digital sovereignty architecture including private cloud infrastructure, zero-trust security framework, custom client portal with end-to-end encryption, and platform-independent communication systems. Established data governance protocols exceeding Australian legal industry standards.',
    results: [
      {
        metric: 'Operational Efficiency',
        value: '40%',
        description: 'Increase in case processing speed',
        icon: <TrendingUp className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Security Incidents',
        value: '0',
        description: 'Zero breaches in 18 months',
        icon: <Shield className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Client Satisfaction',
        value: '98%',
        description: 'Retention rate improvement',
        icon: <Users className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Revenue Growth',
        value: '65%',
        description: 'Annual revenue increase',
        icon: <DollarSign className="w-6 h-6 text-accent" />
      }
    ],
    testimonial: {
      quote: \"Their approach to digital sovereignty gave us complete control over our client data. The custom dashboard they built increased our operational efficiency by 40% while ensuring absolute confidentiality.\",
      author: 'Michael Rodriguez',
      role: 'Managing Partner, Rodriguez Legal'
    },
    tags: ['Digital Sovereignty', 'Legal Tech', 'Data Security', 'Custom Development'],
    slug: 'rodriguez-legal-digital-sovereignty'
  },
  {
    id: '2',
    title: 'Enterprise Security Infrastructure for Fintech Startup',
    client: 'TechFlow Financial Solutions',
    industry: 'Financial Technology',
    challenge: 'A Melbourne fintech startup required enterprise-grade security infrastructure to handle sensitive financial data while maintaining startup agility and cost efficiency. Regulatory compliance and investor confidence were critical for Series A funding.',
    solution: 'Designed and implemented zero-trust security architecture with automated compliance monitoring, real-time threat detection, encrypted data pipelines, and disaster recovery systems. Built scalable infrastructure supporting 10x growth without security compromises.',
    results: [
      {
        metric: 'Security Uptime',
        value: '99.99%',
        description: 'System availability maintained',
        icon: <Shield className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Compliance Score',
        value: '100%',
        description: 'Regulatory audit results',
        icon: <BarChart3 className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Funding Secured',
        value: '$12M',
        description: 'Series A investment raised',
        icon: <DollarSign className="w-6 h-6 text-accent" />
      },
      {
        metric: 'User Growth',
        value: '850%',
        description: 'Platform user increase',
        icon: <TrendingUp className="w-6 h-6 text-accent" />
      }
    ],
    testimonial: {
      quote: \"Gallifrey transformed our digital infrastructure completely. The security improvements alone saved us from a potential breach that could have cost millions. Their expertise was crucial for our Series A success.\",
      author: 'Sarah Chen',
      role: 'CEO, TechFlow Financial Solutions'
    },
    tags: ['Fintech', 'Enterprise Security', 'Compliance', 'Scalable Architecture'],
    slug: 'techflow-fintech-security-infrastructure'
  },
  {
    id: '3',
    title: 'Platform Independence Strategy for Creative Agency',
    client: 'Lifestyle Brand Collective',
    industry: 'Creative Services',
    challenge: 'A successful creative agency was heavily dependent on social media platforms for client acquisition and project delivery. Algorithm changes and platform policies were threatening business stability and client relationships.',
    solution: 'Developed comprehensive platform independence strategy including custom client portal, direct communication channels, owned content distribution system, and independent payment processing. Created proprietary project management and client onboarding systems.',
    results: [
      {
        metric: 'Client Retention',
        value: '95%',
        description: 'Improved retention rate',
        icon: <Users className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Revenue Stability',
        value: '300%',
        description: 'Increase in predictable revenue',
        icon: <DollarSign className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Platform Risk',
        value: '-80%',
        description: 'Reduction in platform dependency',
        icon: <Shield className="w-6 h-6 text-accent" />
      },
      {
        metric: 'Conversion Rate',
        value: '180%',
        description: 'Website conversion improvement',
        icon: <TrendingUp className="w-6 h-6 text-accent" />
      }
    ],
    testimonial: {
      quote: \"Working with Gallifrey was like having a dedicated CTO. They didn't just build our website – they architected our entire digital presence with military precision. Platform independence gave us our business back.\",
      author: 'Emma Thompson',
      role: 'Creative Director, Lifestyle Brand Collective'
    },
    tags: ['Platform Independence', 'Creative Industry', 'Digital Strategy', 'Custom Systems'],
    slug: 'lifestyle-brand-platform-independence'
  }
];

interface CaseStudiesPageProps {
  studies: CaseStudy[];
}

export default function CaseStudiesPage({ studies }: CaseStudiesPageProps) {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();

  return (
    <>
      <NextSeo
        title="Case Studies | Proven Results in Digital Sovereignty & Security"
        description="Real-world results from our digital sovereignty and enterprise security implementations. See how Australian businesses achieved platform independence and competitive advantages."
        canonical="https://gallifrey.consulting/case-studies"
        openGraph={{
          url: 'https://gallifrey.consulting/case-studies',
          title: 'Case Studies | Proven Results in Digital Sovereignty & Security',
          description: 'Real-world results from our digital sovereignty and enterprise security implementations.',
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
                Client Success Stories
              </p>
              <div className="w-12 h-px bg-accent mx-auto"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary">
              Proven Results in
              <span className="italic text-accent"> Digital Transformation</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real-world outcomes from our strategic partnerships with Australian businesses. 
              Each engagement demonstrates measurable improvements in security, efficiency, and competitive positioning.
            </p>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-20">
              {studies.map((study, index) => (
                <article 
                  key={study.id}
                  className="border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm overflow-hidden"
                >
                  <div className="p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {study.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-serif font-medium leading-tight mb-3 text-primary">
                        {study.title}
                      </h2>
                      <p className="text-muted-foreground">
                        <span className="font-medium">{study.client}</span> • {study.industry}
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                      {/* Challenge & Solution */}
                      <div className="space-y-8">
                        <div>
                          <h3 className="font-medium text-primary mb-3">The Challenge</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {study.challenge}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-primary mb-3">Our Solution</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {study.solution}
                          </p>
                        </div>
                      </div>

                      {/* Results */}
                      <div>
                        <h3 className="font-medium text-primary mb-6">Measurable Results</h3>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                          {study.results.map((result, idx) => (
                            <div key={idx} className="text-center p-4 bg-background/50 rounded-lg">
                              <div className="flex justify-center mb-3">
                                {result.icon}
                              </div>
                              <div className="text-2xl font-bold text-accent mb-1">
                                {result.value}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {result.description}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Testimonial */}
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                          <p className="text-muted-foreground italic leading-relaxed mb-4">
                            "{study.testimonial.quote}"
                          </p>
                          <div>
                            <div className="font-medium text-primary text-sm">
                              {study.testimonial.author}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {study.testimonial.role}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center p-8 bg-accent/5 border border-accent/20 rounded-lg max-w-3xl mx-auto">
              <h3 className="font-serif text-xl font-medium text-primary mb-3">
                Ready to Transform Your Digital Infrastructure?
              </h3>
              <p className="text-muted-foreground mb-6">
                Schedule a strategic discovery call to discuss how we can help achieve similar results for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://calendly.com/rickithadi/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Schedule Discovery Call
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Discuss Your Requirements
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      studies: caseStudies,
    },
  };
};