import { useState, useEffect } from 'react';
import { Search, Star, MapPin, ArrowRight } from 'lucide-react';

const searchScenarios = [
  {
    query: "dentist brunswick melbourne",
    business: "Heritage Dental Practice",
    results: [
      {
        type: "poor",
        title: "Find a Dentist Near You | 1300SMILES",
        url: "1300smiles.com.au",
        description: "Book online with Australia's leading dental franchise...",
        isAd: true
      },
      {
        type: "poor", 
        title: "Dental Care Australia - Emergency Dentist",
        url: "dentalcareaustralia.com.au",
        description: "24/7 emergency dental services...",
        isAd: true
      },
      {
        type: "good",
        title: "Heritage Dental Practice - Brunswick | Premium Family Dentistry",
        url: "heritagedentalbrunswick.com.au",
        description: "Award-winning family dental practice in Brunswick. Gentle, professional care with 15+ years experience.",
        rating: 4.9,
        reviews: 127,
        location: "Brunswick, VIC"
      }
    ]
  },
  {
    query: "electrician footscray melbourne",
    business: "Bright Spark Electrical", 
    results: [
      {
        type: "poor",
        title: "Local Electrician Directory - Find Trades Near You",
        url: "hipages.com.au",
        description: "Compare quotes from local electricians...",
        isAd: true
      },
      {
        type: "poor",
        title: "Emergency Electrician Melbourne - 24/7 Service",
        url: "emergencyelectrician.com.au", 
        description: "Fast response times. No call out fees...",
        isAd: true
      },
      {
        type: "good",
        title: "Bright Spark Electrical - Licensed Electrician Footscray",
        url: "brightsparkelectrical.com.au",
        description: "Master electrician with 20+ years experience. Residential & commercial services. Family owned, fully insured.",
        rating: 5.0,
        reviews: 89,
        location: "Footscray, VIC"
      }
    ]
  },
  {
    query: "law firm collingwood melbourne", 
    business: "Smith & Partners Law",
    results: [
      {
        type: "poor",
        title: "Find a Lawyer | LawInstitute Directory", 
        url: "lawinstitutefind.com.au",
        description: "Search our directory of legal professionals...",
        isAd: false
      },
      {
        type: "poor",
        title: "Legal Aid Victoria - Free Legal Help",
        url: "legalaid.vic.gov.au",
        description: "Get free or low-cost legal help...",
        isAd: false
      },
      {
        type: "good", 
        title: "Smith & Partners Law - Collingwood Legal Experts",
        url: "smithpartnerslaw.com.au",
        description: "Boutique law firm specializing in corporate law and litigation. 25 years serving Melbourne's inner suburbs.",
        rating: 4.8,
        reviews: 203,
        location: "Collingwood, VIC"
      }
    ]
  }
];

