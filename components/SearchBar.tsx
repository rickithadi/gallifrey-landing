import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const businessExamples = [
  { business: 'Smith & Partners Law', location: 'Brunswick' },
  { business: 'Bright Spark Electrical', location: 'Footscray' },
  { business: 'Melbourne Family Dental', location: 'Collingwood' },
  { business: 'Inner City Medical Centre', location: 'Sydney Rd' },
  { business: 'Premier Strata Management', location: 'Brunswick' },
  { business: 'The Corner Bistro', location: 'Footscray' },
  { business: 'Heritage Dental Practice', location: 'Collingwood' },
  { business: 'Metro Legal Services', location: 'Sydney Rd' }
];

export function SearchBar() {
  const [currentExample, setCurrentExample] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentExample((prev) => (prev + 1) % businessExamples.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="relative">
        <div className="bg-white rounded-full shadow-md border border-oyn-stone-200 px-6 py-4 flex items-center gap-3 hover:shadow-lg transition-shadow duration-300">
          <Search className="w-5 h-5 text-oyn-stone-400" />
          <div className="flex-1 min-h-[1.5rem] flex items-center">
            <span 
              className={`text-oyn-stone-600 font-body transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {businessExamples[currentExample].business} {businessExamples[currentExample].location}
            </span>
            <span className="animate-pulse text-oyn-stone-400 ml-1">|</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-oyn-stone-500 mt-3 text-center italic">
        Try it right now. See what your customers find.
      </p>
    </div>
  );
}