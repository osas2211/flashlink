'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
  className?: string
  size?: string
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gradient-to-r from-neon-cyan to-neon-purple text-black hover:shadow-neon focus:ring-neon-cyan',
    secondary:
      'bg-background-secondary border border-border hover:border-neon-cyan/50 text-foreground hover:bg-background-tertiary focus:ring-neon-cyan/50',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant as 'primary']} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
