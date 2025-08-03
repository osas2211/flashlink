'use client'

import { Search } from 'lucide-react'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb_utils'
import { env_vars } from '@/lib/env_vars'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
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
        <ConnectButton
          client={client}
          wallets={wallets}
          chains={[{ rpc: env_vars.RPC_URL, id: 128123, testnet: true }]}
          signInButton={{ className: '!h-[45px]' }}
        />
      </div>
    </header>
  )
}
