import { NextRequest, NextResponse } from 'next/server'
import { executeBatchIfReady } from '@/lib/batcher'

export async function GET(req: NextRequest) {
  try {
    const result = await executeBatchIfReady()
    return NextResponse.json({ success: true, result })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
