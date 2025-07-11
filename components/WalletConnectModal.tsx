'use client'
import { Wallet, Copy, ExternalLink, LogOut } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (wallet: string) => void
}

const wallets = [
  {
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using browser wallet',
  },
  {
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect using WalletConnect',
  },
  {
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Connect using Coinbase Wallet',
  },
  {
    name: 'Rainbow',
    icon: '🌈',
    description: 'Connect using Rainbow wallet',
  },
]

export function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const { toast } = useToast()

  const handleConnect = (walletName: string) => {
    onConnect(walletName)
    onClose()
    toast({
      title: 'Wallet Connected',
      description: `Successfully connected to ${walletName}`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-neon-cyan" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose your preferred wallet to connect to FlashLink
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {wallets.map(wallet => (
            <Button
              key={wallet.name}
              variant="secondary"
              className="justify-start h-auto p-4 hover:border-neon-cyan/50 bg-transparent"
              onClick={() => handleConnect(wallet.name)}
            >
              <span className="text-2xl mr-3">{wallet.icon}</span>
              <div className="text-left">
                <div className="font-medium">{wallet.name}</div>
                <div className="text-sm text-muted-foreground">{wallet.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ConnectedWalletProps {
  walletName: string
  onDisconnect: () => void
}

export function ConnectedWallet({ walletName, onDisconnect }: ConnectedWalletProps) {
  const { toast } = useToast()
  const address = '0x742d...5A3e' // Mock address

  const copyAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D0A5A3e')
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
    })
  }

  const handleDisconnect = () => {
    onDisconnect()
    toast({
      title: 'Wallet Disconnected',
      description: 'Successfully disconnected wallet',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary" className="gap-2">
          <Wallet className="h-4 w-4" />
          {address}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Connected to {walletName}</p>
          <p className="text-xs text-muted-foreground">{address}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
