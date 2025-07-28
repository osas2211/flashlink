// findBestPath.ts

import { ethers } from 'ethers'
import UniswapV2Router02ABI from '@uniswap/v2-periphery/build/UniswapV2Router02.json'
import { toast } from 'sonner'
import { tokenOptionsTestnet } from '@/constants/token_addresses'
import { env_vars } from './env_vars'

// JSON-RPC provider & router instance
const provider = new ethers.providers.JsonRpcProvider(env_vars.RPC_URL)
const routerContract = new ethers.Contract(
  env_vars.ROUTER_ADDRESS,
  UniswapV2Router02ABI.abi,
  provider
)

// Minimal ERC20 ABI for decimals()
const ERC20_DECIMALS_ABI = ['function decimals() view returns (uint8)']

export interface PathResult {
  /** Highest output token amount (raw smallest units) */
  bestOutput: bigint
  /** Minimum acceptable output after slippage (raw smallest units) */
  minAmountOut: bigint
  /** Winning address path */
  bestPath: string[]
  /** Human symbols for that path */
  tokenSymbols: string[]
}

/**
 * Determine, for a given input token amount, which path yields the most output
 * tokens, and calculate a slippage-adjusted minimum output floor.
 *
 * amountStr is always the amount of the input token (e.g. USDC).
 * bestOutput/minAmountOut correspond to the output token (e.g. DAI).
 *
 * @param amountStr           Amount of input token, as a human string, e.g. "10.0" for 10 USDC
 * @param paths               Array of candidate paths (arrays of token addresses)
 * @param slippageTolerance   Slippage percentage (e.g. 0.5 for 0.5%)
 */
export async function findBestPath(
  amountStr: string,
  paths: string[][],
  slippageTolerance: number | string = 0
): Promise<PathResult> {
  const slippagePct =
    typeof slippageTolerance === 'string' ? parseFloat(slippageTolerance) : slippageTolerance
  const slippageBps = Math.floor(slippagePct * 100)

  let bestOutputRaw: bigint = BigInt(0)
  let bestPath: string[] = []
  let tokenSymbols: string[] = []

  for (const path of paths) {
    const inToken = path[0]
    const outToken = path[path.length - 1]
    try {
      // 1) Fetch decimals for input token and parse human amount
      const inDecimals = await new ethers.Contract(inToken, ERC20_DECIMALS_ABI, provider).decimals()
      const amountInRaw = BigInt(ethers.utils.parseUnits(amountStr, inDecimals).toString())

      // 2) Query router for output amounts
      const amounts = await routerContract.getAmountsOut(ethers.BigNumber.from(amountInRaw), path)
      const outputRaw = BigInt(amounts[amounts.length - 1].toString())

      // 3) Track the best output
      if (outputRaw > bestOutputRaw) {
        bestOutputRaw = outputRaw
        bestPath = [...path]
        tokenSymbols = tokenOptionsTestnet
          .filter(t => bestPath.includes(t.address))
          .map(t => t.symbol)
      }
    } catch (err: any) {
      console.warn(`Skipping path ${path.join(' → ')}:`, err.reason || err.message)
      toast.error(`Skipping path ${path.join(' → ')}: ${err.reason || err.message}`)
    }
  }

  if (bestPath.length === 0) {
    throw new Error('No viable output for given input amount')
  }

  // 4) Apply slippage on the output token
  const minAmountOutRaw = (bestOutputRaw * BigInt(10000 - slippageBps)) / BigInt(10000)

  return {
    bestOutput: bestOutputRaw,
    minAmountOut: minAmountOutRaw,
    bestPath,
    tokenSymbols,
  }
}
