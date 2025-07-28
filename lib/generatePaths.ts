import { tokenAddresses } from '@/constants/token_addresses'

/**
 * Generate all 2‑way and 3‑way swap paths between two tokens.
 *
 * @param fromToken – the address of the input token
 * @param toToken   – the address of the output token
 * @returns An array of paths (each path is an array of token addresses)
 */

export function generatePaths(fromToken: string, toToken: string): string[][] {
  const tokens = {
    USDC: tokenAddresses.USDC,
    DAI: tokenAddresses.DAI,
    WBTC: tokenAddresses.WBTC,
    USDT: tokenAddresses.USDT,
    WETH: tokenAddresses.WETH,
  }
  // 2‑way (direct) path
  const twoWay: string[][] = [[fromToken, toToken]]

  // 3‑way paths via every other token in the map
  const threeWay: string[][] = Object.values(tokens)
    .filter(addr => addr !== fromToken && addr !== toToken)
    .map(intermediate => [fromToken, intermediate, toToken])

  return [...twoWay, ...threeWay]
}
