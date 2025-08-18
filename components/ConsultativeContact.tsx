import { ArrowRight, Calendar, CheckCircle, MapPin, Shield, Target, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

interface FormData {
  projectType: string;
  businessStage: string;
  timeline: string;
  budget: string;
  primaryConcerns: string[];
  name: string;
  email: string;
  company: string;
  phone: string;
  additionalContext: string;
}

export function ConsultativeContact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    businessStage: '',
    timeline: '',
    budget: '',
    primaryConcerns: [],
    name: '',
    email: '',
    company: '',
    phone: '',
    additionalContext: ''
  });

  const headerAnimation = useScrollAnimation<HTMLDivElement>();

  const projectTypes = [
    {
      id: 'digital-sovereignty',
      title: 'Digital Sovereignty & Platform Independence',
      description: 'Reduce platform dependencies and establish data control',
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'security-architecture',
      title: 'Enterprise Security Architecture',
      description: 'Zero-trust implementation and compliance frameworks',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'strategic-consultation',
      title: 'Strategic Digital Consultation',
      description: 'Comprehensive digital strategy and competitive positioning',
      icon: <Users className="w-6 h-6" />
    }
  ];

  const businessStages = [
    { id: 'startup', label: 'Startup (Pre-Series A)', description: 'Building foundations for scale' },
    { id: 'growth', label: 'Growth Stage (Series A-B)', description: 'Scaling operations and security' },
    { id: 'established', label: 'Established Business', description: 'Optimizing mature operations' },
    { id: 'enterprise', label: 'Enterprise', description: 'Complex infrastructure requirements' }
  ];

  const timelines = [
    { id: 'immediate', label: 'Immediate (1-2 weeks)', description: 'Urgent security or compliance needs' },
    { id: 'planned', label: 'Planned (1-3 months)', description: 'Strategic initiative with defined timeline' },
    { id: 'exploratory', label: 'Exploratory (3-6 months)', description: 'Evaluating options and approaches' },
    { id: 'long-term', label: 'Long-term Partnership', description: 'Ongoing strategic relationship' }
  ];

  const budgetRanges = [
    { id: 'foundation', label: 'Foundation Investment', range: 'Four-figure engagement', description: 'Focused solutions for specific challenges' },
    { id: 'professional', label: 'Professional Investment', range: 'Mid four to low five-figure', description: 'Comprehensive strategic implementations' },
    { id: 'enterprise', label: 'Enterprise Investment', range: 'Five-figure and above', description: 'Large-scale transformations and ongoing partnerships' },
    { id: 'discussion', label: 'Requires Discussion', range: 'Custom scoping needed', description: 'Complex requirements requiring detailed analysis' }
  ];

  const concerns = [
    'Data security and privacy compliance',
    'Platform dependency risks',
    'Scalability and performance',
    'Regulatory compliance (GDPR, etc.)',
    'Digital transformation strategy',
    'Competitive positioning',
    'Cost optimization',
    'Technical debt and legacy systems'
  ];

  const handleConcernToggle = (concern: string) => {
    const updated = formData.primaryConcerns.includes(concern)
      ? formData.primaryConcerns.filter(c => c !== concern)
      : [...formData.primaryConcerns, concern];
    
    setFormData(prev => ({
      ...prev,
      primaryConcerns: updated
    }));
  };

  const handleSubmit = async () => {
    // In a real implementation, this would submit to your CRM/email service
    console.log('Strategic consultation request:', formData);
    
    // Redirect to Calendly with pre-filled information
    const calendlyUrl = `https://calendly.com/rickithadi/strategic-discovery?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`;
    window.open(calendlyUrl, '_blank');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-serif font-medium text-primary mb-2">
                What type of engagement are you considering?
              </h3>
              <p className="text-muted-foreground">
                This helps us prepare the most relevant strategic discussion for your needs.
              </p>
            </div>
            
            <div className="grid gap-4">
              {projectTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.projectType === type.id ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, projectType: type.id }))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-accent">
                        {type.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-primary mb-1">{type.title}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-serif font-medium text-primary mb-2">
                What stage is your business at?
              </h3>
              <p className="text-muted-foreground">
                Understanding your business maturity helps us tailor our strategic approach.
              </p>
            </div>
            
            <div className="grid gap-3">
              {businessStages.map((stage) => (
                <Card
                  key={stage.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.businessStage === stage.id ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, businessStage: stage.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-primary">{stage.label}</h4>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                      </div>
                      {formData.businessStage === stage.id && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-serif font-medium text-primary mb-2">
                What&apos;s your implementation timeline?
              </h3>
              <p className="text-muted-foreground">
                Timeline influences our strategic recommendations and engagement structure.
              </p>
            </div>
            
            <div className="grid gap-3">
              {timelines.map((timeline) => (
                <Card
                  key={timeline.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.timeline === timeline.id ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, timeline: timeline.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-primary">{timeline.label}</h4>
                        <p className="text-sm text-muted-foreground">{timeline.description}</p>
                      </div>
                      {formData.timeline === timeline.id && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-serif font-medium text-primary mb-2">
                Investment range for this engagement?
              </h3>
              <p className="text-muted-foreground">
                Understanding your investment parameters helps us recommend appropriate solutions.
              </p>
            </div>
            
            <div className="grid gap-3">
              {budgetRanges.map((budget) => (
                <Card
                  key={budget.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.budget === budget.id ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-primary">{budget.label}</h4>
                        <p className="text-sm text-accent font-medium mb-1">{budget.range}</p>
                        <p className="text-sm text-muted-foreground">{budget.description}</p>
                      </div>
                      {formData.budget === budget.id && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-serif font-medium text-primary mb-2">
                What are your primary strategic concerns?
              </h3>
              <p className="text-muted-foreground">
                Select all that apply. This helps us prepare relevant case studies and solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {concerns.map((concern) => (
                <Card
                  key={concern}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.primaryConcerns.includes(concern) ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                  onClick={() => handleConcernToggle(concern)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary">{concern}</span>
                      {formData.primaryConcerns.includes(concern) && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-serif font-medium text-primary mb-2">
                Let&apos;s schedule your strategic discovery call
              </h3>
              <p className="text-muted-foreground">
                We&apos;ll use this information to prepare a tailored discussion about your digital strategy needs.
              </p>
            </div>
            
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="+61 xxx xxx xxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Additional Context</label>
                <textarea
                  value={formData.additionalContext}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                  className="w-full px-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:border-accent"
                  rows={3}
                  placeholder="Any additional context that would help us prepare for our strategic discussion..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.projectType;
      case 2: return !!formData.businessStage;
      case 3: return !!formData.timeline;
      case 4: return !!formData.budget;
      case 5: return formData.primaryConcerns.length > 0;
      case 6: return !!(formData.name && formData.email);
      default: return false;
    }
  };

  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-br from-secondary/10 to-background">
      <div className="container mx-auto max-w-4xl">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase mb-4">
              Strategic Partnership
            </p>
            <div className="w-12 h-px bg-accent mx-auto"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-primary">
            Start Your Strategic
            <span className="italic text-accent"> Digital Transformation</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every engagement begins with understanding your unique challenges and strategic objectives. 
            Let&apos;s explore how digital sovereignty and enterprise security can strengthen your competitive position.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {step} of 6
                </span>
                <span className="text-sm text-accent">
                  Strategic Discovery Process
                </span>
              </div>
              <div className="w-full bg-border/30 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>

            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-6"
              >
                Previous
              </Button>

              {step < 6 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="px-6"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="px-6 bg-accent hover:bg-accent/90"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Discovery Call
                </Button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-border/30">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Melbourne-based
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Confidential & Secure
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Strategic Partnership
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}