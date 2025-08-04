'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  ArrowLeftRight,
  BarChart3,
  Settings,
  TrendingUp,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Swap', href: '/swap', icon: ArrowLeftRight },
  { name: 'Transactions', href: '/transactions', icon: BarChart3 },
  { name: 'Faucet', href: '/faucet', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const features = [
  { name: 'MEV Protection', icon: Shield, status: 'Active' },
  { name: 'Auto Slippage', icon: Zap, status: 'Enabled' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-full bg-background-secondary border-r border-border z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-neon rounded-2xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold neon-text">FlashLink</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="flex justify-center w-full">
              <div className="p-2 bg-gradient-neon rounded-2xl">
                <Zap className="h-5 w-5 text-black" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 rounded-2xl transition-all duration-300 group',
                    isActive
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium truncate">{item.name}</span>}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Features Status */}
        {!collapsed && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-3">
              Features
            </h3>
            <div className="space-y-2">
              {features.map(feature => (
                <div
                  key={feature.name}
                  className="flex items-center justify-between p-3 bg-background-tertiary rounded-2xl"
                >
                  <div className="flex items-center space-x-2">
                    <feature.icon className="h-4 w-4 text-neon-green" />
                    <span className="text-sm font-medium">{feature.name}</span>
                  </div>
                  <span className="text-xs text-neon-green bg-neon-green/20 px-2 py-1 rounded-full">
                    {feature.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" onClick={onToggle} className="w-full justify-center">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  )
}
