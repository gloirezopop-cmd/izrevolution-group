import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }: { children: ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; type?: 'button' | 'submit' | 'reset'; variant?: 'primary' | 'secondary' | 'outline'; className?: string; disabled?: boolean }) => {
  const baseStyle = "px-6 py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-primary shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5",
    secondary: "bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary-light",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
  };
  
  return (
    <motion.button 
      whileTap={{ scale: 0.97 }}
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={cn(baseStyle, variants[variant], className)}
    >
      {children}
    </motion.button>
  );
};
