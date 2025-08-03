// scripts/deploy_swaprouter.js
// Hardhat deployment script for SwapRouter.sol

const { ethers } = require('hardhat')
require('dotenv').config()

async function main() {
  // Fetch deployer's account
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with account:', deployer.address)

  // Read the AMM router address from env (e.g. UniswapV2/compatible router)
  const ammRouterAddress = process.env.ROUTER_ADDRESS
  if (!ammRouterAddress) {
    throw new Error('Please set AMM_ROUTER_ADDRESS environment variable in .env')
  }
  console.log('Using AMM router address:', ammRouterAddress)

  // Compile & deploy SwapRouter
  const SwapRouter = await ethers.getContractFactory('SwapRouter')
  const swapRouter = await SwapRouter.deploy(ammRouterAddress)
  await swapRouter.deployed()

  console.log('SwapRouter deployed to:', swapRouter.address)

  const SwapBatcher = await ethers.getContractFactory('SwapBatcher')
  const swapBatcher = await SwapBatcher.deploy(
    process.env.SWAP_ROUTER_ADDRESS,
    process.env.GELATO_DEDICATED_MSG_SENDER
  )
  await swapBatcher.deployed()

  console.log('SwapBatcher deployed to:', swapBatcher.address)
}

// run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
