import React, { useEffect, useState } from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  speed?: 'slow' | 'medium' | 'fast';
  colors?: {
    from: string;
    via?: string;
    to: string;
  };
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  animate = true,
  speed = 'medium',
  colors = {
    from: 'from-purple-500',
    via: 'via-blue-500',
    to: 'to-teal-400'
  }
}) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (!animate) return;

    const speedMap = {
      slow: 'animate-gradient-slow',
      medium: 'animate-gradient-medium',
      fast: 'animate-gradient-fast'
    };

    setAnimationClass(speedMap[speed]);
  }, [animate, speed]);

  const gradientClasses = `
    bg-gradient-to-r ${colors.from} ${colors.via || ''} ${colors.to}
    bg-clip-text text-transparent font-bold
    ${animate ? 'bg-size-200 ' + animationClass : ''}
    ${className}
  `.trim();

  return (
    <span 
      className={gradientClasses}
      style={{
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        ...(animate && {
          backgroundSize: '200% 200%',
          animation: speed === 'slow' ? 'gradient-x 8s ease infinite' :
                    speed === 'medium' ? 'gradient-x 5s ease infinite' :
                    'gradient-x 3s ease infinite'
        })
      }}
    >
      {children}
    </span>
  );
};

// Animated gradient text with typing effect
interface AnimatedGradientTextProps extends Omit<GradientTextProps, 'children'> {
  text: string;
  typingSpeed?: number;
  startDelay?: number;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  text,
  typingSpeed = 100,
  startDelay = 0,
  ...gradientProps
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex >= text.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [text, typingSpeed, startDelay]);

  return (
    <GradientText {...gradientProps}>
      {displayText}
      {isTyping && (
        <span className="animate-pulse text-current">|</span>
      )}
    </GradientText>
  );
};

// Multiple gradient text carousel
interface GradientTextCarouselProps extends Omit<GradientTextProps, 'children'> {
  texts: string[];
  interval?: number;
  transitionDuration?: number;
}

export const GradientTextCarousel: React.FC<GradientTextCarouselProps> = ({
  texts,
  interval = 3000,
  transitionDuration = 500,
  ...gradientProps
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (texts.length <= 1) return;

    const cycleText = () => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, transitionDuration / 2);
    };

    const intervalId = setInterval(cycleText, interval);
    return () => clearInterval(intervalId);
  }, [texts.length, interval, transitionDuration]);

  return (
    <div
      className={`transition-opacity duration-${transitionDuration / 2} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <GradientText {...gradientProps}>
        {texts[currentIndex] || texts[0]}
      </GradientText>
    </div>
  );
};