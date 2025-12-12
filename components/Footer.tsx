'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

const socialLinks = [
  { name: 'Twitter/X', href: '#', icon: '𝕏' },
  { name: 'LinkedIn', href: '#', icon: 'in' },
  { name: 'GitHub', href: '#', icon: 'GH' },
];

// Magnetic social link component
function MagneticSocialLink({ 
  href, 
  icon, 
  name, 
  index 
}: { 
  href: string; 
  icon: string; 
  name: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-14 h-14 flex items-center justify-center bg-white/5 border border-zinc-800 rounded-xl text-white transition-colors duration-300"
      aria-label={name}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff0033] to-[#ff006e] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
      />
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: '0 0 20px rgba(255, 0, 51, 0.4), inset 0 0 20px rgba(255, 0, 51, 0.1)',
        }}
      />
      
      {/* Border animation */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#ff0033]/50 transition-colors duration-300"
      />
      
      <span className="relative z-10 text-lg font-mono group-hover:text-[#ff0033] transition-colors duration-300">
        {icon}
      </span>
    </motion.a>
  );
}

export default function Footer() {
  return (
    <footer className="relative py-16 md:py-24 overflow-hidden border-t border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center space-y-10">
          {/* Heading with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
              Stay Connected
            </h3>
            <p className="text-zinc-400 font-[family-name:var(--font-inter)]">
              Follow our journey as we build the future of intelligent automation.
            </p>
            
            {/* Subtle glow behind text */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-[#ff0033]/10 rounded-full blur-2xl pointer-events-none"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Social links with magnetic effect */}
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => (
              <MagneticSocialLink
                key={social.name}
                href={social.href}
                icon={social.icon}
                name={social.name}
                index={index}
              />
            ))}
          </div>

          {/* Brand logo with pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8"
          >
            <motion.div 
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-xl font-bold text-white/50 font-[family-name:var(--font-space-grotesk)]">
                AUTECHMATION
              </span>
            </motion.div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-4 border-t border-zinc-900/50"
          >
            <p className="text-sm text-zinc-600 font-[family-name:var(--font-inter)]">
              © 2025 AUTECHMATION. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff0033] to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Corner accents */}
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[#ff0033]/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#00ffff]/20 pointer-events-none" />
    </footer>
  );
}
