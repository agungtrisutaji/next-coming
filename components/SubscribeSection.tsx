'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import SubscribeForm from './SubscribeForm';

export default function SubscribeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="subscribe"
      ref={ref}
      className="relative py-28 md:py-36 lg:py-48 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Section heading */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-[family-name:var(--font-space-grotesk)]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Be the First to Know
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-zinc-300 mb-12 font-[family-name:var(--font-inter)] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our exclusive waitlist and get early access when we launch.
          </motion.p>

          {/* Subscribe form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SubscribeForm />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative animated grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#ff0033 1px, transparent 1px), linear-gradient(90deg, #ff0033 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating particles */}
      {isInView && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#ff0033]/30 rounded-full pointer-events-none"
              initial={{ 
                x: Math.random() * 100 - 50 + '%',
                y: '110%',
                opacity: 0 
              }}
              animate={{ 
                y: '-10%',
                opacity: [0, 1, 0],
              }}
              transition={{ 
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'linear'
              }}
              style={{ left: `${20 + i * 15}%` }}
            />
          ))}
        </>
      )}

      {/* Glow effect */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#ff0033]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#ff0033]/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#00ffff]/20 pointer-events-none" />
    </section>
  );
}
