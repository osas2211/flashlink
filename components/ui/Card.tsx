'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  header?: ReactNode
}

export function Card({ children, className = '', header }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-card border border-border rounded-3xl shadow-soft ${className}`}
    >
      {header && <div className="px-6 py-4 border-b border-border">{header}</div>}
      {children}
    </motion.div>
  )
}
