require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  const [keeper] = await ethers.getSigners()

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
