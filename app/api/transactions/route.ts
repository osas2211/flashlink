import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('Missing MONGODB_URI env var')

let clientPromise: Promise<MongoClient>
if (!globalThis._mongoClientPromise) {
  globalThis._mongoClientPromise = new MongoClient(uri).connect()
}
clientPromise = globalThis._mongoClientPromise

type TxRecord = {
  createdAt: Date
  userAddress: string
  txHash: string
  amountSwapped: string | number
  amountReceived: string | number
  fromToken: string
  toToken: string
  status: string
}

export async function POST(request: Request) {
  let body: Partial<TxRecord>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { userAddress, txHash, amountSwapped, amountReceived, fromToken, toToken, status } = body

  if (
    !userAddress ||
    !txHash ||
    amountSwapped == null ||
    amountReceived == null ||
    !fromToken ||
    !toToken ||
    !status
  ) {
    return NextResponse.json(
      {
        error:
          'Missing required fields: userAddress, txHash, amountSwapped, amountReceived, fromToken, toToken, status',
      },
      { status: 400 }
    )
  }

  const record: TxRecord = {
    createdAt: new Date(),
    userAddress,
    txHash,
    amountSwapped,
    amountReceived,
    fromToken,
    toToken,
    status,
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const res = await db.collection('transactions').insertOne(record)
    return NextResponse.json({ success: true, id: res.insertedId, record }, { status: 201 })
  } catch (err: any) {
    console.error('Mongo insert error', err)
    return NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const userAddress = url.searchParams.get('userAddress')

  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<TxRecord>('transactions')

    const filter = userAddress ? { userAddress: userAddress.toLowerCase() } : {}

    const records = await collection.find(filter).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ transactions: records }, { status: 200 })
  } catch (err: any) {
    console.error('Mongo fetch error', err)
    return NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 })
  }
}

// Deny other methods
export const PUT = () => NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
export const DELETE = () => NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
