import React from 'react';
import { useABTest } from './ABTestProvider';
import { ColorVariant, COLOR_VARIANTS } from '@/lib/ab-test';

export function VariantToggle() {
  const { variant, variantInfo, switchVariant } = useABTest();

  // Only show in development or with ?debug=true
  const isDebugMode = process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true');

  if (!isDebugMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="text-sm font-medium text-gray-900 mb-3">
        🎨 A/B Test: Color Variants
      </div>
      
      <div className="space-y-2">
        {Object.entries(COLOR_VARIANTS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => switchVariant(key as ColorVariant)}
            className={`w-full text-left p-2 rounded border transition-colors ${
              variant === key 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium text-sm">{config.name}</div>
            <div className="text-xs text-gray-600">{config.description}</div>
            <div className="flex gap-1 mt-1">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: `rgb(${config.teal})` }}
              ></div>
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: `rgb(${config.tealDark})` }}
              ></div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
        Current: <span className="font-medium">{variantInfo.name}</span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Test with: <code>?variant=corporate-teal</code> or <code>?variant=steel-blue-teal</code>
      </div>
    </div>
  );
}