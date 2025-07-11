'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Shield, ExternalLink } from 'lucide-react'
import Table from '@/components/ui/Table'
import TradingChart from '@/components/TradingChart'
import { Card } from '@/components/ui/Card'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Volume',
      value: '$2,847,392',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'neon-green',
    },
    {
      title: 'Avg Slippage',
      value: '0.08%',
      change: '-0.02%',
      icon: Shield,
      color: 'neon-cyan',
    },
    {
      title: 'Fees Saved',
      value: '$4,829',
      change: '+8.3%',
      icon: DollarSign,
      color: 'neon-purple',
    },
  ]

  const recentSwaps = [
    {
      id: '1',
      from: 'ETH',
      to: 'USDC',
      amount: '2.5 ETH',
      value: '$4,250.00',
      time: '2 min ago',
      status: 'Completed',
    },
    {
      id: '2',
      from: 'USDC',
      to: 'WBTC',
      amount: '10,000 USDC',
      value: '$10,000.00',
      time: '15 min ago',
      status: 'Completed',
    },
    {
      id: '3',
      from: 'UNI',
      to: 'ETH',
      amount: '500 UNI',
      value: '$2,850.00',
      time: '1 hour ago',
      status: 'Completed',
    },
    {
      id: '4',
      from: 'WBTC',
      to: 'USDT',
      amount: '0.25 WBTC',
      value: '$10,750.00',
      time: '2 hours ago',
      status: 'Completed',
    },
    {
      id: '5',
      from: 'ETH',
      to: 'UNI',
      amount: '1.8 ETH',
      value: '$3,060.00',
      time: '3 hours ago',
      status: 'Completed',
    },
  ]

  const tableHeaders = ['Pair', 'Amount', 'Value', 'Time', 'Status', '']
  const tableData = recentSwaps.map(swap => [
    `${swap.from}/${swap.to}`,
    swap.amount,
    swap.value,
    swap.time,
    <span
      key={swap.id}
      className="inline-flex px-2 py-1 text-xs font-medium bg-neon-green/20 text-neon-green rounded-full"
    >
      {swap.status}
    </span>,
    <button
      key={`${swap.id}-link`}
      className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
    >
      <ExternalLink className="h-4 w-4" />
    </button>,
  ])

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-foreground-secondary">Track your trading performance and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:border-neon-cyan/30 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}/20 rounded-2xl`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-neon-green' : 'text-neon-pink'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-foreground-secondary text-sm">{stat.title}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trading Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <TradingChart />
        </motion.div>

        {/* Recent Swaps Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Swaps</h2>
                <button className="text-neon-cyan hover:text-neon-cyan/80 transition-colors text-sm font-medium">
                  View All
                </button>
              </div>
              <Table headers={tableHeaders} data={tableData} />
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
