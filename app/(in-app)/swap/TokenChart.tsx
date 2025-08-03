import React from 'react'
import { SymbolOverview } from 'react-ts-tradingview-widgets'
import { motion } from 'framer-motion'
import { TokenOption } from '@/constants/token_addresses'

export const TokenChart = ({
  fromTokenData,
  toTokenData,
}: {
  fromTokenData: TokenOption
  toTokenData: TokenOption
}) => {
  return (
    <div className="space-y-6 col-span-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SymbolOverview
          symbols={[
            [fromTokenData.label, fromTokenData.symbol === 'WETH' ? 'ETH' : fromTokenData.symbol],
            [toTokenData.label, toTokenData.symbol],
          ]}
          dateFormat="MMM dd, yyyy"
          colorTheme="dark"
          chartType="area"
          locale="en"
          scaleMode="Percentage"
          height={700}
          width={'100%'}
        />
      </motion.div>
    </div>
  )
}
