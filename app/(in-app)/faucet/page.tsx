'use client'

import { useState } from 'react'
import { Droplets, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { tokenAddresses, tokenOptionsTestnet } from '@/constants/token_addresses'
import { useConnectModal, useActiveAccount } from 'thirdweb/react'
import { client } from '@/lib/thirdweb_utils'
import axios from 'axios'

export default function TokenFaucet() {
  const { connect, isConnecting } = useConnectModal()

  const account = useActiveAccount()
  const [selectedToken, setSelectedToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentClaims, setRecentClaims] = useState<
    Array<{ token: string; amount: string; txHash: string }>
  >([])
  const { toast } = useToast()

  const handleClaim = async () => {
    try {
      if (!account?.address) {
        await connect({ client: client })
        return
      }
      if (!selectedToken) {
        toast({
          title: 'Missing Information',
          description: 'Please select a token',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)

      const token = tokenOptionsTestnet.find(t => t.address === selectedToken)

      const res = await axios.post('/api/send-tokens', {
        to: account?.address!,
        contract_address: token?.address!,
      })
      console.log(res)

      setRecentClaims(prev => [
        {
          token: token?.symbol!,
          amount: '1000',
          txHash: '',
        },
        ...prev.slice(0, 4),
      ])

      toast({
        title: 'Tokens Claimed Successfully!',
        description: `${1000} ${selectedToken} has been sent to your wallet.`,
      })

      setIsLoading(false)
      setSelectedToken('')
    } catch (error: any) {
      setIsLoading(false)
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Claiming Failed',
        description: error?.data?.message || error?.message,
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Transaction hash copied to clipboard.',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Droplets className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Flashlink Faucet
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Get free testnet tokens for testing purposes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Faucet Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Claim Tokens
              </CardTitle>
              <CardDescription>
                Select a token and enter your wallet address to receive free testnet tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="token-select">Select Token</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger id="token-select">
                    <SelectValue placeholder="Choose a token to claim" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenOptionsTestnet.map(token => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center gap-3">
                          <img src={token.icon} className="h-8 w-8" />
                          <div>
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-sm text-muted-foreground">{token.label}</div>
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            {1000}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <p className="text-sm">{account?.address || 'N/A'}</p>
              </div>

              <Button
                onClick={handleClaim}
                disabled={isLoading || (!account?.address ? false : !selectedToken)}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {account?.address ? (
                      <>
                        <Droplets className="h-4 w-4" />
                        Claim Tokens
                      </>
                    ) : (
                      'Connect Wallet'
                    )}
                  </div>
                )}
              </Button>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Testnet tokens only - no real value</p>
                {/* <p>• One claim per address per 24 hours</p> */}
                <p>• Tokens will arrive within 1-2 minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Available Tokens & Recent Claims */}
          <div className="space-y-6">
            {/* Available Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Tokens</CardTitle>
                <CardDescription>Current faucet distribution amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokenOptionsTestnet.map((token, index) => (
                    <div key={token.symbol}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={token.icon} className="h-8 w-8" />
                          <div>
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-sm text-muted-foreground">{token.label}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="font-mono text-xs">
                          Available
                        </Badge>
                      </div>
                      {index < tokenOptionsTestnet.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Claims */}
            {recentClaims.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Claims</CardTitle>
                  <CardDescription>Your recent token claims</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentClaims.map((claim, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {claim.token}
                            </Badge>
                            <span className="font-medium">{claim.amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(claim.txHash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          {claim.txHash.slice(0, 10)}...{claim.txHash.slice(-8)}
                        </div>
                        {index < recentClaims.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
