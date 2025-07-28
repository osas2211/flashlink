'use client'

import { useEffect, useState } from 'react'
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
import {
  TokenIcon,
  TokenProvider,
  TokenSymbol,
  useSendTransaction,
  useSendCalls,
  useEstimateGas,
} from 'thirdweb/react'
import { client } from '@/lib/thirdweb_utils'
import { env_vars } from '@/lib/env_vars'
import { useWalletBalance, useActiveWallet } from 'thirdweb/react'
import { BigNumber, ethers } from 'ethers'
import { etherlinkTestnet } from 'thirdweb/chains'
import SwapRouterAbi from '../../../artifacts/contracts/SwapRouter.sol/SwapRouter.json'
import SwapBatcherAbi from '../../../artifacts/contracts/SwapBatcher.sol/SwapBatcher.json'
import { getContract, prepareContractCall, waitForReceipt } from 'thirdweb'
import { allowance, approve } from 'thirdweb/extensions/erc20'
import { generatePaths } from '@/lib/generatePaths'
import { useFindBestRoute } from '@/hooks/use-find-best-route'

const getTokenData = (tokenValue: string) =>
  tokenOptionsTestnet.find(token => token.address === tokenValue) || tokenOptionsTestnet[0]

const swapRouterContract = getContract({
  address: env_vars.SWAP_ROUTER_ADDRESS,
  chain: { ...etherlinkTestnet, rpc: env_vars.RPC_URL },
  client,
})

