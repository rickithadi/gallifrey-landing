import React, { useEffect, useRef } from 'react';

interface WorkOSBackgroundProps {
  className?: string;
}

export const WorkOSBackground: React.FC<WorkOSBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Circuit-like nodes and connections
    const nodes: Array<{ x: number; y: number; pulse: number; connections: number[] }> = [];
    const nodeCount = 12;
    
    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        pulse: Math.random() * Math.PI * 2,
        connections: []
      });
    }

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          if (distance < 200 && node.connections.length < 3) {
            node.connections.push(j);
          }
        }
      });
    });

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8fafa'); // Very light teal-gray
      gradient.addColorStop(0.3, '#f0f7f7'); // Light teal-gray
      gradient.addColorStop(0.7, '#e6f2f2'); // Slightly darker teal-gray
      gradient.addColorStop(1, '#d4e8e8'); // Darker teal-gray
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodes[connectionIndex];
          if (connectedNode) {
            const opacity = 0.1 + 0.05 * Math.sin(time + i * 0.5);
            
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`; // Gallifrey teal color
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        // Update pulse
        node.pulse += 0.02;
        
        const pulseSize = 2 + Math.sin(node.pulse) * 1;
        const opacity = 0.3 + 0.2 * Math.sin(node.pulse);
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseSize * 3
        );
        glowGradient.addColorStop(0, `rgba(20, 184, 166, ${opacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core node
        ctx.fillStyle = `rgba(20, 184, 166, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating particles
      const particleCount = 8;
      for (let index = 0; index < particleCount; index++) {
        const x = (Math.sin(time * 0.5 + index) * 100) + canvas.width * 0.5;
        const y = (Math.cos(time * 0.3 + index * 0.7) * 80) + canvas.height * 0.5;
        const size = 1 + Math.sin(time * 2 + index) * 0.5;
        const opacity = 0.1 + 0.1 * Math.sin(time * 3 + index);
        
        ctx.fillStyle = `rgba(13, 148, 136, ${opacity})`; // Gallifrey teal-dark color
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};