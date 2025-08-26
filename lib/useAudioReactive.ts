import { useEffect, useState, useRef, useCallback } from 'react';

interface AudioData {
  volume: number;
  frequency: Float32Array;
  bassLevel: number;
  midLevel: number;
  trebleLevel: number;
  isActive: boolean;
}

interface UseAudioReactiveOptions {
  disabled?: boolean;
  enableMicrophone?: boolean;
  smoothing?: number;
  fftSize?: number;
}

export function useAudioReactive(options: UseAudioReactiveOptions = {}) {
  const {
    disabled = false,
    enableMicrophone = false,
    smoothing = 0.8,
    fftSize = 256
  } = options;

  const [audioData, setAudioData] = useState<AudioData>({
    volume: 0,
    frequency: new Float32Array(fftSize / 2),
    bassLevel: 0,
    midLevel: 0,
    trebleLevel: 0,
    isActive: false
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const dataArrayRef = useRef<Float32Array | null>(null);

  const initializeAudioContext = useCallback(async () => {
    if (disabled || typeof window === 'undefined') return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Create analyser node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = fftSize;
      analyserRef.current.smoothingTimeConstant = smoothing;
      
      // Create data array
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Float32Array(bufferLength);

      if (enableMicrophone) {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });

        // Create source from microphone
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
        
        setHasPermission(true);
      }

      setIsInitialized(true);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      setHasPermission(false);
      setIsInitialized(false);
    }
  }, [disabled, enableMicrophone, fftSize, smoothing]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    // Get frequency data
    const buffer = new Float32Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getFloatFrequencyData(buffer);
    dataArrayRef.current = buffer;
    
    const frequencyData = dataArrayRef.current;
    const bufferLength = frequencyData.length;
    
    // Calculate volume (average of all frequencies)
    let sum = 0;
    let activeFrequencies = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      if (frequencyData[i] > -Infinity) {
        sum += Math.pow(10, frequencyData[i] / 20); // Convert dB to linear
        activeFrequencies++;
      }
    }
    
    const volume = activeFrequencies > 0 ? sum / activeFrequencies : 0;
    
    // Calculate frequency bands
    const bassEnd = Math.floor(bufferLength * 0.1); // 0-10% of spectrum
    const midEnd = Math.floor(bufferLength * 0.5);   // 10-50% of spectrum
    // Treble is 50-100% of spectrum
    
    let bassSum = 0, midSum = 0, trebleSum = 0;
    let bassCount = 0, midCount = 0, trebleCount = 0;
    
    for (let i = 0; i < bassEnd; i++) {
      if (frequencyData[i] > -Infinity) {
        bassSum += Math.pow(10, frequencyData[i] / 20);
        bassCount++;
      }
    }
    
    for (let i = bassEnd; i < midEnd; i++) {
      if (frequencyData[i] > -Infinity) {
        midSum += Math.pow(10, frequencyData[i] / 20);
        midCount++;
      }
    }
    
    for (let i = midEnd; i < bufferLength; i++) {
      if (frequencyData[i] > -Infinity) {
        trebleSum += Math.pow(10, frequencyData[i] / 20);
        trebleCount++;
      }
    }
    
    const bassLevel = bassCount > 0 ? bassSum / bassCount : 0;
    const midLevel = midCount > 0 ? midSum / midCount : 0;
    const trebleLevel = trebleCount > 0 ? trebleSum / trebleCount : 0;
    
    // Normalize levels (0-1 range)
    const maxLevel = Math.max(bassLevel, midLevel, trebleLevel, volume);
    const normalizer = maxLevel > 0 ? 1 / maxLevel : 0;
    
    setAudioData({
      volume: Math.min(volume * normalizer, 1),
      frequency: new Float32Array(frequencyData),
      bassLevel: Math.min(bassLevel * normalizer, 1),
      midLevel: Math.min(midLevel * normalizer, 1),
      trebleLevel: Math.min(trebleLevel * normalizer, 1),
      isActive: volume > 0.001
    });

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  const startAnalysis = useCallback(() => {
    if (isInitialized && analyserRef.current) {
      analyzeAudio();
    }
  }, [isInitialized, analyzeAudio]);

  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (!disabled) {
      initializeAudioContext();
    }

    return () => {
      stopAnalysis();
      
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [disabled, initializeAudioContext, stopAnalysis]);

  // Start/stop analysis based on initialization
  useEffect(() => {
    if (isInitialized && enableMicrophone && hasPermission) {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    return stopAnalysis;
  }, [isInitialized, enableMicrophone, hasPermission, startAnalysis, stopAnalysis]);

  // Handle user interaction to resume audio context (required by browsers)
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // Add click handler to resume audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleInteraction = () => {
        resumeAudioContext();
        // Remove listener after first interaction
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };

      document.addEventListener('click', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };
    }
  }, [resumeAudioContext]);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await initializeAudioContext();
      return true;
    } catch (error) {
      console.warn('Microphone permission denied:', error);
      setHasPermission(false);
      return false;
    }
  }, [initializeAudioContext]);

  return {
    audioData,
    hasPermission,
    isInitialized,
    requestMicrophonePermission,
    resumeAudioContext
  };
}