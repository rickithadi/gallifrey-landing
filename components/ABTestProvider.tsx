import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  ColorVariant, 
  getColorVariant, 
  applyColorVariant, 
  trackVariantExposure,
  getVariantInfo
} from '@/lib/ab-test';

interface ABTestContextType {
  variant: ColorVariant;
  variantInfo: ReturnType<typeof getVariantInfo>;
  switchVariant: (newVariant: ColorVariant) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<ColorVariant>('corporate-teal');

  useEffect(() => {
    const assignedVariant = getColorVariant();
    setVariant(assignedVariant);
    applyColorVariant(assignedVariant);
    
    // Track exposure after a brief delay to ensure page is loaded
    setTimeout(() => {
      trackVariantExposure(assignedVariant);
    }, 1000);
  }, []);

  const switchVariant = (newVariant: ColorVariant) => {
    setVariant(newVariant);
    applyColorVariant(newVariant);
    if (typeof window !== 'undefined') {
      localStorage.setItem('color-variant', newVariant);
    }
  };

  const variantInfo = getVariantInfo(variant);

  return (
    <ABTestContext.Provider value={{ variant, variantInfo, switchVariant }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}