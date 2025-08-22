import { ProfilerOnRenderCallback } from 'react';

interface PerformanceData {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

class ReactProfiler {
  private static instance: ReactProfiler;
  private performanceData: PerformanceData[] = [];
  private isEnabled: boolean = false;

  private constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_PROFILER === 'true';
  }

  static getInstance(): ReactProfiler {
    if (!ReactProfiler.instance) {
      ReactProfiler.instance = new ReactProfiler();
    }
    return ReactProfiler.instance;
  }

  onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    if (!this.isEnabled) return;

    const data: PerformanceData = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    };

    this.performanceData.push(data);

    // Log slow renders (over 16ms for 60fps)
    if (actualDuration > 16) {
      console.warn(`🐌 Slow render detected:`, {
        component: id,
        phase,
        duration: `${actualDuration.toFixed(2)}ms`,
        baseline: `${baseDuration.toFixed(2)}ms`,
      });
    }

    // Keep only last 100 entries to prevent memory leaks
    if (this.performanceData.length > 100) {
      this.performanceData.shift();
    }
  };

  getPerformanceReport() {
    if (!this.isEnabled) return null;

    const report = {
      totalRenders: this.performanceData.length,
      averageDuration: this.performanceData.reduce((sum, data) => sum + data.actualDuration, 0) / this.performanceData.length,
      slowRenders: this.performanceData.filter(data => data.actualDuration > 16),
      componentBreakdown: this.getComponentBreakdown(),
    };

    return report;
  }

  private getComponentBreakdown() {
    const breakdown: Record<string, { count: number; totalDuration: number; avgDuration: number }> = {};

    this.performanceData.forEach(data => {
      if (!breakdown[data.id]) {
        breakdown[data.id] = { count: 0, totalDuration: 0, avgDuration: 0 };
      }
      breakdown[data.id].count++;
      breakdown[data.id].totalDuration += data.actualDuration;
      breakdown[data.id].avgDuration = breakdown[data.id].totalDuration / breakdown[data.id].count;
    });

    return breakdown;
  }

  clearData() {
    this.performanceData = [];
  }

  logReport() {
    if (!this.isEnabled) return;

    const report = this.getPerformanceReport();
    if (report) {
      console.group('📊 React Performance Report');
      console.log('Total renders:', report.totalRenders);
      console.log('Average duration:', `${report.averageDuration.toFixed(2)}ms`);
      console.log('Slow renders:', report.slowRenders.length);
      console.table(report.componentBreakdown);
      console.groupEnd();
    }
  }
}

export const profiler = ReactProfiler.getInstance();

// Development helper to log performance report
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as { logPerformanceReport: () => void; clearPerformanceData: () => void }).logPerformanceReport = () => profiler.logReport();
  (window as unknown as { logPerformanceReport: () => void; clearPerformanceData: () => void }).clearPerformanceData = () => profiler.clearData();
}