import React from 'react';

interface HeroThreeBackgroundProps {
  className?: string;
}

export function HeroThreeBackground({ className = "" }: HeroThreeBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      {/* Enhanced static fallback representing the three pillars */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-teal/6 via-transparent to-gallifrey-charcoal/4" />
        
        {/* Three Pillar Static Representation */}
        <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full border-2 border-gallifrey-teal/25 opacity-40">
          <div className="absolute inset-2 rounded-full bg-gallifrey-teal/10"></div>
        </div>
        
        <div className="absolute top-1/3 right-1/4 w-7 h-7 rounded-full border-2 border-gallifrey-charcoal/20 opacity-35">
          <div className="absolute inset-2 rounded-full bg-gallifrey-charcoal/8"></div>
        </div>
        
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-gallifrey-teal/20 opacity-30">
          <div className="absolute inset-2 rounded-full bg-gallifrey-teal/6"></div>
        </div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <line x1="25%" y1="33%" x2="75%" y2="33%" stroke="#2D5A87" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="25%" y1="33%" x2="50%" y2="50%" stroke="#2D5A87" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="75%" y1="33%" x2="50%" y2="50%" stroke="#2D5A87" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
        
        {/* Subtle floating particles */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-gallifrey-teal/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-gallifrey-charcoal/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-gallifrey-teal/20 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}