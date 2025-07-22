'use client'

import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WalletConnectModal, ConnectedWallet } from './WalletConnectModal'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb_utils'
import { env_vars } from '@/lib/env_vars'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)

  const handleWalletConnect = (walletName: string) => {
    setConnectedWallet(walletName)
  }

  const handleWalletDisconnect = () => {
    setConnectedWallet(null)
  }

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-background-secondary/80 backdrop-blur-sm border-b border-border z-30 flex items-center justify-between px-6"
      style={{ left: sidebarCollapsed ? 80 : 280 }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
          <input
            type="text"
            placeholder="Search tokens, pools..."
            className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-neon-pink rounded-full"></span>
        </Button>

        {/* Wallet */}
        {/* {connectedWallet ? (
          <ConnectedWallet walletName={connectedWallet} onDisconnect={handleWalletDisconnect} />
        ) : (
          <Button onClick={() => setWalletModalOpen(true)}>Connect Wallet</Button>
        )} */}
        <ConnectButton
          client={client}
          wallets={wallets}
          chains={[{ rpc: env_vars.RPC_URL, id: 11155111 }]}
          signInButton={{ className: '!h-[45px]' }}
        />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </header>
  )
}
