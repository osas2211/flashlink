import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import AppLayout from '@/components/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlashLink - MEV-Resistant DeFi Router',
  description: 'Trade with confidence using our MEV-resistant DeFi router',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AppLayout>{children}</AppLayout>
    </main>
  )
}
