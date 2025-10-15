import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
  animated?: boolean;
  animationDelay?: number;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language = 'bash',
  title,
  className = '',
  showLineNumbers = true,
  animated = false,
  animationDelay = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(animated ? '' : code);
  const [isTyping, setIsTyping] = useState(false);

  const displayedLines = displayedCode.split('\n');

  useEffect(() => {
    if (!animated) return;

    const timer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex >= code.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [code, animated, animationDelay]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-t-lg border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">
            {title || `${language}.sh`}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative bg-gray-900 rounded-b-lg overflow-hidden">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-gray-100 font-mono">
            {displayedLines.map((line, index) => (
              <div key={index} className="flex items-start">
                {showLineNumbers && (
                  <span className="mr-4 text-gray-500 select-none text-xs w-8 flex-shrink-0 text-right">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1">
                  <SyntaxHighlight line={line} language={language} />
                  {animated && isTyping && index === displayedLines.length - 1 && (
                    <span className="animate-pulse text-green-400">_</span>
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>

        {/* Gradient overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-500/5 pointer-events-none" />
      </div>
    </div>
  );
};

// Simple syntax highlighting component
interface SyntaxHighlightProps {
  line: string;
  language: string;
}

const SyntaxHighlight: React.FC<SyntaxHighlightProps> = ({ line, language }) => {
  if (language === 'bash' || language === 'shell') {
    // Basic bash syntax highlighting
    if (line.startsWith('#')) {
      return <span className="text-gray-500">{line}</span>;
    }
    if (line.includes('sudo') || line.includes('docker') || line.includes('kubectl')) {
      const parts = line.split(' ');
      return (
        <>
          {parts.map((part, index) => {
            if (part === 'sudo' || part === 'docker' || part === 'kubectl') {
              return <span key={index} className="text-purple-400">{part} </span>;
            }
            if (part.startsWith('--')) {
              return <span key={index} className="text-yellow-400">{part} </span>;
            }
            if (part.startsWith('-')) {
              return <span key={index} className="text-blue-400">{part} </span>;
            }
            return <span key={index}>{part} </span>;
          })}
        </>
      );
    }
  }

  if (language === 'yaml' || language === 'yml') {
    if (line.includes(':')) {
      const [key, ...values] = line.split(':');
      return (
        <>
          <span className="text-blue-400">{key}:</span>
          <span>{values.join(':')}</span>
        </>
      );
    }
  }

  return <span>{line}</span>;
};

// Predefined code snippets for Gallifrey infrastructure
export const GallifreyCodeSnippets = {
  infrastructure: `# Deploy AI-powered infrastructure
gallifrey deploy --environment production \\
  --self-healing \\
  --auto-scale \\
  --security-soc

# Status: 99.99% uptime achieved
# Security: SOC2 compliant
# AI: Autonomous operations active`,

  monitoring: `# Real-time infrastructure monitoring
gallifrey monitor --dashboard \\
  --threats --performance \\
  --predictive-analytics

# Monitoring 847 services
# 0 security threats detected
# Performance: Optimal`,

  scaling: `# Autonomous scaling configuration
gallifrey config set auto-scaling true
gallifrey config set ai-optimization enabled
gallifrey config set cost-optimization aggressive

# Scaling: Autonomous
# Cost reduction: 70%
# Uptime: 99.99%`
};