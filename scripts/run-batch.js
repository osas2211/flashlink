// scripts/run-batch.js
require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  // 1. Get signer (owner/keeper)
  const [keeper] = await ethers.getSigners()

  // 2. Connect to your deployed batcher
  const batcher = await ethers.getContractAt('SwapBatcher', process.env.SWAP_BATCHER_ADDRESS)

  // 3. Check queue length
  const queueLen = await batcher.queueLength()
  console.log('Orders queued:', queueLen.toString())

  // 4. Conditional execution
  const MIN_ORDERS = parseInt(process.env.MIN_ORDERS || '5')
  if (queueLen.gte(MIN_ORDERS)) {
    console.log('Executing batch...')
    const tx = await batcher.connect(keeper).executeBatch()
    console.log('Transaction hash:', tx.hash)
    await tx.wait()
    console.log('Batch executed ✅')
  } else {
    console.log(`Waiting for at least ${MIN_ORDERS} orders…`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

// npx hardhat run scripts/run-batch.js --network etherlink
