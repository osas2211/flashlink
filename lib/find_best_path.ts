import { ethers } from 'ethers'
import UniswapV2Router02ABI from '@uniswap/v2-periphery/build/UniswapV2Router02.json'
import { env_vars } from './env_vars'
import { toast } from 'sonner'

const RPC_URL = env_vars.RPC_URL
const ROUTER_ADDRESS = env_vars.ROUTER_ADDRESS
const provider = ethers.getDefaultProvider(RPC_URL)
const routerContract = new ethers.Contract(ROUTER_ADDRESS, UniswapV2Router02ABI.abi, provider)

export const findBestPath = async (amountIn: bigint, paths: string[][]) => {
  let bestOutput: bigint = BigInt(0)
  let bestPath: string[] = []

  for (const path of paths) {
    try {
      console.log('getting amount for', path)
      const amounts = await routerContract.getAmountsOut(ethers.utils.parseUnits('1', 18), path)
      const output = amounts[amounts.length - 1]
      // console.log('Output', amounts, output)
      if (output > bestOutput) {
        bestOutput = output
        bestPath = path
      }
    } catch (error: any) {
      console.log(error)
      console.log(`Skipping path ${path.join('→')}: ${error.reason || error.message}`)
      toast.error(`Skipping path ${path.join('→')}: ${error.reason || error.message}`)
    }
  }

  return { bestOutput, bestPath }
}
