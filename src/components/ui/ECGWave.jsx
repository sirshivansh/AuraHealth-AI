import { motion } from 'framer-motion';

/**
 * Animated ECG/heart-rate waveform rendered as an SVG path.
 * Uses Framer Motion pathLength for a continuous drawing animation.
 */
export default function ECGWave() {
  const path =
    'M0,50 L20,50 L25,50 L30,20 L35,80 L40,50 L60,50 L65,50 L70,15 L75,85 L80,50 L100,50 L120,50 L125,50 L130,20 L135,80 L140,50 L160,50 L165,50 L170,15 L175,85 L180,50 L200,50';

  return (
    <svg viewBox="0 0 200 100" className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
          <stop offset="30%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="70%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="url(#ecgGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ecgGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
      />
    </svg>
  );
}
