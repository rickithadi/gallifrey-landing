import { useState, useCallback } from "react";
import { AlertTriangle, CheckCircle, Clock, ArrowRight, Target, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { trackCTAClick } from "@/lib/analytics";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: Array<{
    text: string;
    score: number;
    explanation?: string;
  }>;
}

interface AssessmentResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendations: string[];
  nextStep: {
    title: string;
    description: string;
    cta: string;
    ctaAction: string;
  };
}

export function PlatformAssessment() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>();
  const [currentStep, setCurrentStep] = useState<'intro' | 'assessment' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleCTAClick = useCallback((action: string) => {
    trackCTAClick(action);
  }, []);

  const questions: AssessmentQuestion[] = [
    {
      id: 'infrastructure_management',
      question: 'How much time does your team spend on infrastructure management per week?',
      options: [
        { text: '0-5 hours - Mostly automated with minimal intervention', score: 1 },
        { text: '6-15 hours - Some automation but regular manual tasks', score: 3 },
        { text: '16-30 hours - Significant manual infrastructure work', score: 6 },
        { text: '30+ hours - Constant firefighting and manual operations', score: 10 }
      ]
    },
    {
      id: 'system_reliability',
      question: 'What is your current system uptime and incident frequency?',
      options: [
        { text: '99.9%+ uptime with rare incidents', score: 1 },
        { text: '99.5-99.8% uptime with monthly incidents', score: 3 },
        { text: '99-99.4% uptime with weekly issues', score: 6 },
        { text: 'Below 99% uptime with frequent outages', score: 10 }
      ]
    },
    {
      id: 'security_monitoring',
      question: 'How do you currently handle security monitoring and threat detection?',
      options: [
        { text: 'AI-powered real-time monitoring with automated response', score: 1 },
        { text: 'Automated monitoring with manual threat response', score: 3 },
        { text: 'Basic monitoring tools with delayed manual response', score: 6 },
        { text: 'Manual monitoring or reactive security measures only', score: 10 }
      ]
    },
    {
      id: 'scaling_efficiency',
      question: 'How does your infrastructure handle traffic spikes and resource demands?',
      options: [
        { text: 'Predictive auto-scaling with AI optimization', score: 1 },
        { text: 'Basic auto-scaling with some manual adjustment', score: 3 },
        { text: 'Manual scaling during peak periods', score: 6 },
        { text: 'No auto-scaling - frequent performance issues', score: 10 }
      ]
    },
    {
      id: 'cost_optimization',
      question: 'How optimized are your cloud and infrastructure costs?',
      options: [
        { text: 'AI-optimized with continuous cost reduction', score: 1 },
        { text: 'Regular reviews with some optimization', score: 3 },
        { text: 'Occasional cost reviews with limited optimization', score: 6 },
        { text: 'No cost optimization - paying market rates or higher', score: 10 }
      ]
    }
  ];

  const calculateResults = (): AssessmentResult => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 10;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 25) {
      return {
        score: totalScore,
        level: 'low',
        title: 'Infrastructure Excellence: Strong Foundation',
        description: 'You have excellent infrastructure practices with high automation and optimization. Your systems are well-positioned for AI enhancement.',
        recommendations: [
          'Maintain your current automation and monitoring practices',
          'Consider AI-powered predictive optimization for further efficiency',
          'Explore advanced self-healing capabilities for ultimate autonomy'
        ],
        nextStep: {
          title: 'AI-Powered Infrastructure Enhancement',
          description: 'Take your already strong infrastructure to the next level with AI optimization and self-healing capabilities.',
          cta: 'Explore AI Enhancement Services',
          ctaAction: 'assessment-low-risk-ai-services'
        }
      };
    } else if (percentage <= 50) {
      return {
        score: totalScore,
        level: 'medium', 
        title: 'Infrastructure Optimization Opportunity',
        description: 'You have moderate infrastructure efficiency with significant room for AI-powered improvement and cost reduction.',
        recommendations: [
          'Implement intelligent automation to reduce manual operations',
          'Deploy AI-powered monitoring and predictive maintenance',
          'Optimize resource allocation with machine learning algorithms',
          'Establish self-healing systems for critical infrastructure components'
        ],
        nextStep: {
          title: 'Infrastructure Optimization Analysis',
          description: 'Get a comprehensive audit of your infrastructure with AI optimization roadmap and cost reduction projections.',
          cta: 'Book AI Infrastructure Consultation',
          ctaAction: 'assessment-medium-risk-ai-consultation'
        }
      };
    } else if (percentage <= 75) {
      return {
        score: totalScore,
        level: 'high',
        title: 'High Infrastructure Inefficiency Risk',
        description: 'Your infrastructure operations are consuming significant resources with frequent issues. Immediate AI automation needed to restore efficiency.',
        recommendations: [
          'Urgent: Deploy AI-powered automation to reduce manual operations by 70%',
          'Implement self-healing systems to eliminate frequent outages',
          'Deploy intelligent monitoring with predictive issue prevention',
          'Establish automated scaling and cost optimization systems',
          'Create AI-driven incident response and recovery protocols'
        ],
        nextStep: {
          title: 'Infrastructure Transformation Program',
          description: 'Emergency consultation to transform your infrastructure with AI automation and self-healing systems.',
          cta: 'Schedule Infrastructure Emergency Consultation',
          ctaAction: 'assessment-high-risk-ai-emergency'
        }
      };
    } else {
      return {
        score: totalScore,
        level: 'critical',
        title: 'Critical Infrastructure Crisis',
        description: 'Your infrastructure is in crisis mode with extreme inefficiency and instability. Business continuity is at risk without immediate AI intervention.',
        recommendations: [
          'IMMEDIATE ACTION REQUIRED: Deploy emergency AI automation to prevent total system failure',
          'Emergency implementation of self-healing infrastructure',
          'Crisis response with automated failover and recovery systems',
          'Immediate cost optimization to prevent budget overruns',
          'Deploy 24/7 AI monitoring with human oversight'
        ],
        nextStep: {
          title: 'Infrastructure Crisis Response Protocol',
          description: 'Immediate AI-powered intervention required to stabilize your infrastructure and restore business continuity.',
          cta: 'Get Emergency AI Infrastructure Help',
          ctaAction: 'assessment-critical-ai-emergency'
        }
      };
    }
  };

  const handleAnswerSelect = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
      setCurrentStep('results');
    }
  };

  const resetAssessment = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const result = showResults ? calculateResults() : null;

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'medium': return <Clock className="w-12 h-12 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-12 h-12 text-orange-500" />;
      case 'critical': return <AlertTriangle className="w-12 h-12 text-red-500" />;
      default: return <Target className="w-12 h-12 text-gallifrey-teal" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'from-green-50 to-green-100 border-green-200';
      case 'medium': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'high': return 'from-orange-50 to-orange-100 border-orange-200';
      case 'critical': return 'from-red-50 to-red-100 border-red-200';
      default: return 'from-gallifrey-teal/10 to-gallifrey-teal/5 border-gallifrey-teal/20';
    }
  };

  if (currentStep === 'intro') {
    return (
      <section id="platform-assessment" className="py-20 px-4 bg-gallifrey-white/50" aria-labelledby="assessment-heading">
        <div className="container mx-auto max-w-4xl">
          <div
            ref={headerAnimation.ref}
            className={`text-center animate-fade-up ${headerAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="mb-8">
              <Target className="w-16 h-16 text-gallifrey-teal mx-auto mb-6" />
              <h2 id="assessment-heading" className="text-3xl md:text-4xl font-heading font-bold text-gallifrey-charcoal mb-6">
                Free AI Infrastructure Readiness Assessment
              </h2>
              <p className="text-lg text-gallifrey-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
                Discover your <em>Autonomous Operations</em> potential and infrastructure optimization opportunities. 
                Evaluate how AI can reduce your operational costs by 70% while achieving 99.99% uptime.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gallifrey-charcoal/10 mb-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-gallifrey-teal mx-auto mb-3" />
                  <h3 className="font-medium text-gallifrey-charcoal mb-2">5 Minutes</h3>
                  <p className="text-sm text-gallifrey-charcoal/60">Quick assessment</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-gallifrey-teal mx-auto mb-3" />
                  <h3 className="font-medium text-gallifrey-charcoal mb-2">Private & Secure</h3>
                  <p className="text-sm text-gallifrey-charcoal/60">No data collection</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-gallifrey-teal mx-auto mb-3" />
                  <h3 className="font-medium text-gallifrey-charcoal mb-2">Instant Results</h3>
                  <p className="text-sm text-gallifrey-charcoal/60">Immediate analysis</p>
                </div>
              </div>

              <Button
                size="lg"
                variant="gallifrey"
                className="px-8 py-3 font-medium"
                onClick={() => {
                  setCurrentStep('assessment');
                  handleCTAClick('platform-assessment-start');
                }}
              >
                Start Your AI Infrastructure Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-sm text-gallifrey-charcoal/60 mt-4">
                No email required • Takes 5 minutes • Instant results
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === 'assessment' && !showResults) {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <section className="py-20 px-4 bg-gallifrey-white/50">
        <div className="container mx-auto max-w-3xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gallifrey-charcoal/60">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm text-gallifrey-charcoal/60">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gallifrey-charcoal/10 rounded-full h-2">
              <div 
                className="bg-gallifrey-teal rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gallifrey-charcoal/10">
            <h3 className="text-2xl font-heading font-medium text-gallifrey-charcoal mb-8 leading-tight">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, option.score)}
                  className="w-full text-left p-4 md:p-4 sm:p-6 rounded-xl border-2 border-gallifrey-charcoal/10 hover:border-gallifrey-teal active:border-gallifrey-teal hover:bg-gallifrey-teal/5 active:bg-gallifrey-teal/10 transition-all duration-200 group touch-manipulation min-h-[60px] flex items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gallifrey-charcoal group-hover:text-gallifrey-charcoal font-medium text-sm md:text-base leading-snug pr-4">
                      {option.text}
                    </span>
                    <ArrowRight className="w-5 h-5 md:w-4 md:h-4 text-gallifrey-charcoal/40 group-hover:text-gallifrey-teal flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === 'results' && result) {
    return (
      <section className="py-20 px-4 bg-gallifrey-white/50">
        <div className="container mx-auto max-w-4xl">
          {/* Results header */}
          <div className={`bg-gradient-to-r ${getRiskColor(result.level)} rounded-2xl p-8 mb-8 border-2`}>
            <div className="text-center mb-6">
              {getRiskIcon(result.level)}
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gallifrey-charcoal mt-4 mb-2">
                {result.title}
              </h2>
              <p className="text-lg text-gallifrey-charcoal/80">
                Infrastructure Efficiency Score: <span className="font-bold">{result.score}/{questions.length * 10}</span>
              </p>
            </div>

            <p className="text-gallifrey-charcoal/80 leading-relaxed text-center max-w-2xl mx-auto">
              {result.description}
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gallifrey-charcoal/10 mb-8">
            <h3 className="text-xl font-heading font-medium text-gallifrey-charcoal mb-6">
              Recommended Actions:
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gallifrey-teal mt-0.5 flex-shrink-0" />
                  <span className="text-gallifrey-charcoal/80">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-gallifrey-teal/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-heading font-medium text-gallifrey-charcoal mb-4">
              {result.nextStep.title}
            </h3>
            <p className="text-gallifrey-charcoal/80 mb-6 max-w-2xl mx-auto">
              {result.nextStep.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="gallifrey"
                className="px-8 py-3 font-medium"
                onClick={() => handleCTAClick(result.nextStep.ctaAction)}
              >
                {result.nextStep.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 border-gallifrey-charcoal/20"
                onClick={resetAssessment}
              >
                Take Assessment Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}