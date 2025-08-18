import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NextSeo } from 'next-seo';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Digital Sovereignty for Australian Businesses: Beyond the Buzzword',
    excerpt: 'As international data regulations tighten and platform dependencies increase, Australian businesses must prioritize digital sovereignty to maintain competitive advantage and regulatory compliance.',
    content: `Digital sovereignty has evolved from a government concern to a critical business imperative. For Australian businesses, this means taking control of your digital infrastructure, data, and platform dependencies before they become strategic vulnerabilities.

**The Hidden Costs of Platform Dependency**

Every business using third-party platforms—from social media for marketing to cloud services for operations—faces an invisible tax: dependency risk. When platforms change algorithms, pricing, or terms of service, your business adapts or suffers.

Recent examples include sudden API pricing changes affecting businesses' core operations, algorithm updates devastating marketing reach, and platform acquisitions fundamentally altering service offerings.

**Building Platform-Independent Infrastructure**

Digital sovereignty begins with audit: What happens if your primary platforms disappeared tomorrow? Your website, customer data, payment processing, and communication systems should remain functional.

Key strategies include:
- Custom domain and hosting control
- Data portability and backup systems  
- Alternative communication channels
- Independent payment processing
- Owned content distribution

**The Australian Advantage**

Australia's privacy laws and data sovereignty requirements actually provide competitive advantages for businesses that embrace them proactively. Rather than viewing compliance as a burden, forward-thinking companies use privacy-by-design as a market differentiator.

Companies demonstrating robust data governance and platform independence increasingly win contracts with privacy-conscious clients and government entities.

**Implementation Strategy**

Start with your most critical dependencies. Map every external service your business relies on, assess switching costs, and prioritize independence for mission-critical functions.

Digital sovereignty isn't about eliminating all third-party services—it's about ensuring you control the decisions that affect your business future.`,
    author: 'Strategy Team',
    publishedAt: '2024-12-15',
    readTime: '8 min read',
    category: 'Digital Strategy',
    slug: 'digital-sovereignty-australian-businesses'
  },
  {
    id: '2', 
    title: 'Enterprise Security Architecture: Zero-Trust Implementation for SMEs',
    excerpt: 'Small and medium enterprises can implement enterprise-grade zero-trust security without enterprise budgets. Here\'s how to build security that scales with your business.',
    content: `Zero-trust security architecture isn't just for Fortune 500 companies. Australian SMEs can implement enterprise-grade security frameworks that protect against modern threats while remaining cost-effective and scalable.

**Understanding Zero-Trust Principles**

Zero-trust operates on the principle of "never trust, always verify." Unlike traditional perimeter-based security, zero-trust assumes no implicit trust for any user, device, or network location.

For SMEs, this translates to:
- Identity verification for every access request
- Least privilege access controls
- Continuous monitoring and validation
- Micro-segmentation of network resources
- Data encryption at rest and in transit

**SME-Appropriate Implementation**

Many zero-trust implementations focus on large enterprises with dedicated security teams. SMEs need practical approaches that provide maximum security with minimal operational overhead.

Start with identity and access management (IAM). Multi-factor authentication across all business systems provides immediate zero-trust benefits. Modern IAM solutions integrate seamlessly with existing tools without requiring infrastructure overhauls.

Next, implement endpoint protection that monitors device behavior rather than relying on perimeter defenses. This protects remote workers and bring-your-own-device scenarios increasingly common in SME environments.

**Cost-Effective Technology Stack**

Cloud-native security services often provide the most cost-effective zero-trust implementations for SMEs. Rather than purchasing and maintaining security appliances, cloud services offer enterprise capabilities with operational simplicity.

Key components include:
- Cloud-based IAM with conditional access
- Endpoint detection and response (EDR)
- Secure web gateways
- Data loss prevention (DLP)
- Security information and event management (SIEM)

**Measuring Security ROI**

Zero-trust security provides measurable business value beyond risk reduction. Automated compliance reporting, reduced incident response costs, and improved customer trust translate to tangible benefits.

Many SMEs discover that comprehensive security frameworks actually reduce operational costs by preventing expensive security incidents and streamlining compliance processes.

**Implementation Roadmap**

Begin with a security assessment to identify current vulnerabilities and compliance requirements. Prioritize quick wins like MFA and endpoint protection, then gradually implement network segmentation and advanced monitoring.

The goal is building security that grows with your business rather than requiring wholesale replacement as you scale.`,
    author: 'Security Practice',
    publishedAt: '2024-12-01',
    readTime: '12 min read',
    category: 'Security',
    slug: 'zero-trust-implementation-smes'
  },
  {
    id: '3',
    title: 'Platform Independence: Building Antifragile Digital Infrastructure',
    excerpt: 'Beyond resilience lies antifragility—digital infrastructure that grows stronger under stress. Learn how platform independence creates competitive advantages in uncertain markets.',
    content: `Resilient systems survive disruption. Antifragile systems thrive because of it. For businesses building digital infrastructure, the difference determines whether market changes create opportunities or existential threats.

**From Fragile to Antifragile**

Most business digital infrastructure is fragile—dependent on external platforms, vendors, and services that can change without warning. Resilient infrastructure includes backups and redundancies. Antifragile infrastructure improves its position when others face disruption.

Platform independence enables antifragility by ensuring your business benefits when competitors struggle with platform changes, vendor issues, or market shifts.

**Strategic Platform Selection**

Not all platforms are created equal. Some enhance your strategic position while others create dependencies. The key is distinguishing between tools that increase your capabilities and platforms that substitute for your capabilities.

Use platforms that amplify your strengths without replacing your core competencies. Cloud infrastructure that increases your technical capabilities differs fundamentally from social platforms that mediate your customer relationships.

**Building Switching Power**

Antifragile businesses maintain switching power—the ability to change vendors, platforms, or strategies without existential risk. This requires:

- Data portability across all systems
- Standard formats and open architectures  
- Multiple vendor relationships
- Internal capability development
- Alternative distribution channels

**The Compound Benefits**

Platform independence creates compound advantages. Each independent capability increases your options, which increases your negotiating power, which improves your terms with all vendors.

Businesses with switching power receive better pricing, more responsive support, and earlier access to new capabilities because vendors recognize they must compete for the relationship.

**Implementation Strategy**

Start by auditing your current platform dependencies. Identify single points of failure where vendor changes could significantly impact your business.

Prioritize building independence in areas where vendor lock-in is highest and switching costs are increasing. Customer data, communication channels, and core business processes typically provide the highest independence value.

The goal isn't eliminating all external services—it's ensuring you maintain strategic control over your business destiny regardless of external changes.`,
    author: 'Strategic Consulting',
    publishedAt: '2024-11-18',
    readTime: '10 min read',
    category: 'Business Strategy',
    slug: 'platform-independence-antifragile-infrastructure'
  }
];

