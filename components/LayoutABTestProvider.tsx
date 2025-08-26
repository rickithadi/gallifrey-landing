import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  LayoutVariant, 
  getLayoutVariant, 
  trackLayoutVariantExposure
} from '@/lib/layout-ab-test';

interface LayoutABTestContextType {
  variant: LayoutVariant;
}

const LayoutABTestContext = createContext<LayoutABTestContextType | undefined>(undefined);

export function LayoutABTestProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<LayoutVariant>('lightweight');

  useEffect(() => {
    const assignedVariant = getLayoutVariant();
    setVariant(assignedVariant);
    
    // Track exposure after a brief delay to ensure page is loaded
    setTimeout(() => {
      trackLayoutVariantExposure(assignedVariant);
    }, 1000);
  }, []);

  return (
    <LayoutABTestContext.Provider value={{ variant }}>
      {children}
    </LayoutABTestContext.Provider>
  );
}

export function useLayoutABTest() {
  const context = useContext(LayoutABTestContext);
  if (context === undefined) {
    throw new Error('useLayoutABTest must be used within a LayoutABTestProvider');
  }
  return context;
}