export default function Swap() {
  const { mutateAsync: sendTx, data: transactionResult, isPending } = useSendTransaction()
  const { mutateAsync: sendCalls, data: id, isPending: isSendingCall } = useSendCalls()
  const { mutateAsync: findBestPath, isLoading: isFindingBestPath } = useFindBestRoute()
  const {
    mutateAsync: estimateGas,
    data: gasEstimate,
    isPending: isEstimatingGas,
  } = useEstimateGas()

  const onClick = async () => {
    try {
      const amountIn = BigInt(ethers.utils.parseUnits(fromAmount, 18).toString())
      const amountMinOut = BigInt(ethers.utils.parseUnits(toAmount, 18).toString())
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 200)

      const doSwap = prepareContractCall({
        contract: swapRouterContract,
        method:
          'function swapExactTokensForTokens(uint amountIn, uint amountMinOut, address[] calldata path, uint deadline) external returns (uint[] memory amounts)',
        params: [amountIn, amountMinOut, bestRouteAddresses, deadline],
      })
      const approveWrapper = approve({
        contract: tokenContract,
        amount: fromAmount,
        spender: env_vars.SWAP_ROUTER_ADDRESS,
      })
      const txApprove = await sendTx(approveWrapper)
      await waitForReceipt(txApprove)
      console.log('Spend Approved')

      await sendTx(doSwap)
    } catch (error: any) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Swap failed',
        description: error?.data?.message || error?.message,
      })
    }
  }
  const [deadlineMins, setDeadlineMins] = useState('10000')
  const [networkFee, setNetworkFee] = useState('0')
  const [bestRoute, setBestRoute] = useState<string[]>([])
  const [bestRouteAddresses, setBestRouteAddresses] = useState<string[]>([])
  const [abrOpportunity, setAbrOpportunity] = useState(false)
  const [fromToken, setFromToken] = useState(tokenAddresses.WETH)
  const [toToken, setToToken] = useState(tokenAddresses.USDC)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [slippage, setSlippage] = useState('0.5')
  const { toast } = useToast()
  const tokenContract = getContract({
    address: getTokenData(fromToken).address,
    chain: { ...etherlinkTestnet, rpc: env_vars.RPC_URL },
    client,
  })

  const wallet = useActiveWallet()
  const { data: fromBalance } = useWalletBalance({
    chain: { rpc: env_vars.RPC_URL, id: 128123 },
    tokenAddress: getTokenData(fromToken)?.address,
    address: wallet?.getAccount()?.address,
    client,
  })

  const { data: toBalance } = useWalletBalance({
    chain: { rpc: env_vars.RPC_URL, id: 128123 },
    tokenAddress: getTokenData(toToken)?.address,
    address: wallet?.getAccount()?.address,
    client,
  })

  const paths = [
    // [tokenAddresses.USDC, tokenAddresses.DAI, tokenAddresses.WBTC],
    [tokenAddresses.USDC, tokenAddresses.DAI],
    // [tokenAddresses.USDC, tokenAddresses.WBTC],
  ]

  const handleSwapTokens = async () => {
    if (fromAmount) {
      await handleEstimateRoute(fromToken, toToken)
    }
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleEstimateRoute = async (fromToken: string, toToken: string) => {
    try {
      if (!fromAmount) {
        toast({
          title: 'Enter Amount',
          description: 'Please enter an amount to swap',
          variant: 'destructive',
        })
        return
      }
      const amountIn = BigInt(ethers.utils.parseUnits(fromAmount, 18).toString())
      const paths = generatePaths(fromToken, toToken)
      const { bestPath, minAmountOut, tokenSymbols } = await findBestPath({
        amountStr: fromAmount,
        paths,
        slippageTolerance: Number(slippage),
      })
      setBestRouteAddresses(bestPath)
      setToAmount(ethers.utils.formatUnits(BigInt(minAmountOut), 18))
      setBestRoute(tokenSymbols)
      setAbrOpportunity(amountIn < minAmountOut)

      const estimatedApproveGas = await estimateGas(
        approve({
          contract: tokenContract,
          amount: fromAmount,
          spender: env_vars.SWAP_ROUTER_ADDRESS,
        })
      )
      setNetworkFee(ethers.utils.formatUnits(estimatedApproveGas, 9))

      toast({
        title: 'Route Estimated',
        description: `Best route found with ${slippage}% slippage`,
      })
    } catch (error: any) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Estimate failed',
        description: error?.data?.message || error?.message,
      })
    }
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
        <p className="text-foreground-secondary">Swap tokens with MEV protection and best rates</p>
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
                            onChange={e => setDeadlineMins(e.target.value)}
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
                      onChange={e => {
                        setFromAmount(e.target.value)
                        setToAmount('')
                      }}
                      className="bg-transparent text-2xl font-semibold outline-none flex-1 placeholder:text-foreground-secondary/50 w-[60%] pr-4"
                    />
                    <Select
                      value={fromToken}
                      onValueChange={value => {
                        setFromToken(value)
                        if (fromAmount) {
                          handleEstimateRoute(value, toToken)
                        }
                      }}
                    >
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
                        {tokenOptionsTestnet
                          .filter(_token => _token.address !== toToken)
                          .map((token, index) => (
                            <SelectItem key={token.address} value={token.address}>
                              <TokenProvider
                                address={token.address}
                                chain={{ rpc: env_vars.RPC_URL, id: 128123 }}
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
                      Balance: {Number(fromBalance?.displayValue).toFixed(2) || 0}{' '}
                      {fromTokenData.symbol}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground-secondary">{0}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-neon-cyan hover:text-neon-cyan/80"
                        onClick={() => setFromAmount(fromBalance?.displayValue!)}
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
                    <Select
                      value={toToken}
                      onValueChange={value => {
                        setToToken(value)
                        if (fromAmount) {
                          handleEstimateRoute(fromToken, value)
                        }
                      }}
                    >
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
                        {tokenOptionsTestnet
                          .filter(_token => _token.address !== fromToken)
                          .map((token, index) => (
                            <SelectItem key={token.address} value={token.address}>
                              <TokenProvider
                                address={token.address}
                                chain={{ rpc: env_vars.RPC_URL, id: 128123 }}
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
                      Balance: {Number(toBalance?.displayValue).toFixed(2)} {toTokenData.symbol}
                    </span>
                    <span className="text-foreground-secondary">{}</span>
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
                        1 {getTokenData(fromToken).symbol} = {'1'} {getTokenData(toToken).symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Best Route</span>
                      <span className=" text-xs">{bestRoute.toString().replace(/,/g, ' -> ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Abitrage Opportunity</span>
                      <span className={`${abrOpportunity ? 'text-neon-green' : 'text-neon-pink'}`}>
                        {abrOpportunity ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary">Est. Network Fee</span>
                      <span>~{Number(networkFee || 0).toFixed(6)} XTZ</span>
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
                  onClick={() => handleEstimateRoute(fromToken, toToken)}
                  disabled={!fromAmount || isEstimating || isEstimatingGas || isFindingBestPath}
                >
                  {isEstimating || isEstimatingGas || isFindingBestPath ? (
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
                  onClick={onClick}
                  disabled={
                    !toAmount ||
                    isSwapping ||
                    isPending ||
                    isSendingCall ||
                    isEstimatingGas ||
                    isFindingBestPath
                  }
                >
                  {isPending || isSendingCall || isSwapping ? (
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
