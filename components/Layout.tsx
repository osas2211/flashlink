'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button' 
import { WalletConnectModal, ConnectedWallet } from './WalletConnectModal'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Swap', href: '/swap' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Settings', href: '/settings' },
  ]

  const handleWalletConnect = (walletName: string) => {
    setConnectedWallet(walletName)
  }

  const handleWalletDisconnect = () => {
    setConnectedWallet(null)
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50">
        <nav className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-neon rounded-2xl group-hover:shadow-neon transition-all duration-300">
                <Zap className="h-6 w-6 text-neon-cyan" />
              </div>
              <span className="text-xl font-bold neon-text">FlashLink </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-2xl transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Wallet Connection */}
            <div className="hidden md:block">
              {connectedWallet ? (
                <ConnectedWallet
                  walletName={connectedWallet}
                  onDisconnect={handleWalletDisconnect}
                />
              ) : (
                <Button onClick={() => setWalletModalOpen(true)}>Connect Wallet</Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-2xl hover:bg-background-tertiary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-col space-y-2">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-2xl transition-all duration-300 ${
                      pathname === item.href
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2">
                  {connectedWallet ? (
                    <ConnectedWallet
                      walletName={connectedWallet}
                      onDisconnect={handleWalletDisconnect}
                    />
                  ) : (
                    <Button className="w-full" onClick={() => setWalletModalOpen(true)}>
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-secondary/30">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Zap className="h-5 w-5 text-neon-cyan" />
              <span className="text-sm text-foreground-secondary">
                © 2024 FlashLink. MEV-Resistant DeFi Router.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-foreground-secondary">
              <Link href="#" className="hover:text-neon-cyan transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-neon-cyan transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-neon-cyan transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  )
}
