'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
  hue: number;
}

interface GridLine {
  type: 'h' | 'v';
  position: number;
  opacity: number;
  layer: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const scrollRef = useRef(0);
  const isMobileRef = useRef(false);
  const frameRef = useRef(0);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobileRef.current) return;
    mouseRef.current.targetX = e.clientX / window.innerWidth;
    mouseRef.current.targetY = e.clientY / window.innerHeight;
  }, []);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    scrollRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect mobile
    isMobileRef.current = window.innerWidth < 768 || 'ontouchstart' in window;

    // Set canvas size with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      isMobileRef.current = window.innerWidth < 768 || 'ontouchstart' in window;
    };
    setCanvasSize();

    // Create particles with layers
    const particleCount = isMobileRef.current ? 40 : 80;
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const layer = Math.floor(Math.random() * 3);
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * (0.3 + layer * 0.2),
        vy: (Math.random() - 0.5) * (0.3 + layer * 0.2),
        size: 1 + layer * 0.8,
        layer,
        hue: Math.random() > 0.7 ? 180 : 0, // Cyan or Red
      });
    }

    // Create grid lines
    const gridLines: GridLine[] = [];
    const gridSpacing = isMobileRef.current ? 100 : 60;
    
    for (let i = 0; i < window.innerWidth; i += gridSpacing) {
      gridLines.push({
        type: 'v',
        position: i,
        opacity: 0.03 + Math.random() * 0.02,
        layer: Math.floor(Math.random() * 2),
      });
    }
    for (let i = 0; i < window.innerHeight * 3; i += gridSpacing) {
      gridLines.push({
        type: 'h',
        position: i,
        opacity: 0.03 + Math.random() * 0.02,
        layer: Math.floor(Math.random() * 2),
      });
    }

    // Event listeners
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop
    let animationId: number;
    
    const animate = () => {
      frameRef.current++;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse interpolation
      const lerpFactor = 0.08;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpFactor;

      const mouseOffsetX = (mouseRef.current.x - 0.5) * 2;
      const mouseOffsetY = (mouseRef.current.y - 0.5) * 2;
      const scrollOffset = scrollRef.current;

      // Draw radial gradient glow
      const gradient = ctx.createRadialGradient(
        width / 2 + mouseOffsetX * 100,
        height / 2 + mouseOffsetY * 100,
        0,
        width / 2,
        height / 2,
        width * 0.8
      );
      gradient.addColorStop(0, 'rgba(255, 0, 51, 0.08)');
      gradient.addColorStop(0.5, 'rgba(10, 10, 10, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid with parallax
      gridLines.forEach((line) => {
        const parallaxMultiplier = 0.1 + line.layer * 0.15;
        const scrollParallax = scrollOffset * parallaxMultiplier;
        const mouseParallax = isMobileRef.current ? 0 : (line.layer + 1) * 10;

        ctx.strokeStyle = `rgba(255, 0, 51, ${line.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        if (line.type === 'v') {
          const x = line.position + mouseOffsetX * mouseParallax;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        } else {
          const y = (line.position - scrollParallax) % (height * 3) - height;
          ctx.moveTo(0, y + mouseOffsetY * mouseParallax);
          ctx.lineTo(width, y + mouseOffsetY * mouseParallax);
        }
        ctx.stroke();
      });

      // Draw and update particles
      particles.forEach((particle, i) => {
        // Layer-based parallax multipliers
        const layerMultipliers = [0.2, 0.5, 1.0];
        const parallaxMult = layerMultipliers[particle.layer];
        
        // Cursor influence (stronger for closer layers)
        const cursorInfluence = isMobileRef.current ? 0 : (particle.layer + 1) * 20;
        
        // Update base position
        particle.baseX += particle.vx;
        particle.baseY += particle.vy;

        // Wrap around edges
        if (particle.baseX < -50) particle.baseX = width + 50;
        if (particle.baseX > width + 50) particle.baseX = -50;
        if (particle.baseY < -50) particle.baseY = height + 50;
        if (particle.baseY > height + 50) particle.baseY = -50;

        // Calculate final position with parallax
        particle.x = particle.baseX + mouseOffsetX * cursorInfluence;
        particle.y = particle.baseY + mouseOffsetY * cursorInfluence - (scrollOffset * parallaxMult * 0.3);

        // Skip if off screen
        if (particle.y < -100 || particle.y > height + 100) return;

        // Draw particle with layer-based opacity and color
        const opacity = 0.3 + particle.layer * 0.2;
        const pulseOffset = Math.sin(frameRef.current * 0.02 + i) * 0.1;
        
        if (particle.hue === 0) {
          ctx.fillStyle = `rgba(255, 0, 51, ${opacity + pulseOffset})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.6 + pulseOffset})`;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow for near particles
        if (particle.layer === 2) {
          ctx.shadowColor = particle.hue === 0 ? '#ff0033' : '#00ffff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw connections (only every 3rd frame for performance)
        if (frameRef.current % 3 === 0) {
          particles.slice(i + 1, i + 10).forEach((other) => {
            if (other.layer !== particle.layer) return;
            
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 120 + particle.layer * 30;

            if (distance < maxDist) {
              const lineOpacity = 0.15 * (1 - distance / maxDist);
              ctx.strokeStyle = particle.hue === 0 
                ? `rgba(255, 0, 51, ${lineOpacity})`
                : `rgba(0, 255, 255, ${lineOpacity * 0.5})`;
              ctx.lineWidth = 0.5 + particle.layer * 0.2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        }
      });

      // Add scanline effect (subtle)
      if (!isMobileRef.current && frameRef.current % 2 === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 2);
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
