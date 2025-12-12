'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import ParallaxSection from './ParallaxSection';

// Glitch text effect component
function GlitchText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute top-0 left-0 text-[#00ffff] animate-glitch-1 opacity-35"
        aria-hidden="true"
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 text-[#ff0033] animate-glitch-2 opacity-35"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

// Magnetic button component
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-[#ff0033] via-[#ff006e] to-[#ff0033] opacity-0"
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: isHovered 
            ? '0 0 40px rgba(255, 0, 51, 0.6), inset 0 0 20px rgba(255, 0, 51, 0.1)' 
            : '0 0 0px rgba(255, 0, 51, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.button>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        {/* Main headline with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 font-[family-name:var(--font-space-grotesk)]">
            <motion.span 
              className="block text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              COMING
            </motion.span>
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <GlitchText className="bg-gradient-to-r from-[#ff0033] via-[#ff006e] to-[#ff0033] bg-clip-text text-transparent">
                SOON
              </GlitchText>
            </motion.span>
          </h1>
        </motion.div>

        {/* Brand section with parallax */}
        <ParallaxSection offset={15}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="space-y-4"
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white font-[family-name:var(--font-space-grotesk)]"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="relative">
                AUTECHMATION
                <motion.span
                  className="absolute -inset-2 bg-[#ff0033]/10 rounded-lg blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </motion.h2>
            <p className="text-xl md:text-3xl text-zinc-300 font-[family-name:var(--font-inter)] leading-relaxed">
              Intelligence Reimagined. Automation Perfected.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Supporting text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12"
        >
          <p className="text-base md:text-lg text-zinc-400 font-[family-name:var(--font-inter)] leading-relaxed mb-8">
            The future of AI-powered automation is being built. Stay tuned.
          </p>
          
          {/* CTA Button with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <MagneticButton 
              className="px-8 py-4 bg-gradient-to-r from-[#ff0033] to-[#ff006e] text-white font-semibold rounded-lg font-[family-name:var(--font-space-grotesk)] transition-transform hover:scale-105"
            >
              <span className="relative z-10">Join Waitlist</span>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            {/* Text label with better visibility */}
            <span className="text-sm text-zinc-400 uppercase tracking-[0.2em] font-medium font-[family-name:var(--font-inter)] group-hover:text-white transition-colors">
              Scroll to explore
            </span>
            
            {/* Mouse scroll indicator */}
            <div className="relative">
              {/* Pulsing glow background */}
              <motion.div
                className="absolute -inset-2 bg-[#ff0033]/20 rounded-full blur-md"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Mouse shape */}
              <div className="relative w-7 h-12 border-2 border-zinc-500 group-hover:border-[#ff0033] rounded-full flex items-start justify-center p-2 transition-colors">
                <motion.div 
                  className="w-1.5 h-3 bg-[#ff0033] rounded-full"
                  animate={{ y: [0, 18, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
            
            {/* Animated chevrons */}
            <div className="flex flex-col items-center -mt-1">
              <motion.div
                animate={{ opacity: [0.8, 0.3, 0.8], y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-4 h-4 text-[#ff0033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 0.2, 0.5], y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                className="-mt-2"
              >
                <svg className="w-4 h-4 text-[#ff0033]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </motion.a>
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />
      
      {/* Corner accents */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border-l-2 border-t-2 border-[#ff0033]/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 border-r-2 border-b-2 border-[#00ffff]/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
      />
    </section>
  );
}
