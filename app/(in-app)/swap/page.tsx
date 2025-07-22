'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownUp, Settings, Info, Zap, TrendingUp, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import TradingChart from '../../../components/TradingChart'
import { tokenAddresses, tokenOptionsTestnet } from '@/constants/token_addresses'
import { TokenIcon, TokenName, TokenProvider, TokenSymbol } from 'thirdweb/react'
import { client } from '@/lib/thirdweb_utils'
import { env_vars } from '@/lib/env_vars'
import { findBestPath } from '@/lib/find_best_path'

export default function Swap() {
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [slippage, setSlippage] = useState('0.5')
  const { toast } = useToast()

  const getTokenData = (tokenValue: string) =>
    tokenOptionsTestnet.find(token => token.address === tokenValue) || tokenOptionsTestnet[0]
  const paths = [
    [tokenAddresses.USDC, tokenAddresses.DAI, tokenAddresses.WBTC],
    [tokenAddresses.USDC, tokenAddresses.DAI],
    [tokenAddresses.USDC, tokenAddresses.WBTC],
  ]

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleEstimateRoute = async () => {
    if (!fromAmount) {
      toast({
        title: 'Enter Amount',
        description: 'Please enter an amount to swap',
        variant: 'destructive',
      })
      return
    }

    setIsEstimating(true)

    // Simulate route estimation
    // await new Promise(resolve => setTimeout(resolve, 1500))
    const bestPath = await findBestPath(BigInt(1), paths)
    const route = bestPath.bestPath.map(address => {
      return {
        _symbol: tokenOptionsTestnet.find(data => data.address === address)?.symbol,
        address,
      }
    })
    console.log(route)
    const rate = fromToken === 'ETH' ? 1700 : fromToken === 'WBTC' ? 43000 : 1
    const estimated = (Number.parseFloat(fromAmount) * rate * 0.997).toFixed(2)
    setToAmount(estimated)
    setIsEstimating(false)

    toast({
      title: 'Route Estimated',
      description: `Best route found with ${slippage}% slippage`,
    })
  }

  const handleExecuteSwap = async () => {
    if (!fromAmount || !toAmount) {
      toast({
        title: 'Complete Swap Details',
        description: 'Please estimate route first',
        variant: 'destructive',
      })
      return
    }

    setIsSwapping(true)

    // Simulate swap execution
    await new Promise(resolve => setTimeout(resolve, 3000))

    setIsSwapping(false)
    setFromAmount('')
    setToAmount('')

    toast({
      title: 'Swap Successful! 🎉',
      description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
    })
  }

  const fromTokenData = getTokenData(fromToken)
  const toTokenData = getTokenData(toToken)

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-5 md:mb-10">
        <h1 className="text-3xl font-bold mb-2">Swap Tokens</h1>
        <p className="text-foreground-secondary">Trade tokens with MEV protection and best rates</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Swap Interface */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Exchange</h2>
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-background-tertiary">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Swap Settings</DialogTitle>
                      <DialogDescription>Configure your swap preferences</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Slippage Tolerance</label>
                        <div className="flex gap-2">
                          {['0.1', '0.5', '1.0'].map(value => (
                            <Button
                              key={value}
                              variant={slippage === value ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={() => setSlippage(value)}
                            >
                              {value}%
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Transaction Deadline
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue="20"
                            className="flex-1 px-3 py-2 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                          />
                          <span className="text-sm text-muted-foreground">minutes</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* From Token */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground-secondary mb-3">
                  From
                </label>
                <div className="bg-background-tertiary rounded-2xl p-4 border border-border hover:border-neon-cyan/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={e => setFromAmount(e.target.value)}
                      className="bg-transparent text-2xl font-semibold outline-none flex-1 placeholder:text-foreground-secondary/50 w-[60%] pr-4"
                    />
                    <Select value={fromToken} onValueChange={setFromToken}>
                      <SelectTrigger className="w-36 border-0 bg-background-secondary hover:bg-background">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {/* <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {fromTokenData.icon}
                            </div> */}
                            <span className="font-medium">{fromTokenData.symbol}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {/* {tokens.map(token => (
                          <SelectItem key={token.value} value={token.value}>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: token.color + '20', color: token.color }}
                              >
                                {token.icon}
                              </div>
                              <div>
                                <div className="font-medium">{token.symbol}</div>
                                <div className="text-xs text-muted-foreground">{token.label}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))} */}

                        {tokenOptionsTestnet.map((token, index) => (
                          <SelectItem key={token.address} value={token.address}>
                            <TokenProvider
                              address={token.address}
                              chain={{ rpc: env_vars.RPC_URL, id: 11155111 }}
                              client={client}
                            >
                              {/* <TokenIcon height={50} width={50} iconResolver={token.icon} /> */}
                              {/* <img src={token.icon} alt="" /> */}
                              <TokenIcon />
                              <TokenSymbol />
                            </TokenProvider>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      Balance: 0 {fromTokenData.symbol}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground-secondary">{0}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-neon-cyan hover:text-neon-cyan/80"
                        onClick={() => setFromAmount('')}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center my-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSwapTokens}
                  className="p-3 bg-background-secondary border-2 border-border rounded-2xl hover:border-neon-cyan/50 transition-all duration-300 group"
                >
                  <ArrowDownUp className="h-5 w-5 text-neon-cyan group-hover:rotate-180 transition-transform duration-300" />
                </motion.button>
              </div>

              {/* To Token */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground-secondary mb-3">
                  To
                </label>
                <div className="bg-background-tertiary rounded-2xl p-4 border border-border hover:border-neon-cyan/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={toAmount}
                      onChange={e => setToAmount(e.target.value)}
                      className="bg-transparent text-2xl font-semibold outline-none flex-1 placeholder:text-foreground-secondary/50 w-[60%] pr-4"
                      readOnly
                    />
                    <Select value={toToken} onValueChange={setToToken}>
                      <SelectTrigger className="w-36 border-0 bg-background-secondary hover:bg-background">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {/* <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {toTokenData.icon}
                            </div> */}
                            <span className="font-medium">{toTokenData.symbol}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {/* {tokens.map(token => (
                          <SelectItem key={token.value} value={token.value}>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: token.color + '20', color: token.color }}
                              >
                                {token.icon}
                              </div>
                              <div>
                                <div className="font-medium">{token.symbol}</div>
                                <div className="text-xs text-muted-foreground">{token.label}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))} */}
                        {tokenOptionsTestnet.map((token, index) => (
                          <SelectItem key={token.address} value={token.address}>
                            <TokenProvider
                              address={token.address}
                              chain={{ rpc: env_vars.RPC_URL, id: 11155111 }}
                              client={client}
                            >
                              {/* <TokenIcon height={50} width={50} iconResolver={token.icon} /> */}
                              {/* <img src={token.icon} alt="" /> */}
                              <TokenIcon />
                              <TokenSymbol />
                            </TokenProvider>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      Balance: {0} {toTokenData.symbol}
                    </span>
                    <span className="text-foreground-secondary">{0}</span>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              {toAmount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-background-secondary rounded-2xl p-4 mb-6 border border-border"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Rate</span>
                      <span>
                        1 {fromToken} = {fromToken === 'ETH' ? '1,700' : '1'} {toToken}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Price Impact</span>
                      <span className="text-neon-green">{'<'}0.01%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Network Fee</span>
                      <span>~$12.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Slippage Tolerance</span>
                      <span>{slippage}%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full h-12"
                  onClick={handleEstimateRoute}
                  disabled={!fromAmount || isEstimating}
                >
                  {isEstimating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Estimating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Estimate Route
                    </>
                  )}
                </Button>
                <Button
                  className="w-full h-12 text-lg"
                  onClick={handleExecuteSwap}
                  disabled={!toAmount || isSwapping}
                >
                  {isSwapping ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Swapping...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Execute Swap
                    </>
                  )}
                </Button>
              </div>

              {/* MEV Protection Notice */}
              <div className="mt-4 p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-2xl">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neon-cyan">
                    MEV Protection enabled. Your transaction is protected from front-running and
                    sandwich attacks.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trading Chart */}
        <div className="space-y-6 col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TradingChart />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
