import { Web3Function, Web3FunctionContext } from '@gelatonetwork/web3-functions-sdk'
import { Contract } from 'ethers'

const SWAP_BATCHER_ABI = [
  'function executeBatch() external',
  'function getQueueLength() external view returns (uint256)',
]

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { multiChainProvider, userArgs } = context
  const provider = multiChainProvider.chainId(128123)

  // Retrieve Last oracle update time
  const swap_batcher_contract = new Contract(
    userArgs.swap_batcher as string,
    SWAP_BATCHER_ABI,
    provider
  )

  const queue_length = await swap_batcher_contract.getQueueLength()
  if (BigInt(queue_length) > BigInt(0)) {
    return {
      canExec: true,
      callData: [
        {
          to: userArgs.swap_batcher as string,
          data: swap_batcher_contract.interface.encodeFunctionData('executeBatch'),
        },
      ],
    }
  }

  return {
    canExec: true,
    callData: [],
  }
})
