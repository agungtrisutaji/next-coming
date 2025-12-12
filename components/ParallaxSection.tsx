'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export default function ParallaxSection({
  children,
  className = '',
  offset = 50,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Reduce offset for smoother, more premium feel (30% reduction)
  // Completely disable parallax if user prefers reduced motion
  const effectiveOffset = prefersReducedMotion ? 0 : offset * 0.7;
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [effectiveOffset, -effectiveOffset],
    { ease: (t) => t * t * (3 - 2 * t) } // Smooth ease-in-out curve
  );

  return (
    <motion.div 
      ref={ref} 
      style={{ y: prefersReducedMotion ? 0 : y }} 
      className={className}
      data-parallax="true"
    >
      {children}
    </motion.div>
  );
}
