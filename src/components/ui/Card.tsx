import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <motion.div 
      whileHover={onClick ? { y: -4 } : {}}
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl p-6 shadow-sm border border-border transition-all duration-300",
        onClick ? "cursor-pointer hover:shadow-xl hover:border-accent/40" : "",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
