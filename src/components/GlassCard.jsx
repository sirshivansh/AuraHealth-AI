import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick, 
  delay = 0,
  animate = true
}) => {
  const cardClass = `glass-panel rounded-2xl p-6 ${className} ${hover ? 'glass-panel-hover' : ''} ${onClick ? 'cursor-pointer' : ''}`;

  if (!animate) {
    return (
      <div 
        className={cardClass}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1], // Custom elegant ease-out
        delay 
      }}
      className={cardClass}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
