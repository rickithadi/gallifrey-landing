import React, { Profiler, ReactNode } from 'react';
import { profiler } from '@/lib/profiler';

interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  enabled?: boolean;
}

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({ 
  id, 
  children, 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={profiler.onRender}>
      {children}
    </Profiler>
  );
};

// HOC for easier wrapping of components
export function withPerformanceProfiler<T extends object>(
  Component: React.ComponentType<T>,
  id: string
) {
  const WrappedComponent = (props: T) => (
    <PerformanceProfiler id={id}>
      <Component {...props} />
    </PerformanceProfiler>
  );

  WrappedComponent.displayName = `withPerformanceProfiler(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}