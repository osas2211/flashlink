'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function Portfolio() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const portfolioStats = {
    totalValue: 47832.45,
    totalChange: 2847.32,
    totalChangePercent: 6.32,
    dayChange: 1247.89,
    dayChangePercent: 2.68,
  }

  const holdings = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '⟠',
      balance: 12.5,
      value: 21250.0,
      price: 1700.0,
      change24h: 3.45,
      allocation: 44.4,
      color: '#627EEA',
    },
    {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      icon: '₿',
      balance: 0.35,
      value: 15050.0,
      price: 43000.0,
      change24h: 1.23,
      allocation: 31.5,
      color: '#F7931A',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💵',
      balance: 5250.0,
      value: 5250.0,
      price: 1.0,
      change24h: 0.01,
      allocation: 11.0,
      color: '#2775CA',
    },
    {
      symbol: 'UNI',
      name: 'Uniswap',
      icon: '🦄',
      balance: 850.0,
      value: 4845.0,
      price: 5.7,
      change24h: -2.15,
      allocation: 10.1,
      color: '#FF007A',
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      icon: '🔗',
      balance: 95.0,
      value: 1437.5,
      price: 15.13,
      change24h: 4.67,
      allocation: 3.0,
      color: '#375BD2',
    },
  ]

  const recentTransactions = [
    {
      type: 'buy',
      token: 'ETH',
      amount: 2.5,
      value: 4250.0,
      time: '2 hours ago',
      hash: '0x1234...5678',
    },
    {
      type: 'sell',
      token: 'UNI',
      amount: 150.0,
      value: 855.0,
      time: '1 day ago',
      hash: '0x8765...4321',
    },
    {
      type: 'buy',
      token: 'LINK',
      amount: 25.0,
      value: 378.25,
      time: '2 days ago',
      hash: '0x9876...1234',
    },
  ]

  const timeframes = [
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '1Y', value: '1y' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Portfolio</h1>
            <p className="text-foreground-secondary">Track your DeFi investments and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="hover:bg-background-tertiary"
            >
              {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Token
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Portfolio Value</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl lg:text-4xl font-bold">
                    {balanceVisible ? `$${portfolioStats.totalValue.toLocaleString()}` : '••••••'}
                  </span>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                      portfolioStats.totalChangePercent >= 0
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {portfolioStats.totalChangePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {portfolioStats.totalChangePercent >= 0 ? '+' : ''}
                    {portfolioStats.totalChangePercent.toFixed(2)}%
                  </div>
                </div>
                <p className="text-foreground-secondary mt-1">
                  {balanceVisible
                    ? `${portfolioStats.totalChange >= 0 ? '+' : ''}$${Math.abs(
                        portfolioStats.totalChange
                      ).toLocaleString()} all time`
                    : '•••••• all time'}
                </p>
              </div>
              <div className="flex gap-2">
                {timeframes.map(timeframe => (
                  <Button
                    key={timeframe.value}
                    variant={selectedTimeframe === timeframe.value ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                  >
                    {timeframe.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Portfolio Chart Placeholder */}
            <div className="h-48 bg-background-tertiary rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-neon-cyan mx-auto mb-2" />
                <p className="text-foreground-secondary">Portfolio Performance Chart</p>
              </div>
            </div>
          </Card>

          {/* 24h Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">24h Performance</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-foreground-secondary mb-1">24h Change</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {balanceVisible ? `$${portfolioStats.dayChange.toLocaleString()}` : '••••••'}
                  </span>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      portfolioStats.dayChangePercent >= 0
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {portfolioStats.dayChangePercent >= 0 ? '+' : ''}
                    {portfolioStats.dayChangePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-foreground-secondary mb-2">Top Performer</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: holdings[4].color + '20', color: holdings[4].color }}
                  >
                    {holdings[4].icon}
                  </div>
                  <span className="font-medium">{holdings[4].symbol}</span>
                  <span className="text-green-400 text-sm">
                    +{holdings[4].change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Holdings</h3>
            <Button variant="secondary" size="sm">
              Rebalance
            </Button>
          </div>

          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <motion.div
                key={holding.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-background-secondary rounded-2xl hover:bg-background-tertiary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: holding.color + '20', color: holding.color }}
                  >
                    {holding.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{holding.symbol}</span>
                      <span className="text-sm text-foreground-secondary">{holding.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                      <span>
                        {balanceVisible ? holding.balance.toLocaleString() : '••••'}{' '}
                        {holding.symbol}
                      </span>
                      <span>${holding.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {balanceVisible ? `$${holding.value.toLocaleString()}` : '••••••'}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        holding.change24h >= 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {holding.change24h >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {holding.change24h >= 0 ? '+' : ''}
                      {holding.change24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-sm text-foreground-secondary">
                    {holding.allocation}% of portfolio
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <Button variant="secondary" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-background-secondary rounded-2xl hover:bg-background-tertiary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    {tx.type === 'buy' ? (
                      <ArrowDownRight className="h-5 w-5 text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize">{tx.type}</span>
                      <span className="text-foreground-secondary">{tx.token}</span>
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      {tx.amount} {tx.token} • ${tx.value.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-foreground-secondary mb-1">{tx.time}</div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {tx.hash}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
