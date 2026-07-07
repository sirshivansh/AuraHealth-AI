import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds, then trigger exit
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation to finish before unmounting
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(250,85,67,0.2) 0%, transparent 70%)' }} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Animated Logo */}
            <motion.div 
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="p-4 bg-primary-500/20 rounded-2xl mb-8 border border-primary-500/30"
            >
              <Activity className="h-12 w-12 text-primary-400" />
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3 text-center"
            >
              Developed by <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Shivansh Mishra</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-zinc-400 text-sm md:text-base font-medium tracking-wide font-mono"
            >
              www.github.com/sirshivansh/AuraHealth-Ai
            </motion.p>
          </motion.div>

          {/* Loading line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 w-full origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
