'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from './ParallaxSection';

export default function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="vision"
      ref={ref}
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        <ParallaxSection offset={60}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 font-[family-name:var(--font-space-grotesk)]">
              What&apos;s Coming
            </h2>

            <div className="space-y-8 text-lg md:text-xl leading-relaxed text-zinc-300 font-[family-name:var(--font-inter)]">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                We&apos;re developing a revolutionary AI platform that{' '}
                <span className="text-[#ff0033] font-semibold">automates the impossible</span>, 
                unlocking new levels of productivity and innovation for forward-thinking organizations.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                From intelligent process orchestration to adaptive decision-making engines, 
                SYNTHETICA will redefine what machines can do for you.{' '}
                <span className="text-[#00ffff] font-semibold">
                  The future is autonomous. The future is now.
                </span>
              </motion.p>
            </div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 flex justify-center gap-4"
            >
              <div className="w-3 h-3 bg-[#ff0033] rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-[#ff006e] rounded-full animate-pulse delay-75" />
              <div className="w-3 h-3 bg-[#00ffff] rounded-full animate-pulse delay-150" />
            </motion.div>
          </motion.div>
        </ParallaxSection>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-[#ff0033]/30 rounded-lg rotate-12 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-[#00ffff]/30 rounded-lg -rotate-12 pointer-events-none" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#00ffff]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </section>
  );
}
