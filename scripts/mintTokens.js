const hardhat = require('hardhat')
const dotenv = require('dotenv')
const { tokenAddresses } = require('../constants/token_addresses')

const ethers = hardhat.ethers
dotenv.config()

async function main() {
  const [minter] = await ethers.getSigners()
  const tokens = ['USDC', 'USDT', 'DAI', 'WETH', 'WBTC']

  const ERC20Preset = await ethers.getContractFactory('ERC20PresetMinterPauser')
  for (const token of tokens) {
    const tToken = await ERC20Preset.attach(tokenAddresses[token])
    const amount = ethers.utils.parseUnits('1000000000', 18)
    await tToken.mint(minter.address, amount)
    console.log('Minted', ethers.utils.formatUnits(amount, 18), `t${token}`)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
