/**
 * Advanced Memory Tracker for JavaScript heap monitoring and leak detection
 */
export interface MemorySnapshot {
  timestamp: number;
  used: number;
  total: number;
  limit: number;
  percentage: number;
}

export interface MemoryLeak {
  type: 'gradual' | 'spike' | 'retention';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: number;
  endTime: number;
  description: string;
  dataPoints: MemorySnapshot[];
}

export interface MemoryAnalysis {
  trend: 'stable' | 'increasing' | 'decreasing' | 'volatile';
  growthRate: number; // MB per minute
  efficiency: number; // 0-100 score
  leaks: MemoryLeak[];
  recommendations: string[];
  peakUsage: MemorySnapshot;
  averageUsage: number;
  gcEvents: number;
}

export class MemoryTracker {
  private snapshots: MemorySnapshot[] = [];
  private isTracking = false;
  private intervalId?: number;
  private trackingInterval = 1000; // 1 second
  private maxSnapshots = 300; // 5 minutes at 1Hz
  private gcObserver?: PerformanceObserver;
  private gcEvents = 0;
  private callbacks: Array<(snapshot: MemorySnapshot) => void> = [];
  
  // Leak detection thresholds
  private readonly gradualLeakThreshold = 0.5; // MB per minute
  private readonly spikeThreshold = 10; // MB sudden increase
  private readonly retentionThreshold = 80; // % of limit
  
  constructor(interval = 1000, maxSnapshots = 300) {
    this.trackingInterval = interval;
    this.maxSnapshots = maxSnapshots;
    this.initializeGCMonitoring();
    this.bindToWindow();
  }
  
  /**
   * Bind memory tracker to window for global access
   */
  private bindToWindow(): void {
    if (typeof window !== 'undefined') {
      (window as any).memoryTracker = this;
    }
  }
  
