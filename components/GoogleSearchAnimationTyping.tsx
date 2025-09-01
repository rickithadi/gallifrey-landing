import { useState, useEffect } from 'react';
import { Search, Star, MapPin } from 'lucide-react';

const searchScenarios = [
  {
    query: "dentist brunswick melbourne",
    business: "Heritage Dental Practice",
    results: [
      {
        type: "poor",
        title: "Find a Dentist Near You | 1300SMILES",
        url: "1300smiles.com.au",
        description: "Book online with Australia's leading dental franchise. Multiple locations across Australia...",
        isAd: true
      },
      {
        type: "poor", 
        title: "Dental Care Australia - Emergency Dentist",
        url: "dentalcareaustralia.com.au",
        description: "24/7 emergency dental services. Call now for immediate assistance...",
        isAd: true
      },
      {
        type: "good",
        title: "Heritage Dental Practice - Brunswick | Premium Family Dentistry",
        url: "heritagedentalbrunswick.com.au",
        description: "Award-winning family dental practice in Brunswick. Gentle, professional care with 15+ years experience. Book your consultation today.",
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
        description: "Compare quotes from local electricians. Get matched with up to 3 professionals...",
        isAd: true
      },
      {
        type: "poor",
        title: "Emergency Electrician Melbourne - 24/7 Service",
        url: "emergencyelectrician.com.au", 
        description: "Fast response times. No call out fees. All work guaranteed...",
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
        description: "Search our directory of legal professionals across Victoria...",
        isAd: false
      },
      {
        type: "poor",
        title: "Legal Aid Victoria - Free Legal Help",
        url: "legalaid.vic.gov.au",
        description: "Get free or low-cost legal help if you can't afford a lawyer...",
        isAd: false
      },
      {
        type: "good", 
        title: "Smith & Partners Law - Collingwood Legal Experts",
        url: "smithpartnerslaw.com.au",
        description: "Boutique law firm specializing in corporate law and litigation. 25 years serving Melbourne's inner suburbs. Initial consultation free.",
        rating: 4.8,
        reviews: 203,
        location: "Collingwood, VIC"
      }
    ]
  }
];

export function GoogleSearchAnimationTyping() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Start initial typing
    typeQuery(searchScenarios[0].query);

    // Set up interval for changing scenarios
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const nextScenario = (currentScenario + 1) % searchScenarios.length;
        setCurrentScenario(nextScenario);
        setIsTransitioning(false);
        // Type new query after transition
        setTimeout(() => {
          typeQuery(searchScenarios[nextScenario].query);
        }, 200);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentScenario]);

  const typeQuery = (query: string) => {
    setTypedQuery('');
    setIsTyping(true);
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= query.length) {
        setTypedQuery(query.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 100); // Typing speed
  };

  const scenario = searchScenarios[currentScenario];

  return (
    <div className="max-w-4xl mx-auto my-8 md:my-12 px-4">
      <div className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ${
        isTransitioning ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
      }`}>
        
        {/* Google Header */}
        <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-xl md:text-2xl font-bold text-blue-500">Google</div>
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-2 md:left-3 top-2 md:top-3 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
              <input
                type="text"
                value={typedQuery}
                readOnly
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-full text-sm md:text-base text-gray-700 bg-gray-50"
              />
              {isTyping && (
                <div className="absolute right-3 md:right-4 top-2 md:top-3">
                  <div className="w-0.5 h-4 md:h-5 bg-blue-500 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
          {scenario.results.map((result, index) => (
            <div key={index} className="space-y-1">
              {result.isAd && (
                <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <div className="w-3 h-3 border border-gray-400 rounded-sm flex items-center justify-center">
                    <div className="text-xs font-bold text-gray-600">Ad</div>
                  </div>
                  <span>Sponsored</span>
                </div>
              )}
              
              <div className={`hover:bg-gray-50 -mx-2 px-2 py-1 rounded ${
                result.type === 'good' ? 'bg-blue-50 border-l-4 border-blue-500 relative' : ''
              }`}>
                {result.type === 'good' && (
                  <div className="absolute -left-6 top-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                    #1
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm md:text-lg hover:underline cursor-pointer ${
                      result.type === 'good' ? 'text-purple-700 font-medium' : 'text-blue-600'
                    } leading-tight mb-1`}>
                      {result.title}
                    </h3>
                    <div className="text-xs md:text-sm text-green-700 mb-1 truncate">
                      {result.url}
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {result.description}
                    </p>
                    
                    {result.rating && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(result.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {result.rating} ({result.reviews} reviews)
                        </span>
                        {result.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {result.location}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {result.type === 'good' && (
                    <div className="ml-2 md:ml-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-2 md:p-3 shadow-lg flex-shrink-0">
                      <div className="text-xs text-green-700 font-medium mb-1">🏆 FIRST RESULT</div>
                      <div className="text-xs text-green-600 hidden md:block">Professional • Authoritative • Trustworthy</div>
                      <div className="text-xs text-green-600 md:hidden">Premium Result</div>
                      <div className="text-xs text-blue-600 font-semibold mt-1">Dominates Search</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom insight */}
        <div className="bg-gray-50 px-3 md:px-8 py-3 md:py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs md:text-sm">
            <div className="text-gray-600">
              <strong className="text-oyn-orange-600">{scenario.business}</strong> ranks #1 - First result customers see
            </div>
            <div className="text-gray-500 text-right">
              {currentScenario + 1} of {searchScenarios.length}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 md:mt-6 px-4">
        <p className="text-xs md:text-sm text-oyn-stone-600 italic">
          This is what your customers see when they search for your services
        </p>
      </div>
    </div>
  );
}