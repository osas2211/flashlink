# FlashLink

MEV-resistant DeFi router on Etherlink that finds optimal swap routes off-chain and batches them atomically on-chain.
<a href="https://flashlink-inky.vercel.app/" target="_blank">Live Demo</a>

## Key Features

- **Route Optimization**: off-chain path finding with Ethers.js
- **Atomic Batching**: SwapRouter & Batch contracts execute multi-swap transactions in one call
- **Automation**: Gelato Automate schedules & fires batch executions via a dedicated proxy
- **Wallet Integration**: Utilized ThirdWeb SDK in the frontend for seamless wallet connection, authentication, and on-chain interactions.
- **UI**: Next.js/React frontend with ThirdWeb wallet connect, real-time price charts, and swap interface
- **Logging**: MongoDB stores swap records (`createdAt`, `txHash`, `amounts`, `tokens`, `status`) with TanStack Query hooks for efficient data fetching and caching.

## Quickstart

1. **Clone & install**
   ```bash
   git clone https://github.com/osas2211/flashlink.git
   cd flashlink
   npm install
   ```
2. **Configure** your `.env.local`:
   ```
   THIRD_WEB_CLIENT_ID
   NEXT_PUBLIC_THIRD_WEB_CLIENT_ID
   ROUTER_ADDRESS
   NEXT_PUBLIC_ROUTER_ADDRESS
   FACTORY_ADDRESS
   RPC_URL
   NEXT_PUBLIC_RPC_URL
   PROVIDER_URLS
   CHAIN_ID = 128123
   NEXT_PUBLIC_CHAIN_ID = 128123
   PRIVATE_KEY
   GELATO_DEDICATED_MSG_SENDER
   WETH_ADDRESS
   ROUTER_PARTNER=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_SWAP_ROUTER_ADDRESS = 0x5eAB6aED765965C045c9feD9669F6af374fBf153
   SWAP_ROUTER_ADDRESS = 0x5eAB6aED765965C045c9feD9669F6af374fBf153
   NEXT_PUBLIC_SWAP_BATCHER_ADDRESS = 0x6F0730CB0eD4939F447Ec01970eC4351186Ce5a2
   SWAP_BATCHER_ADDRESS = 0x6F0730CB0eD4939F447Ec01970eC4351186Ce5a2
   ETHERSCAN_API_KEY
   MONGODB_URI
   ```

````
3. **Deploy contracts** to Ghostnet:
```bash
npx hardhat run scripts/deploy.ts --network ghostnet
````

4. **Run the app**

   ```bash
   npm run dev
   ```

## ThirdWeb Wallet Connect code SNIPPET

```tsx
///components/Header.tsx
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb_utils'

export default function Header() {
  return (
    <div className="flex items-center space-x-4">
      <ConnectButton
        client={client}
        wallets={wallets}
        chains={[{ rpc: env_vars.RPC_URL, id: 128123, testnet: true }]}
        signInButton={{ className: '!h-[45px]' }}
      />
    </div>
  )
}
```

## Swap Execution function code SNIPPET

```tsx
///app/(in-app)/swap/page.tsx
import { etherlinkTestnet } from 'thirdweb/chains'
import { getContract, prepareContractCall, waitForReceipt } from 'thirdweb'
import { approve } from 'thirdweb/extensions/erc20'

const handleSwapExecution = async () => {
  const amountIn = BigInt(ethers.utils.parseUnits(fromAmount, 18).toString())
  const amountMinOut = BigInt(ethers.utils.parseUnits(toAmount, 18).toString())
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * Number(deadlineMins))

  const doSwap = prepareContractCall({
    contract: batcherContract,
    method:
      'function queueOrder(uint amountIn, uint amountMinOut, address[] calldata path, uint deadline) external',
    params: [amountIn, amountMinOut, bestRouteAddresses, deadline],
  })
  const approveWrapper = approve({
    contract: tokenContract,
    amount: fromAmount,
    spender: env_vars.SWAP_BATCHER_ADDRESS,
  })
  const txApprove = await sendTx(approveWrapper)
  await waitForReceipt(txApprove)
  console.log('Spend Approved')

  const tx = await sendTx(doSwap)
}
```

## Automated Batch Order Execution code SNIPPET

```tsx
// functions/swap-batcher/index.ts
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
```

## License

MIT
