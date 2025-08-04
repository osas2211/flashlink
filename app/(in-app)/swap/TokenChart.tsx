'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { TokenOption } from '@/constants/token_addresses'

// 1) Dynamic import to disable SSR (so TradingView only mounts once on the client)
const SymbolOverview = dynamic(
  () => import('react-ts-tradingview-widgets').then(mod => mod.SymbolOverview),
  { ssr: false }
)

// 2) Wrap in React.memo to avoid unnecessary re-renders
const MemoedSymbolOverview = React.memo(SymbolOverview)

export const TokenChart = ({
  fromTokenData,
  toTokenData,
}: {
  fromTokenData: TokenOption
  toTokenData: TokenOption
}) => {
  // 3) Memoize the symbols array so it's === the same between renders
  const symbols = useMemo(
    () => [
      [fromTokenData.label, fromTokenData.symbol === 'WETH' ? 'ETH' : fromTokenData.symbol],
      [toTokenData.label, toTokenData.symbol],
    ],
    [fromTokenData.label, fromTokenData.symbol, toTokenData.label, toTokenData.symbol]
  )

  return (
    <div className="space-y-6 col-span-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <MemoedSymbolOverview
          symbols={symbols}
          dateFormat="MMM dd, yyyy"
          colorTheme="dark"
          chartType="area"
          locale="en"
          scaleMode="Percentage"
          height={700}
          width="100%"
        />
      </motion.div>
    </div>
  )
}