interface InsightsPageProps {
  posts: BlogPost[];
}

export default function InsightsPage({ posts }: InsightsPageProps) {
  return (
    <>
      <NextSeo
        title="Strategic Insights | Digital Sovereignty & Enterprise Security"
        description="Expert insights on digital sovereignty, enterprise security, and platform independence for Australian businesses. Strategic thinking for the modern digital landscape."
        canonical="https://gallifrey.consulting/insights"
        openGraph={{
          url: 'https://gallifrey.consulting/insights',
          title: 'Strategic Insights | Digital Sovereignty & Enterprise Security',
          description: 'Expert insights on digital sovereignty, enterprise security, and platform independence for Australian businesses.',
        }}
      />
      
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
                Strategic Insights
              </p>
              <div className="w-12 h-px bg-accent mx-auto"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary">
              Thought Leadership in
              <span className="italic text-accent"> Digital Strategy</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Strategic insights on digital sovereignty, enterprise security, and platform independence 
              for Australian businesses navigating the modern digital landscape.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {posts.map((post) => (
                <article 
                  key={post.id}
                  className="group border border-border/50 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-card/30 backdrop-blur-sm"
                >
                  <div className="mb-4">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-serif font-medium leading-tight mb-4 text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-AU')}</span>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center text-accent font-medium hover:gap-2 transition-all duration-200">
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </article>
              ))}
            </div>
            
            {/* Newsletter CTA */}
            <div className="mt-20 text-center p-8 bg-accent/5 border border-accent/20 rounded-lg max-w-3xl mx-auto">
              <h3 className="font-serif text-xl font-medium text-primary mb-3">
                Strategic Insights Delivered
              </h3>
              <p className="text-muted-foreground mb-6">
                Quarterly strategic analysis on digital sovereignty, enterprise security, and platform independence trends affecting Australian businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="px-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:border-accent"
                />
                <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                No spam. Quarterly insights only. Unsubscribe anytime.
              </p>
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
      posts: blogPosts,
    },
  };
};