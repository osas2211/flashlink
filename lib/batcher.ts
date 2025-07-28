// scripts/batcherCron.js
import cron from 'node-cron'
import { ethers } from 'ethers'
import SwapBatcherAbi from '../artifacts/contracts/SwapBatcher.sol/SwapBatcher.json'
import { env_vars } from './env_vars'

// --- setup your provider & signer ---
const provider = new ethers.providers.JsonRpcProvider(env_vars.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

// --- point at your deployed batcher ---
const batcher = new ethers.Contract(env_vars.SWAP_BATCHER_ADDRESS, SwapBatcherAbi.abi, wallet)

export async function executeBatchIfReady() {
  // 1) Check how many orders are queued
  const n = (await batcher.queue()).length // or batcher.queueLength() if you add that getter

  // 2) If ≥5, run it
  if (n >= 5) {
    console.log(`🔁 Found ${n} orders, running batch...`)
    const tx = await batcher.executeBatch()
    console.log('Batch tx hash:', tx.hash)
    await tx.wait()
    console.log('✅ Batch complete!')
  } else {
    console.log(`⏳ Only ${n} orders; waiting for 5 or next 5 min tick`)
  }
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log(new Date().toISOString(), '— cron tick')
  executeBatchIfReady().catch(err => console.error('Batch error', err))
})
