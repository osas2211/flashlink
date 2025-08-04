export const runtime = 'nodejs'

// Polyfill global fetch with node-fetch (no invalid referrer)
import fetch from 'node-fetch'
;(globalThis as any).fetch = fetch

import { NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { providers } from 'ethers'
import { env_vars } from '@/lib/env_vars'
import dotenv from 'dotenv'
dotenv.config()

const provider = new providers.JsonRpcProvider(env_vars.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
const tokenAbi = ['function transfer(address to, uint256 amount) external returns (bool)']

export async function POST(request: Request) {
  const body = await request.json()
  const { to, contract_address } = body as {
    to?: string
    contract_address?: string
  }

  if (!to || !contract_address) {
    return NextResponse.json(
      { error: 'Request body must include `to` and `contract_address`' },
      { status: 400 }
    )
  }

  if (!ethers.utils.isAddress(to)) {
    return NextResponse.json({ error: '`to` is not a valid Ethereum address' }, { status: 400 })
  }

  const tokenContract = new ethers.Contract(contract_address, tokenAbi, wallet)
  let value: ethers.BigNumber
  try {
    value = ethers.utils.parseUnits('1000', 18)
  } catch {
    return NextResponse.json({ error: 'Invalid `amount` format' }, { status: 400 })
  }

  try {
    const tx = await tokenContract.transfer(to, value)
    const receipt = await tx.wait(1)
    return NextResponse.json(
      {
        message: 'Transfer successful',
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Transfer error', err)
    return NextResponse.json({ error: 'Transfer failed', details: err.message }, { status: 500 })
  }
}

// Optional: reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}
