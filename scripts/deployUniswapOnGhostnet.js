// scripts/deployUniswapOnGhostnet.js
const { ethers } = require('hardhat')
require('dotenv').config()

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deployer:', deployer.address)

  // 1️⃣ Deploy WETH9 from periphery
  const WETH9 = await ethers.getContractFactory('WETH9')
  const weth = await WETH9.deploy()
  await weth.deployed()
  console.log('WETH9 deployed at:', weth.address)

  // 2️⃣ Deploy UniswapV2Factory from core
  const FactoryJson = require('@uniswap/v2-core/build/UniswapV2Factory.json')
  const Factory = new ethers.ContractFactory(FactoryJson.abi, FactoryJson.bytecode, deployer)
  const factory = await Factory.deploy(deployer.address /* feeToSetter */)
  await factory.deployed()
  console.log('Factory deployed at:', factory.address)

  // 3️⃣ Deploy UniswapV2Router02 from periphery
  const RouterJson = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
  const Router = new ethers.ContractFactory(RouterJson.abi, RouterJson.bytecode, deployer)
  const router = await Router.deploy(factory.address, weth.address)
  await router.deployed()
  console.log('Router deployed at:', router.address)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
