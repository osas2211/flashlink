// scripts/batcherCron.js

// 1️⃣ Load .env
import 'dotenv/config'

// 2️⃣ Imports
import cron from 'node-cron'
import { ethers } from 'ethers'
import SwapBatcherAbi from '../artifacts/contracts/SwapBatcher.sol/SwapBatcher.json'
// adjust this path if env_vars.js lives elsewhere:
import { env_vars } from './env_vars'

// 3️⃣ Sanity-check your RPC_URL and PRIVATE_KEY
console.log('RPC_URL:', process.env.RPC_URL || env_vars.RPC_URL)
console.log('PRIVATE_KEY set?', !!process.env.PRIVATE_KEY)

// 4️⃣ Setup provider & signer
const rpcUrl = process.env.RPC_URL || env_vars.RPC_URL
if (!rpcUrl) throw new Error('RPC_URL is not defined')
const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
  chainId: 128123,
  name: 'EtherLink',
})

const pk = process.env.PRIVATE_KEY
if (!pk) throw new Error('PRIVATE_KEY is not defined')
const wallet = new ethers.Wallet(pk, provider)

// 5️⃣ Point at your deployed batcher
const batcherAddress = env_vars.SWAP_BATCHER_ADDRESS
if (!batcherAddress) throw new Error('SWAP_BATCHER_ADDRESS is not defined')
const batcher = new ethers.Contract(batcherAddress, SwapBatcherAbi.abi, wallet)

// 6️⃣ Your helper
export async function executeBatchIfReady() {
  // we need a length getter on the contract:
  const n = await batcher.getQueueLength()
  console.log(`Queue length: ${n.toString()}`)
  if (n.gte ? n.gte(5) : Number(n) >= 5) {
    console.log(`🔁 Found ${n} orders; running batch…`)
    const tx = await batcher.executeBatch()
    console.log('Batch tx hash:', tx.hash)
    await tx.wait()
    console.log('✅ Batch complete!')
  } else {
    console.log(`⏳ Only ${n} orders; waiting for next tick`)
  }
}

// 7️⃣ Schedule on cron
cron.schedule('*/5 * * * *', () => {
  console.log(new Date().toISOString(), '— cron tick')
  executeBatchIfReady().catch(err => {
    console.error('Batch error', err)
  })
})
