'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff0033] via-[#ff006e] to-[#ff0033] origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Glow effect for progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ff0033] via-[#ff006e] to-[#ff0033] origin-left z-40 blur-sm opacity-60"
        style={{ scaleX }}
      />
    </>
  );
}