export function GoogleSearchSplitLayout() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'searching' | 'found' | 'chosen'>('searching');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Start initial typing
    typeQuery(searchScenarios[0].query);

    // Set up interval for changing scenarios
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setShowResults(false);
      setTimeout(() => {
        const nextScenario = (currentScenario + 1) % searchScenarios.length;
        setCurrentScenario(nextScenario);
        setIsTransitioning(false);
        // Type new query after transition
        setTimeout(() => {
          typeQuery(searchScenarios[nextScenario].query);
        }, 300);
      }, 500);
    }, 8000); // Longer cycle to accommodate slower typing and phase progression

    return () => clearInterval(interval);
  }, [currentScenario]);

  const typeQuery = (query: string) => {
    setTypedQuery('');
    setIsTyping(true);
    setShowResults(false);
    setCurrentPhase('searching');
    
    // If reduced motion is preferred, show final state immediately
    if (prefersReducedMotion) {
      setTypedQuery(query);
      setIsTyping(false);
      setCurrentPhase('found');
      setShowResults(true);
      setTimeout(() => setCurrentPhase('chosen'), 100);
      return;
    }
    
    let i = 0;
    const typeNextChar = () => {
      if (i <= query.length) {
        setTypedQuery(query.slice(0, i));
        i++;
        
        // Slower, more consistent typing speed to prevent stuttering
        let delay = 120 + Math.random() * 30; // 120-150ms base speed (much slower)
        
        // Add pauses after spaces (like real typing)
        if (i > 0 && query[i - 1] === ' ') {
          delay += 80; // Fixed 80ms pause after spaces (no randomness)
        }
        
        // Slight pause before starting a new word
        if (i > 1 && query[i - 2] === ' ') {
          delay += 40; // Fixed 40ms pause before new words
        }
        
        // Reduce hesitation frequency and make it less random
        if (Math.random() < 0.05 && i > 5) { // 5% chance, only after a few chars
          delay += 150; // Fixed 150ms hesitation
        }
        
        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        
        // Sequential phase progression like Google Ads (more predictable timing)
        setTimeout(() => {
          setCurrentPhase('found');
          setShowResults(true);
        }, 400); // Slightly longer pause for smoother transition
        
        // Move to "chosen" phase after results are shown
        setTimeout(() => {
          setCurrentPhase('chosen');
        }, 2000); // Longer pause to let users absorb results
      }
    };
    
    // Start typing with fixed initial delay for smooth performance
    const initialDelay = 200 + (currentScenario * 30); // More predictable, less random
    setTimeout(typeNextChar, initialDelay);
  };

  const scenario = searchScenarios[currentScenario];

  // Dynamic headlines based on phase (Google Ads style)
  const getPhaseHeadlines = () => {
    switch (currentPhase) {
      case 'searching':
        return {
          primary: "Your customers are searching...",
          secondary: "What will they find?"
        };
      case 'found':
        return {
          primary: "They found you!",
          secondary: "Professional results build trust"
        };
      case 'chosen':
        return {
          primary: "They chose you.",
          secondary: "Professional websites win customers"
        };
      default:
        return {
          primary: "Your customers are searching...",
          secondary: "What will they find?"
        };
    }
  };

  const headlines = getPhaseHeadlines();

  return (
    <div className="max-w-6xl mx-auto my-8 md:my-12 px-4">
      <div className={`google-search-animation bg-white rounded-xl shadow-oyn-lg overflow-hidden transition-all duration-500 ${
        isTransitioning ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
      }`}>
        
        <div className="grid md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
          {/* Left Side - Search Process */}
          <div className="bg-gradient-to-br from-blue-50 via-oyn-orange-50 to-oyn-stone-100 p-6 md:p-10 flex flex-col justify-center">
            {/* Dynamic Header Content */}
            <div className="text-center mb-6 md:mb-8">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-3 md:mb-4">Google</div>
              <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <div className="transition-all duration-700 ease-out">
                  <p className="text-gray-800 text-lg md:text-xl lg:text-2xl font-semibold">
                    {headlines.primary}
                  </p>
                </div>
                <div className="transition-all duration-700 ease-out delay-100">
                  <p className="text-oyn-orange-600 text-base md:text-lg font-medium">
                    {headlines.secondary}
                  </p>
                </div>
              </div>
              
              {/* Dynamic Messaging Based on Phase */}
              <div className="bg-white p-4 rounded-lg shadow-oyn border border-oyn-orange-200 mb-6 transition-all duration-500">
                {currentPhase === 'searching' && (
                  <p className="text-oyn-stone-700 text-sm">
                    <span className="font-semibold text-oyn-orange-600">Right now</span>, someone is searching for your services...
                  </p>
                )}
                {currentPhase === 'found' && (
                  <p className="text-oyn-stone-700 text-sm">
                    <span className="font-semibold text-green-600">Found!</span> Professional businesses appear first in results.
                  </p>
                )}
                {currentPhase === 'chosen' && (
                  <p className="text-oyn-stone-700 text-sm">
                    <span className="font-semibold text-blue-600">Winner.</span> Customers trust and choose the top result.
                  </p>
                )}
              </div>
            </div>
            
            {/* Large Search Bar */}
            <div className="relative mb-6 md:mb-8">
              <Search className="absolute left-3 md:left-5 top-3 md:top-5 w-5 md:w-6 h-5 md:h-6 text-gray-400" />
              <input
                type="text"
                value={typedQuery}
                readOnly
                className="w-full pl-10 md:pl-14 pr-3 md:pr-5 py-3 md:py-5 text-lg md:text-xl border-2 border-gray-300 rounded-xl text-gray-700 bg-white shadow-lg focus:border-blue-500 transition-colors"
                placeholder="Search Google..."
              />
              {isTyping && (
                <div className="absolute right-3 md:right-5 top-3 md:top-5">
                  <div className="w-0.5 md:w-1 h-5 md:h-7 bg-blue-500 rounded animate-cursor-blink"></div>
                </div>
              )}
            </div>
            
            {/* Enhanced Business Info with Value Messaging */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-oyn border border-oyn-stone-200">
              <div className="text-xs md:text-sm text-oyn-stone-500 mb-2">Business being searched:</div>
              <div className="font-bold text-lg md:text-xl text-oyn-stone-800 mb-1">{scenario.business}</div>
              <div className="text-oyn-orange-600 font-medium mb-3 text-sm md:text-base">{scenario.results.find(r => r.type === 'good')?.location}</div>
              
              {showResults && (
                <div className="pt-3 border-t border-oyn-stone-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs md:text-sm font-semibold text-green-700">APPEARS FIRST</span>
                  </div>
                  <p className="text-xs text-oyn-stone-600">
                    Professional website + authority positioning = customers choose them over competitors
                  </p>
                </div>
              )}
            </div>
            
            {/* Phase-aware Key Message & CTA */}
            <div className="mt-4 md:mt-6 text-center transition-all duration-700">
              {currentPhase === 'searching' && (
                <div className="opacity-60">
                  <p className="text-sm text-oyn-stone-600">
                    Every day, customers search for your services...
                  </p>
                </div>
              )}
              
              {currentPhase === 'found' && (
                <div>
                  <p className="text-base md:text-lg font-semibold text-oyn-stone-800 mb-2">
                    Professional results get noticed.
                  </p>
                  <p className="text-xs md:text-sm text-oyn-stone-600">
                    Clean design + authority positioning = customer trust
                  </p>
                </div>
              )}
              
              {currentPhase === 'chosen' && (
                <div className="animate-fadeIn">
                  <p className="text-base md:text-lg font-semibold text-oyn-stone-800 mb-3">
                    This could be your business.
                  </p>
                  <div className="space-y-3">
                    <p className="text-xs md:text-sm text-oyn-stone-600 px-2">
                      Professional websites rank first, get more calls, charge premium prices.
                    </p>
                    <div className="pt-2">
                      <a 
                        href="#services" 
                        className="inline-flex items-center gap-2 bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white px-6 py-3 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[48px] min-w-[48px] touch-target-optimized"
                      >
                        <span>Get Your Professional Website</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Search Results */}
          <div className="bg-white p-6 md:p-10">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Search Results</div>
              <div className="text-xs text-gray-400">About {(1200000 + currentScenario * 500000).toLocaleString()} results (0.{32 + currentScenario * 15} seconds)</div>
            </div>
            
            {showResults && (
              <div className="space-y-6">
                {scenario.results.map((result, index) => (
                  <div 
                    key={index} 
                    className="relative animate-fadeIn"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {result.isAd && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <div className="w-3 h-3 border border-gray-400 rounded-sm flex items-center justify-center">
                          <div className="text-xs font-bold text-gray-600">Ad</div>
                        </div>
                        <span>Sponsored</span>
                      </div>
                    )}
                    
                    <div className={`p-3 rounded-lg transition-all duration-500 ${
                      result.type === 'good' 
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 shadow-lg transform scale-105 animate-bounce-in' 
                        : 'hover:bg-gray-50 opacity-75'
                    }`}
                    style={result.type === 'good' ? { 
                      animationDelay: `${(index * 150) + 300}ms`,
                      animationFillMode: 'both'
                    } : {}}>
                      {result.type === 'good' && (
                        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce-in"
                             style={{ 
                               animationDelay: `${(index * 150) + 600}ms`,
                               animationFillMode: 'both'
                             }}>
                          #1 RESULT
                        </div>
                      )}
                      
                      <h3 className={`text-lg font-medium mb-1 ${
                        result.type === 'good' ? 'text-purple-700' : 'text-blue-600'
                      } hover:underline cursor-pointer`}>
                        {result.title}
                      </h3>
                      <div className="text-sm text-green-700 mb-2 truncate">
                        {result.url}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {result.description}
                      </p>
                      
                      {result.rating && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 transition-colors duration-300 ${
                                  i < Math.floor(result.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                                style={{ 
                                  transitionDelay: `${(index * 150) + (i * 50) + 400}ms` 
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600">
                            {result.rating} ({result.reviews} reviews)
                          </span>
                          {result.location && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {result.location}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {result.type === 'good' && (
                        <div className="mt-3 p-2 bg-white rounded border border-green-200 animate-fadeIn"
                             style={{ 
                               animationDelay: `${(index * 150) + 800}ms`,
                               animationFillMode: 'both'
                             }}>
                          <div className="text-xs font-semibold text-green-700 mb-1">🏆 DOMINATES SEARCH RESULTS</div>
                          <div className="text-xs text-gray-600">Professional • Authoritative • Trustworthy</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!showResults && (
              <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Summary - Phase Aware */}
        <div className="bg-gradient-to-r from-oyn-stone-50 to-oyn-orange-50 px-6 md:px-10 py-4 border-t border-oyn-stone-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm transition-all duration-500">
            <div className="text-oyn-stone-700">
              {currentPhase === 'searching' && (
                <span>Customers are searching for <strong className="text-oyn-orange-600">{scenario.business.toLowerCase()}</strong>-type businesses...</span>
              )}
              {currentPhase === 'found' && (
                <span><strong className="text-oyn-orange-600">{scenario.business}</strong> appears first in search results</span>
              )}
              {currentPhase === 'chosen' && (
                <span><strong className="text-oyn-orange-600">{scenario.business}</strong> gets the customer. Professional wins.</span>
              )}
            </div>
            <div className="text-oyn-stone-400 text-xs">
              {currentScenario + 1} of {searchScenarios.length}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 px-4">
        <p className="text-sm text-oyn-stone-600 italic">
          This is the exact experience your customers have when they search for your services
        </p>
      </div>
    </div>
  );
}

