// scripts/seedLiquidity.js
const { ethers } = require('ethers')
const FactoryJson = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const RouterJson = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const { tokenAddresses } = require('../constants/token_addresses')
require('dotenv').config()

const AMOUNT = ethers.utils.parseUnits('1000', 18)

// ─── Environment ───────────────────────────────────────────────────────────────
const { RPC_URL, PRIVATE_KEY, FACTORY_ADDRESS, ROUTER_ADDRESS } = process.env

if (!RPC_URL || !PRIVATE_KEY || !FACTORY_ADDRESS || !ROUTER_ADDRESS) {
  throw new Error('Please set all required environment variables in .env')
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const factory = new ethers.Contract(process.env.FACTORY_ADDRESS, FactoryJson.abi, wallet)
  const router = new ethers.Contract(process.env.ROUTER_ADDRESS, RouterJson.abi, wallet)

  console.log('Factory at:', factory.address)
  console.log('Router  at:', router.address)

  const TOKENS = {
    USDC: tokenAddresses.USDC,
    DAI: tokenAddresses.DAI,
    WBTC: tokenAddresses.WBTC,
    USDT: tokenAddresses.USDT,
    WETH: tokenAddresses.WETH,
  }
  const PAIRS = [
    ['USDC', 'DAI'],
    ['USDC', 'WBTC'],
    ['USDC', 'USDT'],
    ['USDC', 'WETH'],
    ['DAI', 'WBTC'],
    ['DAI', 'USDT'],
    ['DAI', 'WETH'],
    ['WBTC', 'USDT'],
    ['WBTC', 'WETH'],
    ['USDT', 'WETH'],
  ]
  const AMOUNT = ethers.utils.parseUnits('100000000', 18)

  async function approve(addr) {
    const erc20 = new ethers.Contract(
      addr,
      ['function approve(address,uint256) external returns (bool)'],
      wallet
    )
    await erc20.approve(router.address, AMOUNT)
  }

  for (const [A, B] of PAIRS) {
    const addrA = TOKENS[A],
      addrB = TOKENS[B]
    console.log(`\n⏳ Seeding pool ${A} ↔ ${B}`)

    // approve both tokens
    await approve(addrA)
    await approve(addrB)
    console.log(' • Approved router to spend tokens')

    // **Guard createPair** so we never call it if it already exists
    const pairAddr = await factory.getPair(addrA, addrB)
    if (pairAddr !== ethers.constants.AddressZero) {
      console.log(` • Pair already exists at ${pairAddr}`)
    } else {
      console.log(` • Creating pair…`)
      const tx = await factory.createPair(addrA, addrB)
      await tx.wait()
      console.log(' • Pair created!')
    }

    // add liquidity
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10
    const txAdd = await router.addLiquidity(
      addrA,
      addrB,
      AMOUNT,
      AMOUNT,
      0,
      0,
      wallet.address,
      deadline
    )
    await txAdd.wait()
    console.log(` • Liquidity added: ${A} + ${B}`)
  }

  // final sanity‐check quote
  const [, out] = await router.getAmountsOut(ethers.utils.parseUnits('1', 18), [
    TOKENS.USDC,
    TOKENS.DAI,
  ])
  console.log(`\n✅ 1 USDC → ${ethers.utils.formatUnits(out, 18)} DAI`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