  /**
   * Initialize garbage collection monitoring
   */
  private initializeGCMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        this.gcObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (entry.entryType === 'gc') {
              this.gcEvents++;
            }
          });
        });
        
        this.gcObserver.observe({ entryTypes: ['gc'] });
      } catch (e) {
        console.warn('GC monitoring not available in this environment');
      }
    }
  }
  
  /**
   * Check if memory monitoring is supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'performance' in window && 
           'memory' in (performance as any);
  }
  
  /**
   * Start memory tracking
   */
  start(): void {
    if (!this.isSupported()) {
      console.warn('Memory monitoring not supported in this environment');
      return;
    }
    
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.snapshots = [];
    this.gcEvents = 0;
    
    // Take initial snapshot
    this.takeSnapshot();
    
    // Start periodic monitoring
    this.intervalId = window.setInterval(() => {
      this.takeSnapshot();
    }, this.trackingInterval);
  }
  
  /**
   * Stop memory tracking
   */
  stop(): void {
    this.isTracking = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  /**
   * Add callback for memory updates
   */
  onUpdate(callback: (snapshot: MemorySnapshot) => void): void {
    this.callbacks.push(callback);
  }
  
  /**
   * Remove callback
   */
  removeCallback(callback: (snapshot: MemorySnapshot) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
  
  /**
   * Take a memory snapshot
   */
  private takeSnapshot(): void {
    if (!this.isSupported()) return;
    
    const memory = (performance as any).memory;
    const snapshot: MemorySnapshot = {
      timestamp: performance.now(),
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
    
    this.snapshots.push(snapshot);
    
    // Maintain maximum number of snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
    
    // Notify callbacks
    this.callbacks.forEach(callback => {
      callback(snapshot);
    });
  }
  
  /**
   * Get current memory usage
   */
  getCurrentUsage(): MemorySnapshot | null {
    return this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null;
  }
  
  /**
   * Get all snapshots
   */
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }
  
  /**
   * Get memory usage over time period
   */
  getUsageInTimeRange(startTime: number, endTime: number): MemorySnapshot[] {
    return this.snapshots.filter(snapshot => 
      snapshot.timestamp >= startTime && snapshot.timestamp <= endTime
    );
  }
  
  /**
   * Calculate memory growth rate in MB per minute
   */
  getGrowthRate(): number {
    if (this.snapshots.length < 2) return 0;
    
    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];
    const timeElapsed = (last.timestamp - first.timestamp) / 1000 / 60; // minutes
    const memoryGrowth = (last.used - first.used) / 1024 / 1024; // MB
    
    return timeElapsed > 0 ? memoryGrowth / timeElapsed : 0;
  }
  
  /**
   * Detect memory leaks
   */
  detectLeaks(): MemoryLeak[] {
    const leaks: MemoryLeak[] = [];
    
    if (this.snapshots.length < 10) return leaks; // Need enough data
    
    // Detect gradual leaks
    const gradualLeak = this.detectGradualLeak();
    if (gradualLeak) leaks.push(gradualLeak);
    
    // Detect memory spikes
    const spikes = this.detectMemorySpikes();
    leaks.push(...spikes);
    
    // Detect high retention
    const retention = this.detectHighRetention();
    if (retention) leaks.push(retention);
    
    return leaks;
  }
  
  /**
   * Detect gradual memory leaks
   */
  private detectGradualLeak(): MemoryLeak | null {
    const growthRate = this.getGrowthRate();
    
    if (growthRate > this.gradualLeakThreshold) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      
      if (growthRate > 5) severity = 'critical';
      else if (growthRate > 2) severity = 'high';
      else if (growthRate > 1) severity = 'medium';
      
      return {
        type: 'gradual',
        severity,
        startTime: this.snapshots[0].timestamp,
        endTime: this.snapshots[this.snapshots.length - 1].timestamp,
        description: `Gradual memory leak detected: ${growthRate.toFixed(2)} MB/min growth rate`,
        dataPoints: this.snapshots.slice(-20) // Last 20 data points
      };
    }
    
    return null;
  }
  
  /**
   * Detect memory spikes
   */
  private detectMemorySpikes(): MemoryLeak[] {
    const spikes: MemoryLeak[] = [];
    
    for (let i = 1; i < this.snapshots.length; i++) {
      const current = this.snapshots[i];
      const previous = this.snapshots[i - 1];
      const increase = (current.used - previous.used) / 1024 / 1024; // MB
      
      if (increase > this.spikeThreshold) {
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
        
        if (increase > 50) severity = 'critical';
        else if (increase > 25) severity = 'high';
        else if (increase > 15) severity = 'medium';
        else severity = 'low';
        
        spikes.push({
          type: 'spike',
          severity,
          startTime: previous.timestamp,
          endTime: current.timestamp,
          description: `Memory spike detected: ${increase.toFixed(2)} MB sudden increase`,
          dataPoints: [previous, current]
        });
      }
    }
    
    return spikes;
  }
  
  /**
   * Detect high memory retention
   */
  private detectHighRetention(): MemoryLeak | null {
    const current = this.getCurrentUsage();
    
    if (current && current.percentage > this.retentionThreshold) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
      
      if (current.percentage > 95) severity = 'critical';
      else if (current.percentage > 90) severity = 'high';
      else if (current.percentage > 85) severity = 'medium';
      else severity = 'low';
      
      return {
        type: 'retention',
        severity,
        startTime: current.timestamp,
        endTime: current.timestamp,
        description: `High memory retention: ${current.percentage.toFixed(1)}% of heap limit`,
        dataPoints: [current]
      };
    }
    
    return null;
  }
  
  /**
   * Analyze memory usage patterns
   */
  analyze(): MemoryAnalysis {
    if (this.snapshots.length === 0) {
      return {
        trend: 'stable',
        growthRate: 0,
        efficiency: 100,
        leaks: [],
        recommendations: ['Start memory tracking to analyze usage patterns'],
        peakUsage: { timestamp: 0, used: 0, total: 0, limit: 0, percentage: 0 },
        averageUsage: 0,
        gcEvents: this.gcEvents
      };
    }
    
    const leaks = this.detectLeaks();
    const growthRate = this.getGrowthRate();
    const trend = this.calculateTrend();
    const efficiency = this.calculateEfficiency();
    const peakUsage = this.getPeakUsage();
    const averageUsage = this.getAverageUsage();
    const recommendations = this.generateRecommendations(leaks, growthRate, efficiency);
    
    return {
      trend,
      growthRate,
      efficiency,
      leaks,
      recommendations,
      peakUsage,
      averageUsage,
      gcEvents: this.gcEvents
    };
  }
  
  /**
   * Calculate memory usage trend
   */
  private calculateTrend(): 'stable' | 'increasing' | 'decreasing' | 'volatile' {
    if (this.snapshots.length < 5) return 'stable';
    
    const recent = this.snapshots.slice(-10);
    const changes = recent.slice(1).map((snapshot, i) => 
      snapshot.percentage - recent[i].percentage
    );
    
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / changes.length;
    const stdDev = Math.sqrt(variance);
    
    // High variance indicates volatility
    if (stdDev > 5) return 'volatile';
    
    // Significant average change indicates trend
    if (avgChange > 1) return 'increasing';
    if (avgChange < -1) return 'decreasing';
    
    return 'stable';
  }
  
  /**
   * Calculate memory efficiency score (0-100)
   */
  private calculateEfficiency(): number {
    const current = this.getCurrentUsage();
    if (!current) return 100;
    
    let score = 100;
    
    // Penalize high memory usage
    if (current.percentage > 80) score -= 40;
    else if (current.percentage > 60) score -= 20;
    else if (current.percentage > 40) score -= 10;
    
    // Penalize memory growth
    const growthRate = this.getGrowthRate();
    if (growthRate > 2) score -= 30;
    else if (growthRate > 1) score -= 15;
    else if (growthRate > 0.5) score -= 5;
    
    // Penalize low GC activity when memory is high
    if (current.percentage > 60 && this.gcEvents < 5) score -= 10;
    
    return Math.max(0, score);
  }
  
  /**
   * Get peak memory usage
   */
  private getPeakUsage(): MemorySnapshot {
    return this.snapshots.reduce((peak, current) => 
      current.used > peak.used ? current : peak,
      this.snapshots[0] || { timestamp: 0, used: 0, total: 0, limit: 0, percentage: 0 }
    );
  }
  
  /**
   * Get average memory usage percentage
   */
  private getAverageUsage(): number {
    if (this.snapshots.length === 0) return 0;
    
    const totalPercentage = this.snapshots.reduce((sum, snapshot) => sum + snapshot.percentage, 0);
    return totalPercentage / this.snapshots.length;
  }
  
  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    leaks: MemoryLeak[], 
    growthRate: number, 
    efficiency: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (leaks.length > 0) {
      recommendations.push('Memory leaks detected. Investigate object retention and event listener cleanup.');
    }
    
    if (growthRate > 1) {
      recommendations.push('Significant memory growth detected. Consider implementing object pooling.');
    }
    
    if (efficiency < 50) {
      recommendations.push('Poor memory efficiency. Optimize data structures and reduce object creation.');
    }
    
    const current = this.getCurrentUsage();
    if (current && current.percentage > 80) {
      recommendations.push('High memory usage. Consider reducing texture sizes and geometry complexity.');
    }
    
    if (this.gcEvents < 3 && current && current.percentage > 50) {
      recommendations.push('Low garbage collection activity. Consider manual garbage collection triggers.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Memory usage appears healthy. Continue monitoring for optimal performance.');
    }
    
    return recommendations;
  }
  
  /**
   * Force garbage collection (if available)
   */
  forceGC(): boolean {
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
      return true;
    }
    return false;
  }
  
  /**
   * Clear all tracking data
   */
  reset(): void {
    this.snapshots = [];
    this.gcEvents = 0;
  }
  
  /**
   * Export tracking data for analysis
   */
  exportData(): {
    timestamp: string;
    duration: number;
    snapshots: MemorySnapshot[];
    analysis: MemoryAnalysis;
    gcEvents: number;
  } {
    const duration = this.snapshots.length > 1 
      ? this.snapshots[this.snapshots.length - 1].timestamp - this.snapshots[0].timestamp
      : 0;
    
    return {
      timestamp: new Date().toISOString(),
      duration,
      snapshots: [...this.snapshots],
      analysis: this.analyze(),
      gcEvents: this.gcEvents
    };
  }
  
  /**
   * Get memory usage summary
   */
  getSummary(): {
    current: string;
    peak: string;
    average: string;
    growth: string;
    efficiency: number;
    status: 'healthy' | 'warning' | 'critical';
  } {
    const current = this.getCurrentUsage();
    const peak = this.getPeakUsage();
    const average = this.getAverageUsage();
    const growthRate = this.getGrowthRate();
    const efficiency = this.calculateEfficiency();
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (current && current.percentage > 80) status = 'critical';
    else if (current && current.percentage > 60 || growthRate > 1) status = 'warning';
    
    return {
      current: current ? `${(current.used / 1024 / 1024).toFixed(1)} MB (${current.percentage.toFixed(1)}%)` : 'N/A',
      peak: `${(peak.used / 1024 / 1024).toFixed(1)} MB (${peak.percentage.toFixed(1)}%)`,
      average: `${average.toFixed(1)}%`,
      growth: `${growthRate.toFixed(2)} MB/min`,
      efficiency,
      status
    };
  }
}

/**
 * Factory function to create and auto-start memory tracker
 */
export function createMemoryTracker(autoStart = true, interval = 1000): MemoryTracker {
  const tracker = new MemoryTracker(interval);
  if (autoStart) {
    tracker.start();
  }
  return tracker;
}

/**
 * Global memory tracker instance for easy access
 */
export const globalMemoryTracker = new MemoryTracker();