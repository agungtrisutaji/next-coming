'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ParallaxSection from './ParallaxSection';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-[family-name:var(--font-space-grotesk)]">
              Who We Are
            </h2>
            <div className="space-y-6 text-lg md:text-xl leading-relaxed text-zinc-300 font-[family-name:var(--font-inter)]">
              <p>
                We are <span className="text-[#ff0033] font-semibold">SYNTHETICA</span>, 
                a next-generation technology company at the intersection of artificial 
                intelligence and enterprise automation.
              </p>
              <p>
                Our mission is to build intelligent systems that think, learn, and act—transforming 
                how businesses operate in an increasingly complex digital landscape.
              </p>
            </div>
          </motion.div>

          {/* Visual element */}
          <ParallaxSection offset={80}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square relative">
                {/* Animated geometric shape */}
                <div className="absolute inset-0 border-2 border-[#ff0033] rounded-lg rotate-6 animate-pulse" />
                <div className="absolute inset-8 border-2 border-[#00ffff] rounded-lg -rotate-6" />
                <div className="absolute inset-16 bg-gradient-to-br from-[#ff0033]/20 to-[#00ffff]/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                  <div className="text-6xl md:text-8xl font-bold text-white/10 font-[family-name:var(--font-space-grotesk)]">
                    AI
                  </div>
                </div>
              </div>
            </motion.div>
          </ParallaxSection>
        </div>
      </div>

      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ff0033]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </section>
  );
}
