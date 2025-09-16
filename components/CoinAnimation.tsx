import { useState, useEffect } from 'react';
import { Eye, Shield } from 'lucide-react';

interface CoinAnimationProps {
  className?: string;
  autoFlip?: boolean;
  flipInterval?: number;
}

export function CoinAnimation({ 
  className = '', 
  autoFlip = true, 
  flipInterval = 4000 
}: CoinAnimationProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!autoFlip) return;

    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, flipInterval);

    return () => clearInterval(interval);
  }, [autoFlip, flipInterval]);

  return (
    <div className={`coin-container ${className}`}>
      <div 
        className={`coin ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Surveillance Side */}
        <div className="coin-face coin-front">
          <div className="coin-content">
            <Eye className="w-8 h-8 text-gallifrey-white" />
            <span className="text-xs font-medium text-gallifrey-white mt-2">
              Surveillance
            </span>
          </div>
        </div>
        
        {/* Privacy Side */}
        <div className="coin-face coin-back">
          <div className="coin-content">
            <Shield className="w-8 h-8 text-gallifrey-white" />
            <span className="text-xs font-medium text-gallifrey-white mt-2">
              Privacy
            </span>
          </div>
        </div>
      </div>
      
      {/* Subtle interaction hint */}
      <div className="text-center mt-4">
        <span className="text-xs text-gallifrey-charcoal/40 italic">
          Click to flip
        </span>
      </div>
    </div>
  );
}