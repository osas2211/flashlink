// verify‑contracts.js
import { ethers } from 'ethers'

// load your RPC URL from env or hard‑code it
const RPC_URL = process.env.RPC_URL
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

const ADDRESSES = {
  SWAP_ROUTER: '0x93024dA8Aab69A2DfBEbaCbd30f3c63FE7784ED2',
  SWAP_BATCHER: '0x7D4E85816699237e45cf25D58427210575B472D2',
  ROUTER: '0xB2e76068ae2f4a73644E8C8523dBd0C5d5F80FC6',
  FACTORY: '0x5301dB54e22E6F0255BA15D6704eF97c1c9D6430',
}

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]

async function main() {
  for (const [label, addr] of Object.entries(ADDRESSES)) {
    const code = await provider.getCode(addr)
    console.log(`\n${label} (${addr}):`)
    if (code === '0x') {
      console.log('  ⛔ no contract deployed at this address')
      continue
    }
    console.log('  ✅ contract deployed')

    // If it’s plausibly an ERC‑20, try reading token metadata:
    try {
      const token = new ethers.Contract(addr, ERC20_ABI, provider)
      const [name, symbol, decimals] = await Promise.all([
        token.name(),
        token.symbol(),
        token.decimals(),
      ])
      console.log(`  • ERC‑20? name=${name}, symbol=${symbol}, decimals=${decimals}`)
    } catch {
      console.log('  • Not an ERC‑20 (or metadata calls failed)')
    }

    // If you want factory/router-specific calls, you can extend here…
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
