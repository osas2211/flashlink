// scripts/run-batch.js
require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  // 1. Get signer (owner/keeper)
  const [keeper] = await ethers.getSigners()

  // 2. Connect to your deployed batcher
  const batcher = await ethers.getContractAt('SwapBatcher', process.env.SWAP_BATCHER_ADDRESS)
  const tx = await batcher.connect(keeper).executeBatch()

  console.log(tx)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

// npx hardhat run scripts/run-batch.js --network etherlink
