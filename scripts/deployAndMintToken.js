const hardhat = require('hardhat')
const dotenv = require('dotenv')

const ethers = hardhat.ethers
dotenv.config()

async function main() {
  const [deployer] = await ethers.getSigners()
  const tokens = ['USDC', 'USDT', 'DAI', 'WETH', 'WBTC']

  const ERC20Preset = await ethers.getContractFactory('ERC20PresetMinterPauser')
  for (const token of tokens) {
    const tToken = await ERC20Preset.deploy(`Test t${token}`, `t${token}`)
    await tToken.deployed()
    console.log(`t${token} deployed at: `, tToken.address)
    const amount = ethers.utils.parseUnits('100000', 18)
    await tToken.mint(deployer.address, amount)
    console.log('Minted', ethers.utils.formatUnits(amount, 18), `t${token}`)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
