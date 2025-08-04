'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, TrendingUp, BarChart3, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: 'MEV Protection',
      description: 'Advanced protection against front-running and sandwich attacks',
      color: 'neon-green',
    },
    {
      icon: TrendingUp,
      title: 'Best Rates',
      description: 'Intelligent routing across multiple DEXs for optimal prices',
      color: 'neon-cyan',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute trades in seconds with our optimized infrastructure',
      color: 'neon-purple',
    },
  ]

  const stats = [
    { label: 'Total Volume', value: '$2.8B+', icon: BarChart3 },
    { label: 'Active Users', value: '150K+', icon: Users },
    { label: 'Fees Saved', value: '$12M+', icon: DollarSign },
  ]

  return (
    <div className="space-y-12 min-h-screen bg-gradient-dark max-w-7xl mx-auto px-4 md:py-16 py-4 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-neon rounded-full px-6 py-2 mb-8"
          >
            <Zap className="h-5 w-5 text-white" />
            <span className="text-white font-medium">MEV-Resistant Trading</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="neon-text">FlashLink:</span>
            <br />
            MEV-Resistant DeFi Router
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-foreground-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Trade with confidence using our advanced MEV protection technology. Get the best rates
            across liquidity pools while staying protected from front-running attacks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/swap">
              <Button className="text-lg px-8 py-4">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
