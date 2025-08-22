import React, { useEffect, useState, useRef } from 'react';
import { performanceMonitor, PerformanceMetrics, QualitySettings } from './PerformanceMonitor';
import { useThreePerformance } from './OptimizedHeroScene';

interface PerformanceTestProps {
  duration?: number; // Test duration in seconds
  onComplete?: (results: PerformanceTestResults) => void;
}

interface PerformanceTestResults {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDrops: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
  qualityAdjustments: number;
  gpuTier: string;
  testDuration: number;
  particleCountRange: {
    min: number;
    max: number;
    final: number;
  };
}

export function PerformanceTest({ duration = 30, onComplete }: PerformanceTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentResults, setCurrentResults] = useState<Partial<PerformanceTestResults>>({});
  
  const metricsHistory = useRef<PerformanceMetrics[]>([]);
  const qualityHistory = useRef<QualitySettings[]>([]);
  const testStartTime = useRef<number>(0);
  const initialMemory = useRef<number>(0);
  const peakMemory = useRef<number>(0);
  
  const threePerformance = useThreePerformance();

  const startTest = () => {
    setIsRunning(true);
    setProgress(0);
    metricsHistory.current = [];
    qualityHistory.current = [];
    testStartTime.current = performance.now();
    initialMemory.current = performanceMonitor.updateMetrics().memoryUsage;
    peakMemory.current = initialMemory.current;
    
    console.log('🚀 Starting Three.js Performance Test');
    console.log(`Duration: ${duration}s`);
    console.log(`GPU Tier: ${threePerformance.gpuTier}`);
  };

  const completeTest = useCallback(() => {
    setIsRunning(false);
    setProgress(100);
    
    const metrics = metricsHistory.current;
    const qualities = qualityHistory.current;
    
    if (metrics.length === 0) return;
    
    // Calculate results
    const fps = metrics.map(m => m.fps);
    const particleCounts = qualities.map(q => q.particleCount);
    
    // Count quality adjustments
    let qualityAdjustments = 0;
    for (let i = 1; i < qualities.length; i++) {
      if (qualities[i].particleCount !== qualities[i - 1].particleCount ||
          qualities[i].connectionLines !== qualities[i - 1].connectionLines ||
          qualities[i].animationComplexity !== qualities[i - 1].animationComplexity) {
        qualityAdjustments++;
      }
    }
    
    // Count frame drops (FPS below 30)
    const frameDrops = fps.filter(f => f < 30).length;
    
    const results: PerformanceTestResults = {
      averageFPS: fps.reduce((sum, f) => sum + f, 0) / fps.length,
      minFPS: Math.min(...fps),
      maxFPS: Math.max(...fps),
      frameDrops,
      memoryUsage: {
        initial: initialMemory.current,
        peak: peakMemory.current,
        final: metrics[metrics.length - 1]?.memoryUsage || 0
      },
      qualityAdjustments,
      gpuTier: threePerformance.gpuTier,
      testDuration: duration,
      particleCountRange: {
        min: Math.min(...particleCounts),
        max: Math.max(...particleCounts),
        final: qualities[qualities.length - 1]?.particleCount || 0
      }
    };
    
    setCurrentResults(results);
    
    console.log('✅ Performance Test Complete');
    console.log('Results:', results);
    
    if (onComplete) {
      onComplete(results);
    }
  }, [duration, onComplete, threePerformance.gpuTier]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const metrics = performanceMonitor.updateMetrics();
      const quality = performanceMonitor.getCurrentQuality();
      
      metricsHistory.current.push(metrics);
      qualityHistory.current.push({ ...quality });
      
      // Track peak memory usage
      if (metrics.memoryUsage > peakMemory.current) {
        peakMemory.current = metrics.memoryUsage;
      }
      
      const elapsed = (performance.now() - testStartTime.current) / 1000;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);
      
      // Update current results for real-time display
      if (metricsHistory.current.length > 0) {
        const fps = metricsHistory.current.map(m => m.fps);
        const particleCounts = qualityHistory.current.map(q => q.particleCount);
        
        setCurrentResults({
          averageFPS: fps.reduce((sum, f) => sum + f, 0) / fps.length,
          minFPS: Math.min(...fps),
          maxFPS: Math.max(...fps),
          memoryUsage: {
            initial: initialMemory.current,
            peak: peakMemory.current,
            final: metrics.memoryUsage
          },
          particleCountRange: {
            min: Math.min(...particleCounts),
            max: Math.max(...particleCounts),
            final: quality.particleCount
          }
        });
      }
      
      // Complete test
      if (elapsed >= duration) {
        completeTest();
      }
    }, 100); // Sample every 100ms

    return () => clearInterval(interval);
  }, [isRunning, duration, completeTest]);

  const getPerformanceGrade = (fps: number): string => {
    if (fps >= 55) return 'A+';
    if (fps >= 45) return 'A';
    if (fps >= 35) return 'B';
    if (fps >= 25) return 'C';
    return 'D';
  };

  const getMemoryEfficiency = (initial: number, peak: number): string => {
    const increase = ((peak - initial) / initial) * 100;
    if (increase < 20) return 'Excellent';
    if (increase < 50) return 'Good';
    if (increase < 100) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white text-sm p-4 rounded-lg font-mono z-50 max-w-sm">
      <h3 className="font-bold mb-2">🎮 Three.js Performance Test</h3>
      
      {!isRunning && progress === 0 && (
        <button
          onClick={startTest}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
        >
          Start Test ({duration}s)
        </button>
      )}
      
      {isRunning && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div>Progress: {Math.round(progress)}%</div>
        </div>
      )}
      
      {currentResults.averageFPS && (
        <div className="mt-3 space-y-1">
          <div className="text-lg font-bold">
            FPS: {Math.round(currentResults.averageFPS || 0)} 
            <span className="ml-2 text-sm">
              ({getPerformanceGrade(currentResults.averageFPS || 0)})
            </span>
          </div>
          
          <div>Range: {Math.round(currentResults.minFPS || 0)}-{Math.round(currentResults.maxFPS || 0)}</div>
          
          <div>GPU: {threePerformance.gpuTier}</div>
          
          <div>Particles: {currentResults.particleCountRange?.final || 0}</div>
          
          {currentResults.memoryUsage && (
            <div>
              Memory: {currentResults.memoryUsage.final.toFixed(1)}MB 
              <span className="ml-1 text-xs">
                ({getMemoryEfficiency(
                  currentResults.memoryUsage.initial, 
                  currentResults.memoryUsage.peak
                )})
              </span>
            </div>
          )}
          
          {progress === 100 && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div>Frame Drops: {currentResults.frameDrops || 0}</div>
              <div>Quality Adjustments: {currentResults.qualityAdjustments || 0}</div>
              <div className="text-green-400 mt-1">✅ Test Complete</div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-400">
        Real-time FPS: {threePerformance.fps}
      </div>
    </div>
  );
}

// Automated performance test hook
export function useAutomatedPerformanceTest(autoStart = false) {
  const [results, setResults] = useState<PerformanceTestResults | null>(null);
  const [isTestAvailable, setIsTestAvailable] = useState(false);

  useEffect(() => {
    // Only enable in development or when explicitly requested
    if (process.env.NODE_ENV === 'development' || autoStart) {
      setIsTestAvailable(true);
      
      if (autoStart) {
        // Auto-start test after a delay to let the scene initialize
        const timer = setTimeout(() => {
          // Test will be started automatically
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [autoStart]);

  return {
    results,
    isTestAvailable,
    onTestComplete: setResults
  };
}