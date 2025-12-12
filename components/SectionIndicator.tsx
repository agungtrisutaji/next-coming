'use client';

import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'vision', label: 'Vision' },
  { id: 'subscribe', label: 'Subscribe' },
];

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 2.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-4"
      aria-label="Section navigation"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group flex items-center gap-3"
          aria-label={`Go to ${section.label}`}
          aria-current={activeSection === section.id ? 'true' : undefined}
        >
          {/* Label - shows on hover or when active */}
          <motion.span
            className={`text-xs uppercase tracking-wider font-[family-name:var(--font-inter)] transition-all duration-200 ${
              activeSection === section.id 
                ? 'text-white opacity-100' 
                : 'text-zinc-500 opacity-0 group-hover:opacity-100'
            }`}
          >
            {section.label}
          </motion.span>
          
          {/* Dot indicator */}
          <div className="relative">
            {/* Active glow */}
            {activeSection === section.id && (
              <motion.div
                layoutId="sectionGlow"
                className="absolute -inset-1 bg-[#ff0033]/30 rounded-full blur-sm"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* Dot */}
            <motion.div
              className={`relative w-2.5 h-2.5 rounded-full border-2 transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-[#ff0033] border-[#ff0033] scale-125'
                  : 'bg-transparent border-zinc-600 group-hover:border-zinc-400'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
        </button>
      ))}
      
      {/* Connecting line */}
      <div className="absolute right-[4px] top-[10px] bottom-[10px] w-px bg-zinc-800 -z-10" />
    </motion.nav>
  );
}
