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
    <div className="space-y-12 min-h-screen bg-gradient-dark max-w-7xl mx-auto px-4 md:py-16 py-4">
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
            <Zap className="h-5 w-5 text-black" />
            <span className="text-black font-medium">MEV-Resistant Trading</span>
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
            across all major DEXs while staying protected from front-running attacks.
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
            <Link href="/dashboard">
              <Button variant="secondary" className="text-lg px-8 py-4">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className="p-6 text-center hover:border-neon-cyan/30 transition-all duration-300">
                <stat.icon className="h-8 w-8 text-neon-cyan mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-foreground-secondary">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose FlashLink?</h2>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Experience the next generation of DeFi trading with our cutting-edge technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
            >
              <Card className="h-full hover:border-neon-cyan/30 transition-all duration-300 group p-8 text-center">
                <div
                  className={`inline-flex p-4 bg-${feature.color}/20 rounded-3xl mb-6 group-hover:shadow-${feature.color} transition-all duration-300`}
                >
                  <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-foreground-secondary leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Card className="bg-gradient-neon border-0 hover:shadow-neon transition-all duration-500 p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust FlashLink for secure, MEV-resistant DeFi trading
            </p>
            <Link href="/swap">
              <Button
                variant="secondary"
                className="text-lg px-8 py-4 bg-black text-white hover:bg-black/90"
              >
                Swap Now
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
