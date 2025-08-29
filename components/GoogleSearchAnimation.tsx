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

export function GoogleSearchAnimation() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load delay for better UX
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScenario((prev) => (prev + 1) % searchScenarios.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(interval);
    };
  }, []);

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
                value={scenario.query}
                readOnly
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-full text-sm md:text-base text-gray-700 bg-gray-50"
              />
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
              
              <div className="hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
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
                    <div className="ml-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-xs text-green-700 font-medium mb-1">YOUR RESULT</div>
                      <div className="text-xs text-green-600">Professional • Authoritative • Trustworthy</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom insight */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              <strong className="text-oyn-orange-600">{scenario.business}</strong> appears first with professional credentials
            </div>
            <div className="text-gray-500">
              {currentScenario + 1} of {searchScenarios.length}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-oyn-stone-600 italic">
          This is what your customers see when they search for your services
        </p>
      </div>
    </div>
  );
}