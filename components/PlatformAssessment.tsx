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
      id: 'revenue_dependency',
      question: 'What percentage of your revenue comes through platform-controlled channels?',
      options: [
        { text: '0-25% - I own most of my customer relationships', score: 1 },
        { text: '26-50% - Mixed dependency with some platform risk', score: 3 },
        { text: '51-75% - Heavily dependent on platforms for revenue', score: 6 },
        { text: '76-100% - Almost entirely platform-dependent', score: 10 }
      ]
    },
    {
      id: 'content_ownership',
      question: 'Where is your primary content and audience hosted?',
      options: [
        { text: 'Own website/email list with platform syndication', score: 1 },
        { text: 'Mix of owned and platform content', score: 3 },
        { text: 'Primarily on social platforms with some owned media', score: 6 },
        { text: 'Exclusively on social media platforms', score: 10 }
      ]
    },
    {
      id: 'search_results',
      question: 'When someone Googles your name/business, what do they find?',
      options: [
        { text: 'My own website and positive content I control', score: 1 },
        { text: 'Mix of my content and positive third-party mentions', score: 3 },
        { text: 'Some negative or outdated results mixed with good ones', score: 6 },
        { text: 'Negative, outdated, or inaccurate information dominates', score: 10 }
      ]
    },
    {
      id: 'crisis_preparedness',
      question: 'If a major platform banned you tomorrow, how quickly could you recover?',
      options: [
        { text: 'Immediately - I have direct customer relationships', score: 1 },
        { text: '1-2 weeks - I have backup systems in place', score: 3 },
        { text: '1-3 months - Would need to rebuild relationships', score: 6 },
        { text: '6+ months or never - Would lose most connections', score: 10 }
      ]
    },
    {
      id: 'reputation_monitoring',
      question: 'How often do you monitor your online reputation and digital footprint?',
      options: [
        { text: 'Real-time monitoring with professional tools', score: 1 },
        { text: 'Weekly Google searches and social media checks', score: 3 },
        { text: 'Monthly or when I remember to check', score: 6 },
        { text: 'Rarely or never - I hope for the best', score: 10 }
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
        title: 'Digital Savasthya: Strong Foundation',
        description: 'You have good digital wellness practices and platform independence. Your authentic presence is well-protected.',
        recommendations: [
          'Maintain your current platform independence practices',
          'Consider advanced reputation monitoring for prevention',
          'Share your knowledge to help others achieve digital savasthya'
        ],
        nextStep: {
          title: 'Advanced Digital Protection',
          description: 'Enhance your digital wellness with professional monitoring and crisis prevention.',
          cta: 'Explore Professional Services',
          ctaAction: 'assessment-low-risk-services'
        }
      };
    } else if (percentage <= 50) {
      return {
        score: totalScore,
        level: 'medium', 
        title: 'Digital Dependency Risk Detected',
        description: 'You have moderate platform dependency that could threaten your digital wellness. Time for strategic improvements.',
        recommendations: [
          'Diversify your digital presence away from platform dependency',
          'Build owned media channels (website, email list)',
          'Implement reputation monitoring and protection protocols',
          'Create crisis response plans for platform disruptions'
        ],
        nextStep: {
          title: 'Digital Dharma Analysis',
          description: 'Get a comprehensive audit of your platform dependencies and independence roadmap.',
          cta: 'Book $297 Strategy Session',
          ctaAction: 'assessment-medium-risk-consultation'
        }
      };
    } else if (percentage <= 75) {
      return {
        score: totalScore,
        level: 'high',
        title: 'High Platform Dependency Risk',
        description: 'Your digital wellness is compromised by dangerous platform dependency. Immediate action needed to restore savasthya.',
        recommendations: [
          'Urgent: Begin platform independence strategy immediately',
          'Establish owned media presence (website, email, direct relationships)',
          'Implement comprehensive reputation monitoring',
          'Create emergency communication channels with your audience',
          'Develop crisis response protocols'
        ],
        nextStep: {
          title: 'Digital Savasthya Recovery Program',
          description: 'Emergency consultation to restore your digital wellness and independence.',
          cta: 'Schedule Emergency Consultation',
          ctaAction: 'assessment-high-risk-emergency'
        }
      };
    } else {
      return {
        score: totalScore,
        level: 'critical',
        title: 'Critical Digital Health Emergency',
        description: 'You are in digital platform prison with extreme vulnerability. Your business/reputation could disappear overnight.',
        recommendations: [
          'IMMEDIATE ACTION REQUIRED: You are one algorithm change away from losing everything',
          'Emergency platform independence implementation',
          'Crisis communication strategy with existing audience',
          'Reputation protection and negative content mitigation',
          'Legal preparation for platform disputes'
        ],
        nextStep: {
          title: 'Digital Liberation Emergency Protocol',
          description: 'Immediate intervention required to save your digital presence and business continuity.',
          cta: 'Get Emergency Help Now',
          ctaAction: 'assessment-critical-emergency'
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
                Free Platform Independence Assessment
              </h2>
              <p className="text-lg text-gallifrey-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
                Discover your <em>Digital Savasthya</em> score and platform dependency risks. Like BrandYourself&rsquo;s free scan, 
                but focused on authentic digital wellness and independence.
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
                Start Your Digital Savasthya Assessment
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
                Platform Dependency Score: <span className="font-bold">{result.score}/{questions.length * 10}</span>
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