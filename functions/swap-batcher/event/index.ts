import { Interface } from '@ethersproject/abi'
import { Web3Function, Web3FunctionEventContext } from '@gelatonetwork/web3-functions-sdk'
import { Contract } from 'ethers'

const SWAP_BATCHER_ABI = [
  'event OrderQueued(uint indexed orderId, address indexed user)',
  'function executeBatch() external',
  'function getQueueLength() external view returns (uint256)',
]

Web3Function.onRun(async (context: Web3FunctionEventContext) => {
  // Get event log from Web3FunctionEventContext
  const { log, multiChainProvider, userArgs } = context
  const provider = multiChainProvider.chainId(128123)
  const swap_batcher_contract = new Contract(
    userArgs.swap_batcher as string,
    SWAP_BATCHER_ABI,
    provider
  )
  // Parse your event from ABI
  const batcher = new Interface(SWAP_BATCHER_ABI)
  const event = batcher.parseLog(log)

  // Handle event data
  const { orderId, user } = event.args
  console.log(`Order ${orderId} added by ${user}`)

  const queue_length = await swap_batcher_contract.getQueueLength()
  if (BigInt(queue_length) == BigInt(5)) {
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

  return { canExec: false, message: `Event processed ${log.transactionHash}` }
})
