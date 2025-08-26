import React, { useState, useEffect, useMemo } from 'react';

interface InteractionGuideProps {
  mode: 'attract' | 'repel' | 'vortex' | 'explosion';
  isActive: boolean;
  chargeLevel: number;
  modeTransition: number;
  isVisible?: boolean;
  onDismiss?: () => void;
}

export function InteractionGuide({
  mode,
  isActive,
  chargeLevel,
  modeTransition,
  isVisible = true,
  onDismiss
}: InteractionGuideProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [hasShownMode, setHasShownMode] = useState<Set<string>>(new Set());
  const [isDismissed, setIsDismissed] = useState(false);

  // Mode-specific guidance content
  const modeContent = useMemo(() => ({
    attract: {
      title: 'Attract Mode',
      description: 'Particles are drawn toward your cursor',
      instructions: [
        'Move your cursor to guide particles',
        'Click to cycle through modes',
        'Hold for explosive charge'
      ],
      icon: '🧲',
      color: 'text-gallifrey-teal',
      bgColor: 'bg-gallifrey-teal/10',
      borderColor: 'border-gallifrey-teal/30'
    },
    repel: {
      title: 'Repel Mode',
      description: 'Particles are pushed away from your cursor',
      instructions: [
        'Move to create particle waves',
        'Fast movement creates stronger repulsion',
        'Click to switch modes'
      ],
      icon: '💥',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    vortex: {
      title: 'Vortex Mode',
      description: 'Particles swirl around your cursor',
      instructions: [
        'Draw circular motions for enhanced effect',
        'Particles spiral in beautiful patterns',
        'Hold and drag for particle trails'
      ],
      icon: '🌀',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    explosion: {
      title: 'Explosion Mode',
      description: 'Hold to charge, release for particle burst',
      instructions: [
        'Hold mouse button to charge up',
        'Watch the charging indicator grow',
        'Release for explosive particle effect'
      ],
      icon: '💫',
      color: 'text-oyn-orange-600',
      bgColor: 'bg-oyn-orange-600/10',
      borderColor: 'border-oyn-orange-600/30'
    }
  }), []);

  const currentContent = modeContent[mode];

  // Show guide when mode changes or first load
  useEffect(() => {
    if (!isDismissed && isVisible && modeTransition < 0.5 && !hasShownMode.has(mode)) {
      setShowGuide(true);
      setHasShownMode(prev => new Set([...Array.from(prev), mode]));
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setShowGuide(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [mode, modeTransition, isVisible, hasShownMode, isDismissed]);

  // Handle dismiss
  const handleDismiss = () => {
    setShowGuide(false);
    setIsDismissed(true);
    onDismiss?.();
  };

  // Don't render if not visible or dismissed
  if (!isVisible || isDismissed || !showGuide) {
    return null;
  }

  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return null;
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-500 ease-out ${
        showGuide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="dialog"
      aria-labelledby="interaction-guide-title"
      aria-describedby="interaction-guide-description"
    >
      <div
        className={`${currentContent.bgColor} ${currentContent.borderColor} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl" role="img" aria-label={currentContent.title}>
              {currentContent.icon}
            </span>
            <h3
              id="interaction-guide-title"
              className={`font-semibold ${currentContent.color}`}
            >
              {currentContent.title}
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Dismiss guide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p
          id="interaction-guide-description"
          className="text-sm text-gray-600 mb-3"
        >
          {currentContent.description}
        </p>

        {/* Instructions */}
        <ul className="text-xs text-gray-500 space-y-1">
          {currentContent.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className={`w-1 h-1 mt-2 rounded-full ${currentContent.color.replace('text-', 'bg-')} flex-shrink-0`} />
              <span>{instruction}</span>
            </li>
          ))}
        </ul>

        {/* Explosion mode charge indicator */}
        {mode === 'explosion' && isActive && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Charge Level</span>
              <span>{Math.round(chargeLevel * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-100 ${
                  chargeLevel > 0.7 ? 'bg-oyn-orange-600' : 'bg-oyn-orange-500'
                }`}
                style={{ width: `${chargeLevel * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Mode transition indicator */}
        {modeTransition < 1 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${currentContent.color.replace('text-', 'bg-')} animate-pulse`} />
                <div className={`w-2 h-2 rounded-full ${currentContent.color.replace('text-', 'bg-')} animate-pulse`} style={{ animationDelay: '0.2s' }} />
                <div className={`w-2 h-2 rounded-full ${currentContent.color.replace('text-', 'bg-')} animate-pulse`} style={{ animationDelay: '0.4s' }} />
              </div>
              <span>Switching modes...</span>
            </div>
          </div>
        )}

        {/* Quick tips */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            💡 <strong>Tip:</strong> {
              mode === 'attract' ? 'Try drawing circular motions to auto-switch to vortex mode!' :
              mode === 'repel' ? 'Quick swipes create dramatic particle waves!' :
              mode === 'vortex' ? 'Hold and drag to create custom particle trails!' :
              'Hold longer for more powerful explosions!'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

// Optional: Persistent mode indicator in corner
export function ModeIndicator({ 
  mode, 
  isActive,
  className = ''
}: { 
  mode: 'attract' | 'repel' | 'vortex' | 'explosion';
  isActive: boolean;
  className?: string;
}) {
  const modeEmojis = {
    attract: '🧲',
    repel: '💥',
    vortex: '🌀',
    explosion: '💫'
  };

  const modeColors = {
    attract: 'text-gallifrey-teal',
    repel: 'text-red-500',
    vortex: 'text-purple-500',
    explosion: 'text-oyn-orange-600'
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 ${className}`}
      role="status"
      aria-label={`Current interaction mode: ${mode}`}
    >
      <div
        className={`flex items-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 transition-all duration-300 ${
          isActive ? 'scale-110 shadow-xl' : 'scale-100'
        }`}
      >
        <span 
          className={`text-lg transition-transform duration-200 ${isActive ? 'scale-125' : 'scale-100'}`}
          role="img" 
          aria-label={mode}
        >
          {modeEmojis[mode]}
        </span>
        <span className={`text-sm font-medium capitalize ${modeColors[mode]}`}>
          {mode}
        </span>
      </div>
    </div>
  );
}