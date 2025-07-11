'use client'

import { useState } from 'react'
import { format, subDays, subHours } from 'date-fns'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react'

// Generate realistic price data
const generatePriceData = (days: number, basePrice = 1700) => {
  const data = []
  let currentPrice = basePrice
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i)

    // Add some realistic price volatility
    const volatility = 0.02 // 2% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility
    currentPrice = currentPrice * (1 + change)

    // Add some trend bias
    const trendBias = i > days / 2 ? 0.001 : -0.0005
    currentPrice = currentPrice * (1 + trendBias)

    data.push({
      date: format(date, 'MMM dd'),
      timestamp: date.getTime(),
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000, // 10M-60M volume
      high: Math.round(currentPrice * 1.02 * 100) / 100,
      low: Math.round(currentPrice * 0.98 * 100) / 100,
    })
  }

  return data
}

// Generate hourly data for shorter timeframes
const generateHourlyData = (hours: number, basePrice = 1700) => {
  const data = []
  let currentPrice = basePrice
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const date = subHours(now, i)

    const volatility = 0.005 // 0.5% hourly volatility
    const change = (Math.random() - 0.5) * 2 * volatility
    currentPrice = currentPrice * (1 + change)

    data.push({
      date: format(date, 'HH:mm'),
      timestamp: date.getTime(),
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 5000000) + 1000000, // 1M-6M volume
      high: Math.round(currentPrice * 1.005 * 100) / 100,
      low: Math.round(currentPrice * 0.995 * 100) / 100,
    })
  }

  return data
}

const timeframes = [
  { label: '1H', value: '1h', data: () => generateHourlyData(24) },
  { label: '1D', value: '1d', data: () => generatePriceData(7) },
  { label: '1W', value: '1w', data: () => generatePriceData(30) },
  { label: '1M', value: '1m', data: () => generatePriceData(90) },
  { label: '1Y', value: '1y', data: () => generatePriceData(365) },
]

const chartTypes = [
  { label: 'Line', value: 'line', icon: Activity },
  { label: 'Area', value: 'area', icon: TrendingUp },
  { label: 'Volume', value: 'volume', icon: BarChart3 },
]

export default function TradingChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d')
  const [selectedChartType, setSelectedChartType] = useState('area')
  const [chartData, setChartData] = useState(() => generatePriceData(7))

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe)
    const timeframeConfig = timeframes.find(t => t.value === timeframe)
    if (timeframeConfig) {
      setChartData(timeframeConfig.data())
    }
  }

  const currentPrice = chartData[chartData.length - 1]?.price || 0
  const previousPrice = chartData[chartData.length - 2]?.price || 0
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2)
  const isPositive = priceChange >= 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-secondary border border-border rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{' '}
              {entry.name === 'Volume'
                ? `$${(entry.value / 1000000).toFixed(1)}M`
                : `$${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (selectedChartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                domain={['dataMin - 50', 'dataMax + 50']}
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `$${value.toLocaleString()}`}
              />
              <CustomTooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#00ffff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#00ffff', strokeWidth: 2, fill: '#00ffff' }}
                name="Price"
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                domain={['dataMin - 50', 'dataMax + 50']}
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `$${value.toLocaleString()}`}
              />
              <CustomTooltip />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00ffff"
                strokeWidth={2}
                fill="url(#priceGradient)"
                name="Price"
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'volume':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `$${(value / 1000000).toFixed(0)}M`}
              />
              <CustomTooltip />
              <Bar dataKey="volume" fill="#a855f7" opacity={0.8} name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">ETH/USD</h2>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? '+' : ''}
              {priceChangePercent}%
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${currentPrice.toLocaleString()}</span>
            <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-2">
          {chartTypes.map(type => (
            <Button
              key={type.value}
              variant={selectedChartType === type.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedChartType(type.value)}
              className="gap-2"
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-6">
        {timeframes.map(timeframe => (
          <Button
            key={timeframe.value}
            variant={selectedTimeframe === timeframe.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleTimeframeChange(timeframe.value)}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">{renderChart()}</div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">24h High</p>
          <p className="text-lg font-semibold">
            ${Math.max(...chartData.map(d => d.high)).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">24h Low</p>
          <p className="text-lg font-semibold">
            ${Math.min(...chartData.map(d => d.low)).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="text-lg font-semibold">
            ${(chartData.reduce((acc, d) => acc + d.volume, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <p className="text-lg font-semibold">$204.8B</p>
        </div>
      </div>
    </Card>
  )
}
